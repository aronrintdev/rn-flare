/* global __DEV__ */
/* eslint global-require: "off" */
import React from 'react';
import { AppState } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import moment from 'moment';
import BackgroundTimer from 'react-native-background-timer';
import { PERMISSIONS } from 'react-native-permissions';
import RNBluetoothInfo from '@bitfly/react-native-bluetooth-info';

import {
    ACCOUNT_SYNC_INTERVAL,
    ACCOUNT_SYNC_INTERVAL_FLARE,
    ACCOUNT_SYNC_INTERVAL_DEV,
} from '../../constants/Config';
import {
    syncAccountDetails,
    fetchContacts,
    changeAppRoot,
} from '../../actions/index';
import { processQueuedBeacons } from '../../actions/beaconActions';
import { getPermission } from '../../actions/userActions';
import { startBleListening } from '../../actions/hardwareActions';
import getCurrentPosition from '../../helpers/location';
import Strings from '../../locales/en';
import SoftLand from './SoftLand';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.shuttingDown = false;
        this.setSyncTiming();
        Navigation.events().bindComponent(this);

        this.state = {
            showSideMenu: false,
            bluetoothEnabled: true,
        };
    }

    componentDidMount() {
        const {
            hasActiveFlare,
            dispatch,
            hardware,
            permissions,
            analyticsToken,
        } = this.props;
        if (hasActiveFlare) {
            dispatch(changeAppRoot('secure-active-event'));
        }

        // Update bluetooth state after first boot
        RNBluetoothInfo.getCurrentState().then(bleState =>
            this.handleBluetoothStateChange(bleState)
        );
        RNBluetoothInfo.addEventListener('change', bleState =>
            this.handleBluetoothStateChange(bleState)
        );

        // Contacts are not stored on the server. It takes a while to fetch them locally, so we
        // start that process now before users need to view them.
        if (permissions.contacts) {
            dispatch(fetchContacts());
        }

        if (!permissions.location) {
            dispatch(getPermission(PERMISSIONS.IOS.LOCATION_ALWAYS));
        }

        if (!hardware || !hardware.bleListening) {
            dispatch(startBleListening());
        }

        // Users may have modified their accounts on other devices or on the web. Keep this device
        // in sync by fetching server-stored data.
        dispatch(
            syncAccountDetails({
                analyticsToken,
            })
        );

        BackgroundTimer.stopBackgroundTimer();
        BackgroundTimer.runBackgroundTimer(
            () => this.syncAccount(),
            this.accountSyncTimeInMs
        );
        AppState.addEventListener('change', newState =>
            this.handleAppStateChange(newState)
        );
    }

    componentDidUpdate(prevProps) {
        const {
            hasActiveFlare,
            crewEventNotificationMessage,
            dispatch,
            permissions: { contacts: contactsPermission },
        } = this.props;
        /**
         * Handle transitions in flare state: reset intervals for fetching data
         */
        if (hasActiveFlare !== prevProps.hasActiveFlare) {
            this.setSyncTiming();
            BackgroundTimer.stop();
            BackgroundTimer.stopBackgroundTimer();

            if (hasActiveFlare) {
                console.log('>>>>> Local notify!');
                PushNotificationIOS.requestPermissions();
                PushNotificationIOS.presentLocalNotification({
                    alertBody: crewEventNotificationMessage,
                    alertTitle: Strings.notifications.title,
                });
                dispatch(changeAppRoot('secure-active-event'));
            } else {
                BackgroundTimer.runBackgroundTimer(
                    () => this.syncAccount(),
                    this.accountSyncTimeInMs
                );
                PushNotificationIOS.removeAllDeliveredNotifications();
            }
        }

        /**
         * Fetch contacts if the permission changes from denied to anything else
         */
        if (prevProps.permissions.contacts === false && contactsPermission) {
            dispatch(fetchContacts());
        }
    }

    componentWillUnmount() {
        this.shuttingDown = true;
        BackgroundTimer.stopBackgroundTimer();
        RNBluetoothInfo.removeEventListener('change', bleState =>
            this.handleBluetoothStateChange(bleState)
        );
        AppState.removeEventListener('change', newState =>
            this.handleAppStateChange(newState)
        );
    }

    /**
     * Fetch account details and submit app status periodically. The frequency at which we sync varies with app state.
     * If a flare is active, sync frequently. If we're in dev, sync a little more than normal. Otherwise use the default
     * timing. All times are set in the environment configuration.
     */
    setSyncTiming() {
        const { hasActiveFlare } = this.props;
        if (hasActiveFlare) {
            this.accountSyncTimeInMs = ACCOUNT_SYNC_INTERVAL_FLARE;
        } else if (__DEV__) {
            this.accountSyncTimeInMs = ACCOUNT_SYNC_INTERVAL_DEV;
        } else {
            this.accountSyncTimeInMs = ACCOUNT_SYNC_INTERVAL;
        }
    }

    goToPushedView = () => {
        const { componentId } = this.props;
        Navigation.push(componentId, {
            component: {
                name: 'com.flarejewelry.app.Home',
            },
        });
    };

    toggleSideMenu = () => {
        const { componentId } = this.props;
        const { showSideMenu } = this.state;
        const newSideMenuState = !showSideMenu;

        Navigation.mergeOptions(componentId, {
            sideMenu: {
                left: {
                    visible: newSideMenuState,
                },
            },
        });

        this.setState({
            showSideMenu: newSideMenuState,
        });
    };

    handleAppStateChange = nextAppState => {
        // eslint-disable-next-line
        console.debug(`App went to state ${nextAppState}.`);
        switch (nextAppState) {
            case 'active':
            case 'inactive':
            case 'background':
            default:
                break;
        }
    };

    handleBluetoothStateChange = bleState => {
        const { connectionState } = bleState.type;
        this.setState({
            bluetoothEnabled: connectionState === 'on',
        });
    };

    navigationButtonPressed({ buttonId }) {
        switch (buttonId) {
            case 'menuButton':
                this.toggleSideMenu();
                break;
            default:
                console.warn('Unhandled button press in home screen.');
                break;
        }
    }

    /**
     * Submit user location and fetch any account updates.
     */
    syncAccount() {
        const {
            analyticsEnabled,
            dispatch,
            analyticsToken,
            permissions,
            hardware,
            problemBeacons,
            handleBeacon,
            authToken,
        } = this.props;
        // Don't kick off a new async request if we're shutting down. This prevents an infinite loop of syncing
        // status -> auth fail -> sign out.
        if (this.shuttingDown || !analyticsEnabled) {
            return;
        }

        // Transmit the current state and retrieve any updates from the server.
        getCurrentPosition({
            enableHighAccuracy: true,
            timeout: ACCOUNT_SYNC_INTERVAL,
        }).then(position => {
            dispatch(
                syncAccountDetails({
                    analyticsToken,
                    status: {
                        timestamp: moment()
                            .utc()
                            .format('YYYY-MM-DD HH:mm:ss'),
                        latitude: position.latitude,
                        longitude: position.longitude,
                        details: {
                            permissions,
                            hardware,
                            position,
                        },
                    },
                })
            );
        });

        // Process any beacon events that we tried (and failed) to submit earlier.
        if (problemBeacons && problemBeacons.length > 0) {
            dispatch(
                processQueuedBeacons(handleBeacon, authToken, problemBeacons)
            );
        }
    }

    render() {
        const { componentId } = this.props;

        return (
            <SafeAreaProvider>
                <SoftLand componentId={componentId} />
            </SafeAreaProvider>
        );
    }
}

const mapStateToProps = state => ({
    analyticsEnabled: state.user.settings.analyticsEnabled,
    crewEventNotificationMessage: state.user.settings.promptMessage,
    hardware: state.hardware,
    hasActiveFlare: state.user.hasActiveFlare,
    latestBeacon: state.beacons.latest,
    permissions: state.user.permissions,
    problemBeacons: state.beacons.problems,
    analyticsToken: state.user.analyticsToken,
    authToken: state.user.authToken,
    radioToken: state.user.radioToken,
});

export default connect(mapStateToProps)(Home);
