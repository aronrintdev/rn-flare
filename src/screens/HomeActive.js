/* global __DEV__ */
/* eslint global-require: "off" */
import React from 'react';
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Alert,
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import BackgroundTimer from 'react-native-background-timer';
import { Navigation } from 'react-native-navigation';
import { PERMISSIONS } from 'react-native-permissions';
import {
    ACCOUNT_SYNC_INTERVAL,
    ACCOUNT_SYNC_INTERVAL_FLARE,
    ACCOUNT_SYNC_INTERVAL_DEV,
    FLARE_TIMELINE_REFRESH_INTERVAL,
    CONFIG_DEV,
} from '../constants/Config';
import {
    EVENT_TIMLINE_SETTING_CREW,
    EVENT_TIMLINE_SETTING_CREW_EMS,
    EVENT_TIMLINE_SETTING_EMS,
} from '../constants/EventTimelineSettings';

import { syncAccountDetails, changeAppRoot } from '../actions/index';
import {
    processQueuedBeacons,
    cancelActiveFlare,
} from '../actions/beaconActions';
import { getEventTimeline, getPermission } from '../actions/userActions';
import { startBleListening } from '../actions/hardwareActions';
import Aura from '../bits/Aura';
import Button from '../bits/Button';
import Colors from '../bits/Colors';
import EventTimeline from '../bits/EventTimeline';
import getCurrentPosition from '../helpers/location';
import Spacing from '../bits/Spacing';
import Strings from '../locales/en';
import Type from '../bits/Type';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        backgroundColor: Colors.theme.peach,
    },
    header: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        paddingTop: Spacing.small,
        paddingBottom: Spacing.medium,
    },
    headerText: {
        marginTop: Spacing.small,
        marginBottom: Spacing.medium,
        fontSize: Type.size.medium,
        fontWeight: 'bold',
        color: Colors.white,
    },
    logo: {
        resizeMode: 'contain',
        height: 48,
        width: 120,
    },
    crewTimelineContainer: {
        flex: 18,
        flexGrow: 5,
        flexBasis: 1,
        backgroundColor: Colors.theme.cream,
    },
    footer: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.small,
    },
    devOnlyButtons: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        height: Spacing.medium,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

class HomeActive extends React.Component {
    constructor(props) {
        super(props);

        this.shuttingDown = false;
        this.setSyncTiming();
        Navigation.events().bindComponent(this);
        this.appStatusSync = null;

        this.eventTimelineRefreshTimer = null;
        if (props.hasActiveFlare) {
            this.eventTimelineRefreshTimer = setInterval(
                () => this.refreshTimeline(),
                FLARE_TIMELINE_REFRESH_INTERVAL
            );
        }
        this.state = {
            showSideMenu: false,
        };
    }

    componentDidMount() {
        // We will boot into this screen if the user closed the app with an active flare.
        // It's possible for users to cancel their flares using other devices. If we
        // show up on this screen and the user no longer has an active flare, go back to
        // inactive home screen.
        const {
            hasActiveFlare,
            permissions,
            hardware,
            dispatch,
            enabled911Feature,
            crewEnabled,
        } = this.props;
        if (!hasActiveFlare) {
            dispatch(changeAppRoot('secure'));
        }

        if (!permissions.location) {
            dispatch(getPermission(PERMISSIONS.IOS.LOCATION_ALWAYS));
        }

        if (!hardware || !hardware.bleListening) {
            dispatch(startBleListening());
        }

        if (!crewEnabled && !enabled911Feature) {
            Alert.alert(
                'Flare could not send out a message because your setup is incomplete. Please turn on the Enable 911 Services and/or the Enable Crew toggle in Settings. Also please add friends to your Crew if you haven’t already.'
            );
        }

        // Periodically fetch account status to ensure auth and to observe account changes from other devices.
        if (this.eventTimelineRefreshTimer) {
            clearInterval(this.eventTimelineRefreshTimer);
            this.eventTimelineRefreshTimer = null;
        }

        BackgroundTimer.clearInterval(this.appStatusSync);
        this.appStatusSync = BackgroundTimer.setInterval(
            this.syncAccount,
            this.accountSyncTimeInMs
        );

        // If the current user has an active flare, fetch the crew timeline
        // and show it
        this.startTimelineRefreshInterval();
    }

    componentDidUpdate({ hasActiveFlare: prevHasActiveFlare }) {
        const { hasActiveFlare, dispatch } = this.props;
        /**
         * Handle transitions from active to inactive flare
         */
        if (prevHasActiveFlare && !hasActiveFlare) {
            BackgroundTimer.clearInterval(this.appStatusSync);
            dispatch(changeAppRoot('secure'));
        }
    }

