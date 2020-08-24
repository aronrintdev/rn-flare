import * as React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import Colors from '../../bits/Colors';
import CloseButton from '../CloseButton';
import Headline from '../Onboarding/Headline';

import TwoHandsImg from '../../assets/two-hands.svg';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.theme.cream,
        alignItems: 'center',
    },
    headline: {
        alignSelf: 'center',
        textAlign: 'center',
        color: Colors.black,
        marginBottom: 0,
        marginTop: 160,
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
    twoHandImg: {
        height: 135,
        width: 182,
        marginVertical: 40,
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
        backgroundColor: '#000000',
    },
    enableBtnContainer: {
        position: 'absolute',
        bottom: 110,
    },
    closeBtnStyle: {
        alignSelf: 'flex-end',
        width: 84,
        height: 52,
    },
});

const Success = ({ componentId }) => {
    const close = React.useCallback(() => {
        Navigation.dismissModal(componentId);
    }, [componentId]);

    const cancelTry = React.useCallback(() => {
        Navigation.dismissModal(componentId);
    }, [componentId]);

    const onTry = () => {
        // Give it a Try
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <CloseButton black onPress={close} style={styles.closeBtnStyle} />
            <Headline style={styles.headline}>Success</Headline>
            <TwoHandsImg style={styles.twoHandImg} />
            <Text style={styles.subhead}>
                We encourage you to test the 911 feature! Since we go through a
                third party, there is no need to worry about taking up emergency
                service resources.
            </Text>
            <TouchableOpacity
                onPress={onTry}
                style={[styles.enableBtnView, styles.enableBtnContainer]}
            >
                <Text style={styles.enableBtnText}>GIVE IT A TRY</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notNowButton} onPress={cancelTry}>
                <Text style={styles.notNowButtonText}>NOT NOW</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Success;
