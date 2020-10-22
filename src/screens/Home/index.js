/* global __DEV__ */
/* eslint global-require: "off" */
import React from 'react';
import { AppState } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';

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
    CONFIG_DEV,
} from '../../constants/Config';
import {
    syncAccountDetails,
    fetchContacts,
    changeAppRoot,
    setRootComponent,
} from '../../actions';
import { processQueuedBeacons } from '../../actions/beaconActions';
import { getPermission } from '../../actions/userActions';
import { startBleListening } from '../../actions/hardwareActions';
import getCurrentPosition from '../../helpers/location';
import Strings from '../../locales/en';
import SoftLand from './SoftLand';

export { default as PermissionsReminder } from './PermissionsReminder';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.shuttingDown = false;
        this.setSyncTiming();
        this.appStatusSync = null;

        Navigation.events().bindComponent(this);
        this.screenEventListener = Navigation.events().registerComponentDidDisappearListener(
            () => {
                this.setState({ showSideMenu: false });
            }
        );

        this.state = {
            showSideMenu: false,
        };
    }

    componentDidMount() {
        const {
            hasActiveFlare,
            dispatch,
            hardware,
            permissions,
            analyticsToken,
            componentId,
        } = this.props;
        dispatch(setRootComponent(componentId));
        if (hasActiveFlare) {
            dispatch(changeAppRoot('secure-active-event'));
        }
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
        const appStatus = {
            analyticsToken,
        };
        dispatch(syncAccountDetails(appStatus));

        BackgroundTimer.clearInterval(this.appStatusSync);
        this.appStatusSync = BackgroundTimer.setInterval(
            this.syncAccount,
            this.accountSyncTimeInMs
        );
        AppState.addEventListener('change', this.handleAppStateChange);
        RNBluetoothInfo.addEventListener(
            'change',
            this.bluetoothEnabledListener
        );
    }

    componentDidUpdate(prevProps) {
        const {
            hasActiveFlare,
            crewEventNotificationMessage,
            dispatch,
            permissions: { contacts: contactsPermission },
            crewEnabled,
            crews,
        } = this.props;
        /**
         * Handle transitions in flare state: reset intervals for fetching data
         */
        this.requestUserPermission();
        if (hasActiveFlare !== prevProps.hasActiveFlare) {
            this.setSyncTiming();
            BackgroundTimer.clearInterval(this.appStatusSync);

            if (hasActiveFlare) {
                console.log('>>>>> Local notify!');
                if (crewEnabled && crews.length > 0) {
                    PushNotificationIOS.requestPermissions();
                    PushNotificationIOS.presentLocalNotification({
                        alertBody: crewEventNotificationMessage,
                        alertTitle: Strings.notifications.title,
                    });
                }
                dispatch(changeAppRoot('secure-active-event'));
            } else {
                this.appStatusSync = BackgroundTimer.setInterval(
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
        this.unsubscribe = null;
        this.screenEventListener.remove();

        BackgroundTimer.clearInterval(this.appStatusSync);
        AppState.removeEventListener('change', this.handleAppStateChange);
        RNBluetoothInfo.removeEventListener(
            'change',
            this.bluetoothEnabledListener
        );
    }

    bluetoothEnabledListener = resp => {
        const { connectionState } = resp.type;
        if (connectionState === 'off') {
            PushNotificationIOS.requestPermissions();
            PushNotificationIOS.presentLocalNotification({
                alertBody: Strings.notifications.bluetoothDisabled,
                alertTitle: Strings.notifications.title,
            });
        } else {
            PushNotificationIOS.getDeliveredNotifications(notifications => {
                notifications.forEach(notification => {
                    if (notification.title === Strings.notifications.title) {
                        PushNotificationIOS.removeDeliveredNotifications([
                            notification.identifier,
                        ]);
                    }
                });
            });
        }
    };

    requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            this.getFcmToken();
            console.log('Authorization status:', authStatus);
        }
    };

    getFcmToken = async () => {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            console.log('Your Firebase Token is:', fcmToken);
        } else {
            console.log('Failed', 'No token received');
        }
    };

    /**
     * Fetch account details and submit app status periodically. The frequency at which we sync varies with app state.
     * If a flare is active, sync frequently. If we're in dev, sync a little more than normal. Otherwise use the default
     * timing. All times are set in the environment configuration.
     */
    setSyncTiming() {
        const { hasActiveFlare } = this.props;
        if (hasActiveFlare) {
            this.accountSyncTimeInMs = ACCOUNT_SYNC_INTERVAL_FLARE;
        } else if (CONFIG_DEV) {
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

    /**
     * Submit user location and fetch any account updates.
     */
    syncAccount = () => {
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
            const appStatus = {
                analyticsToken,
                status: {
                    timestamp: moment()
                        .utc()
                        .format('YYYY-MM-DD HH:mm:ss'),
                    latitude: position.latitude || '40.66772',
                    longitude: position.longitude || '-73.875537',
                    details: {
                        permissions,
                        hardware,
                        position,
                    },
                },
            };

            dispatch(syncAccountDetails(appStatus));
        });

        // Process any beacon events that we tried (and failed) to submit earlier.
        if (problemBeacons && problemBeacons.length > 0) {
            dispatch(
                processQueuedBeacons(handleBeacon, authToken, problemBeacons)
            );
        }
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
    crewEnabled: state.user.settings.crewEnabled,
    crews: state.user.crews,
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
