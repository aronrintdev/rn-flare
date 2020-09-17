import * as React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import Colors from '../../bits/Colors';
import CloseButton from '../CloseButton';
import Headline from '../Onboarding/Headline';
import Strings from '../../locales/en';

import TwoHandsImg from '../../assets/two-hands.svg';

const SPACE_HEIGHT = Dimensions.get('window').height - 322;

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
        marginTop: (SPACE_HEIGHT * 140) / 480,
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
    twoHandImg: {
        height: 135,
        width: 182,
        marginVertical: (SPACE_HEIGHT * 40) / 480,
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
        bottom: (SPACE_HEIGHT * 90) / 480,
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
        Navigation.showModal({
            component: {
                name: 'com.flarejewelry.how911works.readytotestit',
            },
        });
        Navigation.dismissModal(componentId);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <CloseButton black onPress={close} style={styles.closeBtnStyle} />
            <Headline style={styles.headline}>
                {Strings.feature911.success.title}
            </Headline>
            <TwoHandsImg style={styles.twoHandImg} />
            <Text style={styles.subhead}>
                {Strings.feature911.success.subtext}
            </Text>
            <TouchableOpacity
                onPress={onTry}
                style={[styles.enableBtnView, styles.enableBtnContainer]}
            >
                <Text style={styles.enableBtnText}>
                    {Strings.feature911.success.tryBtnText}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notNowButton} onPress={cancelTry}>
                <Text style={styles.notNowButtonText}>
                    {Strings.feature911.success.notNowBtnText}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Success;
