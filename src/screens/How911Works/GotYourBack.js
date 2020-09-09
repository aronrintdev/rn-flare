import React, { useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import LinearGradient from 'react-native-linear-gradient';

import Colors from '../../bits/Colors';
import WhiteBar from '../Onboarding/WhiteBar';
import Headline from '../Onboarding/Headline';
import BlueRoundedBox from '../../bits/BlueRoundedBox';
import * as userActions from '../../actions/userActions';

import MapSvg from '../../assets/map.svg';
import StarMarkImg from '../../assets/star-mark.svg';

const SPACE_HEIGHT = Dimensions.get('window').height - 322;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.theme.cream,
        alignItems: 'center',
    },
    shrink: {
        height: 5,
        flexShrink: 1,
    },
    headline: {
        alignSelf: 'center',
        textAlign: 'center',
        color: Colors.black,
        marginBottom: 0,
    },
    line: {
        height: 1,
        width: 33,
        marginVertical: 12,
        backgroundColor: Colors.black,
    },
    subhead: {
        width: 307,
        color: Colors.black,
        fontSize: 18,
        lineHeight: 24,
        fontFamily: 'Nocturno Display Std',
        textAlign: 'center',
        marginBottom: (SPACE_HEIGHT * 20) / 480,
    },
    blueMsgBox1: {
        marginVertical: 7,
        backgroundColor: 'rgba(105,120,246, 0.75)',
    },
    content: {
        width: 300,
        position: 'relative',
        justifyContent: 'center',
    },
    messengerName: {
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 16,
        marginTop: 5,
    },
    starMarkImg: {
        marginTop: -30,
        height: (SPACE_HEIGHT * 213) / 480,
        width: (SPACE_HEIGHT * 200) / 480,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    notNowButton: {
        position: 'absolute',
        bottom: (SPACE_HEIGHT * 44) / 480,
    },
    notNowButtonText: {
        fontSize: 12,
        lineHeight: 15,
        fontWeight: '700',
    },
    enableBtnText: {
        color: '#F5F2ED',
        fontSize: 14,
        lineHeight: 15,
        fontWeight: '700',
        alignSelf: 'center',
    },
    enableBtnView: {
        borderRadius: 33,
        width: 240,
        justifyContent: 'center',
        height: 48,
    },
    enableBtnContainer: {
        position: 'absolute',
        bottom: (SPACE_HEIGHT * 90) / 480,
    },
});

const GotYourBack = ({
    componentId,
    enabled911Feature,
    profile,
    authToken,
    set911Features,
    show911FeatureError,
    hide911FeaturesErrorAlert,
}) => {
    const close = React.useCallback(() => {
        Navigation.pop(componentId);
    }, [componentId]);

    const cancel911 = React.useCallback(() => {
        Navigation.popToRoot(componentId);
    }, [componentId]);

    const enable911 = () => {
        setTimeout(() => set911Features(authToken, profile.id), 1000);
    };

    useEffect(() => {
        if (enabled911Feature) {
            Navigation.showModal({
                component: {
                    name: 'com.flarejewelry.how911works.success',
                },
            });
            Navigation.popToRoot(componentId);
        }
        if (show911FeatureError) {
            Alert.alert(
                `Sorry, we are unable to connect to Flare to toggle your settings. Please try again later, or contact us at help@getflare.com if this issue persists.`
            );
            hide911FeaturesErrorAlert();
        }
    }, [
        enabled911Feature,
        show911FeatureError,
        componentId,
        hide911FeaturesErrorAlert,
        profile,
    ]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <WhiteBar showBack showLogo={false} black goBack={close} />
            <Headline style={styles.headline}>
                {`We’ve Got Your\n Back.`}
            </Headline>
            <View style={styles.shrink} />
            <View style={styles.line} />
            <Text style={styles.subhead}>
                If you are not able to respond, the dispatcher will send
                emergency first responders to your location.
            </Text>
            <View style={styles.content}>
                <BlueRoundedBox>
                    <MapSvg
                        height={100}
                        accessible
                        accessibilityLabel="Map View"
                    />
                </BlueRoundedBox>
                <StarMarkImg
                    style={styles.starMarkImg}
                    accessible
                    accessibilityLabel="Star Mark"
                />
            </View>
            <TouchableOpacity
                onPress={enable911}
                style={[styles.enableBtnView, styles.enableBtnContainer]}
            >
                <LinearGradient
                    style={styles.enableBtnView}
                    start={{ x: 0.144, y: 1.669 }}
                    end={{ x: 0.424, y: 0 }}
                    locations={[0, 1]}
                    colors={['#F9885E', '#B9475F']}
                >
                    <Text style={styles.enableBtnText}>ENABLE 911</Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notNowButton} onPress={cancel911}>
                <Text style={styles.notNowButtonText}>NOT NOW</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const mapStateToProps = state => ({
    enabled911Feature: state.user.settings.enabled911Feature,
    profile: state.user.profile,
    authToken: state.user.authToken,
    show911FeatureError: state.user.show911FeatureError,
});

const mapDispatchToProps = {
    set911Features: userActions.set911Features,
    hide911FeaturesErrorAlert: userActions.hide911FeaturesErrorAlert,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GotYourBack);