    componentWillUnmount() {
        this.shuttingDown = true;
        BackgroundTimer.clearInterval(this.appStatusSync);
        clearInterval(this.eventTimelineRefreshTimer);
        this.eventTimelineRefreshTimer = null;
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
        } else if (CONFIG_DEV) {
            this.accountSyncTimeInMs = ACCOUNT_SYNC_INTERVAL_DEV;
        } else {
            this.accountSyncTimeInMs = ACCOUNT_SYNC_INTERVAL;
        }
    }

    cancelFlare = () => {
        const { dispatch, authToken } = this.props;
        dispatch(cancelActiveFlare(authToken));
    };

    goToPushedView = () => {
        const { componentId } = this.props;
        Navigation.push(componentId, {
            component: {
                name: 'com.flarejewelry.app.HomeActive',
            },
        });
    };

    /**
     * Submit user location and fetch any account updates.
     */
    syncAccount = () => {
        const {
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
        if (this.shuttingDown) {
            return;
        }

        // Transmit the current state and retrieve any updates from the server.
        getCurrentPosition({
            enableHighAccuracy: true,
            timeout: this.accountSyncTimeInMs,
        })
            .then(position => {
                const appStatus = {
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
                };

                dispatch(syncAccountDetails(appStatus));
            })
            .catch(locationError => {
                Alert.alert(locationError);
            });

        // Process any beacon events that we tried (and failed) to submit earlier.
        if (problemBeacons && problemBeacons.length > 0) {
            dispatch(
                processQueuedBeacons(handleBeacon, authToken, problemBeacons)
            );
        }
    };

    refreshTimeline = () => {
        const { dispatch, authToken } = this.props;
        dispatch(getEventTimeline(authToken));
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

    toggleSideMenu() {
        const { showSideMenu } = this.state;
        const { componentId } = this.props;
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
    }

    startTimelineRefreshInterval() {
        if (this.eventTimelineRefreshTimer !== null) {
            console.log(
                'Already started timeline refresh; not starting it again.'
            );
            return;
        }
        this.refreshTimeline();
        this.eventTimelineRefreshTimer = setInterval(
            () => this.refreshTimeline(),
            FLARE_TIMELINE_REFRESH_INTERVAL
        );
    }

    render() {
        const { eventTimeline, enabled911Feature, crewEnabled } = this.props;
        let headerText;
        let cancelFlareTitle = Strings.home.cancelActiveFlare2;
        let eventTimelineSetting;
        if (crewEnabled && enabled911Feature) {
            headerText = Strings.eventTimeline.title.crewAndEms;
            eventTimelineSetting = EVENT_TIMLINE_SETTING_CREW_EMS;
            cancelFlareTitle = Strings.home.cancelActiveFlare;
        } else if (enabled911Feature) {
            headerText = Strings.eventTimeline.title.ems;
            eventTimelineSetting = EVENT_TIMLINE_SETTING_EMS;
            cancelFlareTitle = Strings.home.cancelActiveFlare2;
        } else if (crewEnabled) {
            headerText = Strings.eventTimeline.title.crew;
            eventTimelineSetting = EVENT_TIMLINE_SETTING_CREW;
            cancelFlareTitle = Strings.home.cancelActiveFlare;
        }

        return (
            <SafeAreaView style={styles.container}>
                <Aura source="aura-5" />
                <View style={styles.header}>
                    <Image source={{ uri: 'logo-aura' }} style={styles.logo} />
                    <Text style={styles.headerText}>{headerText}</Text>
                </View>
                <EventTimeline
                    timeline={eventTimeline}
                    settingStatus={eventTimelineSetting}
                    onRefresh={this.refreshTimeline}
                    containerStyle={styles.crewTimelineContainer}
                />
                <View style={styles.footer}>
                    <Button
                        dark
                        primary
                        onPress={this.cancelFlare}
                        title={cancelFlareTitle}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    return {
        activatingFlareState: state.user.activatingFlareState,
        claimingDevice: state.user.claimingDevice,
        claimingDeviceFailure: state.user.claimingDeviceFailure,
        crewEventNotificationMessage: state.user.settings.promptMessage,
        crewEvents: state.user.crewEvents,
        eventTimeline: state.user.eventTimeline,
        eventTimelineState: state.user.eventTimelineState,
        crews: state.user.crews,
        devices: state.user.devices,
        hardware: state.hardware,
        hasActiveFlare: state.user.hasActiveFlare,
        latestBeacon: state.beacons.latest,
        permissions: state.user.permissions,
        problemBeacons: state.beacons.problems,
        analyticsToken: state.user.analyticsToken,
        authToken: state.user.authToken,
        radioToken: state.user.radioToken,
        enabled911Feature: state.user.settings.enabled911Feature,
        crewEnabled: state.user.settings.crewEnabled,
    };
}

export default connect(mapStateToProps)(HomeActive);
