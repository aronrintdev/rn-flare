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

import { navOptions, styles } from './styles';
import * as authActions from '../../actions/authActions';
import * as navActions from '../../actions/navActions';
import * as userActions from '../../actions/userActions';
import Colors from '../../bits/Colors';
import contactSupport from '../../bits/contactSupport';
import { useSlideMenu } from '../../bits/useNavigationCallback';
import shareFlare from '../../bits/shareFlare';

import chevron from '../../assets/chevron.png';
import shareIcon from '../../assets/menu-item-share.png';
import contactIcon from '../../assets/menu-item-contact.png';

const Account = ({
    componentId,
    authToken,
    analyticsEnabled,
    setPrivacyConfig,
    signOut,
    changeAppRoot,
}) => {
    useSlideMenu(componentId);

    const editJewelry = React.useCallback(() => {
        changeAppRoot('secure-jewelry');
    }, [changeAppRoot]);

    const setPrivacy = React.useCallback(
        value => {
            setPrivacyConfig(authToken, { analytics: value });
        },
        [authToken, setPrivacyConfig]
    );

    const openTerms = React.useCallback(() => {
        Linking.openURL('https://getflare.com/pages/terms-of-service');
    }, []);
    const openPrivacy = React.useCallback(() => {
        Linking.openURL('https://getflare.com/pages/privacy-policy');
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.subhead}>Account</Text>
            <View style={styles.itemContainer}>
                <TouchableOpacity style={styles.item} onPress={editJewelry}>
                    <Text style={styles.text}>Add/Edit Jewelry</Text>
                    <Image
                        resizeMode="center"
                        source={chevron}
                        style={styles.icon}
                    />
                </TouchableOpacity>
                <View style={[styles.item, styles.itemBorder]}>
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
            <TouchableOpacity
                style={[styles.item, { marginTop: 80 }]}
                onPress={shareFlare}
            >
                <Text style={styles.text}>Share Flare</Text>
                <Image
                    source={shareIcon}
                    style={styles.icon}
                    resizeMode="center"
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={contactSupport}>
                <Text style={styles.text}>Support Center</Text>
                <Image
                    source={contactIcon}
                    style={styles.icon}
                    resizeMode="center"
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={openTerms}>
                <Text style={styles.text}>Terms and Conditions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={openPrivacy}>
                <Text style={styles.text}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.item, { marginTop: 80 }]}
                onPress={signOut}
            >
                <Text style={styles.text}>Log Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

Account.options = () => navOptions('Account', false);

const mapStateToProps = ({
    user: {
        authToken,
        settings: { analyticsEnabled },
    },
}) => ({ authToken, analyticsEnabled });

const mapDispatchToProps = {
    signOut: authActions.signOut,
    setPrivacyConfig: userActions.setPrivacyConfig,
    changeAppRoot: navActions.changeAppRoot,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Account);
