/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect } from 'react';
import {
    Image,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    Switch,
    Alert,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';

import { useSlideMenu } from '../../bits/useNavigationCallback';
import { navOptions, styles } from './styles';
import Colors from '../../bits/Colors';
import * as userActions from '../../actions/userActions';

import chevron from '../../assets/chevron.png';

const Home = ({
    componentId,
    enableNotifications,
    notifPermission,
    enabled911Feature,
    authToken,
    profile,
    set911Features,
    setNotificationsEnabled,
    getNotificationPermission,
    show911FeatureError,
    hide911FeaturesErrorAlert,
}) => {
    useSlideMenu(componentId);

    const [crewEnabled, setCrewEnabled] = React.useState(false);
    const fullyEnabled = enableNotifications && notifPermission;

    const openCall = React.useCallback(() => {
        Navigation.push(componentId, {
            component: { name: 'com.flarejewelry.app.settings.Call' },
        });
    }, [componentId]);

    const editCrew = React.useCallback(() => {
        Navigation.push(componentId, {
            component: {
                name: 'com.flarejewelry.app.Contacts',
            },
        });
    }, [componentId]);

    const openNotifs = React.useCallback(() => {
        Navigation.push(componentId, {
            component: { name: 'com.flarejewelry.app.settings.Notifications' },
        });
    }, [componentId]);

    const setEnabled = React.useCallback(
        newValue => {
            if (newValue && !notifPermission) {
                getNotificationPermission();
            } else {
                setNotificationsEnabled(newValue);
            }
        },
        [notifPermission, getNotificationPermission, setNotificationsEnabled]
    );

    useEffect(() => {
        if (show911FeatureError) {
            Alert.alert(
                `Sorry, we are unable to connect to Flare to toggle your settings. Please try again later, or contact us at help@getflare.com if this issue persists.`
            );
            hide911FeaturesErrorAlert();
        }
    }, [show911FeatureError, hide911FeaturesErrorAlert, profile]);

    const setEnable911Feature = () => {
        set911Features(authToken, profile.id);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.subhead}>*Press* for a call</Text>
            <View
                style={[
                    styles.itemContainer,
                    styles.firstItemContainer,
                    styles.lastItemContainer,
                ]}
            >
                <TouchableOpacity
                    style={[styles.item, styles.lastItem]}
                    onPress={openCall}
                >
                    <Text style={styles.text}>Choose Your Call</Text>
                    <Image
                        resizeMode="center"
                        source={chevron}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
            <Text style={[styles.subhead, { marginTop: 48 }]}>
                *Hold* for Backup
            </Text>
            <View style={[styles.itemContainer, styles.firstItemContainer]}>
                <View style={styles.item}>
                    <Text style={styles.text}>Enable 911 Services</Text>
                    <Switch
                        trackColor={{ true: Colors.theme.purple }}
                        value={enabled911Feature}
                        onValueChange={setEnable911Feature}
                    />
                </View>
            </View>
            <View style={styles.itemContainer}>
                <View style={styles.item}>
                    <Text style={styles.text}>Enable Crew</Text>
                    <Switch
                        trackColor={{ true: Colors.theme.purple }}
                        value={crewEnabled}
                        onValueChange={setCrewEnabled}
                    />
                </View>
            </View>
            <View style={[styles.itemContainer, styles.lastItemContainer]}>
                <TouchableOpacity
                    style={[styles.item, styles.lastItem]}
                    onPress={editCrew}
                >
                    <Text style={styles.text}>Add / Edit Crew</Text>
                    <Image
                        resizeMode="center"
                        source={chevron}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.explain}>
                Choose who will be notified that you sent a flare when you
                choose to text a friend with your bracelet.
            </Text>
            <Text style={[styles.subhead, { marginTop: 48 }]}>
                Crew notification settings
            </Text>
            <View style={[styles.itemContainer, styles.firstItemContainer]}>
                <View style={styles.item}>
                    <Text style={styles.text}>Receive Notifications</Text>
                    <Switch
                        trackColor={{ true: Colors.theme.purple }}
                        value={fullyEnabled}
                        onValueChange={setEnabled}
                    />
                </View>
            </View>
            <View style={[styles.itemContainer, styles.lastItemContainer]}>
                <TouchableOpacity
                    style={[styles.item, styles.lastItem]}
                    onPress={openNotifs}
                >
                    <Text style={styles.text}>
                        Customize Your Notifications
                    </Text>
                    <Image
                        resizeMode="center"
                        source={chevron}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.explain}>
                Choose how you are notified that a flare was sent to your crew
                here.
            </Text>
        </SafeAreaView>
    );
};

Home.options = navOptions('Settings', false);

const mapStateToProps = ({
    user: {
        settings: { enableNotifications, enabled911Feature },
        permissions: { notification: notifPermission },
        authToken,
        profile,
    },
}) => ({
    enableNotifications,
    notifPermission,
    enabled911Feature,
    authToken,
    profile,
});

const mapDispatchToProps = {
    setNotificationsEnabled: userActions.setNotificationsEnabled,
    getNotificationPermission: userActions.getNotificationPermission,
    set911Features: userActions.set911Features,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
