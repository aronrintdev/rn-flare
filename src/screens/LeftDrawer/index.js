import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaProvider, useSafeArea } from 'react-native-safe-area-context';

import * as actions from '../../actions';
import Strings from '../../locales/en';
import contactSupport from '../../bits/contactSupport';
import Aura from '../../bits/Aura';
import HeaderImage from './HeaderImage';
import styles from './styles';

import aura3 from '../../assets/aura-3.jpg';
import iconCrew from '../../assets/menu-item-crew.png';
import iconHome from '../../assets/menu-item-home.png';
import iconProfile from '../../assets/menu-item-profile.png';
import iconSettings from '../../assets/menu-item-settings.png';
import iconContact from '../../assets/menu-item-contact.png';
import iconInfo from '../../assets/menu-item-info.png';
import iconShare from '../../assets/menu-item-share.png';
import { showShareDialog } from '../ShareDialog';

const MenuItem = ({ onPress, label, icon, style }) => (
    <TouchableOpacity style={[styles.menuItem, style]} onPress={onPress}>
        <Image source={icon} style={styles.menuItemIcon} />
        <Text style={styles.menuItemText}>{label}</Text>
    </TouchableOpacity>
);

const LeftDrawer = ({ changeAppRoot, devices }) => {
    const insets = useSafeArea();

    const handleHome = React.useCallback(() => {
        changeAppRoot('secure');
    }, [changeAppRoot]);

    const handleCrew = React.useCallback(() => {
        changeAppRoot('secure-crew');
    }, [changeAppRoot]);

    const handleSettings = React.useCallback(() => {
        changeAppRoot('secure-settings');
    }, [changeAppRoot]);

    const handleAccount = React.useCallback(() => {
        changeAppRoot('secure-account');
    }, [changeAppRoot]);

    const handleShare = React.useCallback(() => {
        showShareDialog();
    }, []);

    const handleSupport = React.useCallback(() => {
        contactSupport(devices);
    }, [devices]);

    const howFlareWorks = React.useCallback(() => {
        changeAppRoot('secure-howitworks');
    }, [changeAppRoot]);

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: insets.top + 32,
                    paddingBottom: insets.bottom + 32,
                },
            ]}
        >
            <Aura source={aura3} />
            <HeaderImage />
            <MenuItem
                onPress={handleHome}
                label={Strings.leftDrawer.home}
                icon={iconHome}
            />
            <MenuItem onPress={handleCrew} label="My Crew" icon={iconCrew} />
            <MenuItem
                onPress={handleSettings}
                label={Strings.leftDrawer.settings}
                icon={iconSettings}
            />
            <MenuItem
                onPress={handleAccount}
                label="My Account"
                icon={iconProfile}
            />
            <MenuItem
                onPress={handleShare}
                label="Share Flare"
                icon={iconShare}
            />
            <MenuItem
                style={styles.padded}
                onPress={howFlareWorks}
                label="How Flare Works"
                icon={iconInfo}
            />
            <MenuItem
                onPress={handleSupport}
                label="Contact Support"
                icon={iconContact}
            />
        </View>
    );
};

const mapStateToProps = ({ user: { devices } }) => ({
    devices,
});

const mapDispatchToProps = {
    changeAppRoot: actions.changeAppRoot,
};

const ConnectedLeftDrawer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LeftDrawer);

const WrappedDrawer = ({ ...props }) => (
    <SafeAreaProvider>
        <ConnectedLeftDrawer {...props} />
    </SafeAreaProvider>
);

export default WrappedDrawer;
