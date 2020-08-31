import * as React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import LinearGradient from 'react-native-linear-gradient';

import Colors from '../../bits/Colors';
import WhiteBar from '../Onboarding/WhiteBar';
import Headline from '../Onboarding/Headline';
import BlueRoundedBox from '../../bits/BlueRoundedBox';

import MapSvg from '../../assets/map.svg';
import StarMarkImg from '../../assets/star-mark.svg';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.theme.cream,
        alignItems: 'center',
    },
    shrink: {
        height: 10,
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
        marginBottom: 20,
    },
    blueMsgBox1: {
        marginVertical: 7,
        backgroundColor: 'rgba(105,120,246, 0.75)',
    },
    content: {
        width: 325,
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
        height: 195,
        width: 178,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    notNowButton: {
        position: 'absolute',
        bottom: 64,
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
        padding: 16,
        alignSelf: 'center',
    },
    enableBtnView: {
        borderRadius: 33,
        width: 240,
        height: 48,
    },
    enableBtnContainer: {
        position: 'absolute',
        bottom: 110,
    },
});

const GotYourBack = ({ componentId }) => {
    const close = React.useCallback(() => {
        Navigation.pop(componentId);
    }, [componentId]);

    const cancel911 = React.useCallback(() => {
        Navigation.popToRoot(componentId);
    }, [componentId]);

    const enable911 = () => {
        Navigation.showModal({
            component: {
                name: 'com.flarejewelry.how911works.success',
            },
        });
    };

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
                    <MapSvg height={110} />
                </BlueRoundedBox>
                <StarMarkImg style={styles.starMarkImg} />
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

export default GotYourBack;
