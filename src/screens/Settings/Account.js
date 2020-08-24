import * as React from 'react';
import {
    Image,
    Linking,
    SafeAreaView,
    StatusBar,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import VersionNumber from 'react-native-version-number';

import { navOptions, styles } from './styles';
import * as actions from '../../actions';
import Colors from '../../bits/Colors';
import contactSupport from '../../bits/contactSupport';
import { useSlideMenu } from '../../bits/useNavigationCallback';

import chevron from '../../assets/chevron.png';
import shareIcon from '../../assets/menu-item-share.png';
import contactIcon from '../../assets/menu-item-contact.png';
import { showShareDialog } from '../ShareDialog';

const Account = ({
    componentId,
    authToken,
    analyticsEnabled,
    devices,
    setPrivacyConfig,
    signOut,
}) => {
    useSlideMenu(componentId);

    const editJewelry = React.useCallback(() => {
        Navigation.push(componentId, {
            component: { name: 'com.flarejewelry.app.Jewelry' },
        });
    }, [componentId]);

    const setPrivacy = React.useCallback(
        value => {
            setPrivacyConfig(authToken, { analytics: value });
        },
        [authToken, setPrivacyConfig]
    );

    const support = React.useCallback(() => {
        contactSupport(devices);
    }, [devices]);
    const openTerms = React.useCallback(() => {
        Linking.openURL('https://getflare.com/pages/terms-of-service');
    }, []);
    const openPrivacy = React.useCallback(() => {
        Linking.openURL('https://getflare.com/pages/privacy-policy');
    }, []);
    const share = React.useCallback(() => {
        showShareDialog();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.subhead}>Account</Text>
            <View style={[styles.itemContainer, styles.firstItemContainer]}>
                <TouchableOpacity style={styles.item} onPress={editJewelry}>
                    <Text style={styles.text}>Add/Edit Jewelry</Text>
                    <Image
                        resizeMode="center"
                        source={chevron}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
            <View style={[styles.itemContainer, styles.lastItemContainer]}>
                <View style={[styles.item, styles.lastItem]}>
                    <Text style={styles.text}>
                        Send Data Analytics to Flare
                    </Text>
                    <Switch
                        trackColor={{ true: Colors.theme.purple }}
                        value={analyticsEnabled}
                        onValueChange={setPrivacy}
                    />
                </View>
            </View>
            <Text style={styles.explain}>
                Flare respects your privacy. We only use analytics to make
                better safety products for all of us and never share your data.
            </Text>
            <View
                style={[
                    styles.itemContainer,
                    styles.firstItemContainer,
                    { marginTop: 'auto' },
                ]}
            >
                <TouchableOpacity style={[styles.item]} onPress={share}>
                    <Text style={styles.text}>Share Flare</Text>
                    <Image
                        source={shareIcon}
                        style={styles.icon}
                        resizeMode="center"
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.itemContainer}>
                <TouchableOpacity style={styles.item} onPress={support}>
                    <Text style={styles.text}>Support Center</Text>
                    <Image
                        source={contactIcon}
                        style={styles.icon}
                        resizeMode="center"
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.itemContainer}>
                <TouchableOpacity style={styles.item} onPress={openTerms}>
                    <Text style={styles.text}>Terms and Conditions</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.itemContainer, styles.lastItemContainer]}>
                <TouchableOpacity
                    style={[styles.item, styles.lastItem]}
                    onPress={openPrivacy}
                >
                    <Text style={styles.text}>Privacy Policy</Text>
                </TouchableOpacity>
            </View>
            <View
                style={[
                    styles.itemContainer,
                    styles.firstItemContainer,
                    styles.lastItemContainer,
                    { marginTop: 'auto' },
                ]}
            >
                <TouchableOpacity
                    style={[styles.item, styles.lastItem]}
                    onPress={signOut}
                >
                    <Text style={styles.text}>Log Out</Text>
                </TouchableOpacity>
            </View>
            <Text style={[styles.explain, { marginBottom: 16 }]}>
                {`Get Flare version ${VersionNumber.appVersion} (build ${VersionNumber.buildVersion})`}
            </Text>
        </SafeAreaView>
    );
};

Account.options = () => navOptions('Account', false);

const mapStateToProps = ({
    user: {
        authToken,
        settings: { analyticsEnabled },
        devices,
    },
}) => ({ authToken, analyticsEnabled, devices });

const mapDispatchToProps = {
    signOut: actions.signOut,
    setPrivacyConfig: actions.setPrivacyConfig,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Account);
