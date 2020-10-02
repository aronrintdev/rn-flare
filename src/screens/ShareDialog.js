import * as React from 'react';
import {
    Clipboard,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import { shareFlare } from '../actions';
import Colors from '../bits/Colors';
import CloseButton from './CloseButton';
import Headline from './Onboarding/Headline';
import RoundedButton from '../bits/RoundedButton';
import cardCrew from '../assets/card-crew.png';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.theme.cream,
        flexDirection: 'column',
        alignItems: 'center',
    },
    headline: {
        alignSelf: 'center',
        textAlign: 'center',
        color: Colors.black,
        marginBottom: 0,
        marginTop: 32,
    },
    line: {
        height: 1,
        width: 33,
        marginVertical: 12,
        backgroundColor: Colors.black,
    },
    subhead: {
        width: 300,
        color: Colors.black,
        fontSize: 20,
        lineHeight: 22,
        fontFamily: 'Nocturno Display Std',
        textAlign: 'center',
        marginBottom: 48,
    },
    firstButton: {
        marginTop: 'auto',
        marginBottom: 16,
    },
    referralKey: {
        marginLeft: 16,
        marginRight: 'auto',
    },
    copy: {
        marginRight: 16,
    },
    secondButton: {
        marginBottom: 24,
    },
    image: {
        width: '50%',
        height: '50%',
        resizeMode: 'contain',
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
    },
});

const ShareDialog = ({ componentId }) => {
    const dispatch = useDispatch();
    const referralKey = useSelector(({ user }) => user.referralKey);

    const close = React.useCallback(() => {
        Navigation.dismissModal(componentId);
    }, [componentId]);
    const copy = React.useCallback(() => {
        Clipboard.setString(referralKey);
        Alert.alert('Referral code copied!');
    }, [referralKey]);
    const share = React.useCallback(() => {
        dispatch(shareFlare());
    }, [shareFlare]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <CloseButton black onPress={close} />
            <Headline style={styles.headline}>Share Flare!</Headline>
            <View style={styles.line} />
            <Text style={styles.subhead}>
                Invite your friends to join the movement. They can get $20 off
                with your referral code.
            </Text>
            <View style={styles.imageContainer}>
                <Image source={cardCrew} style={styles.image} />
            </View>
            <RoundedButton
                wrapperStyle={styles.firstButton}
                outline
                onPress={copy}
                width={280}
            >
                <Text style={styles.referralKey}>
                    {`Your referral code: ${referralKey}`}
                </Text>
                <Text style={styles.copy}>Copy</Text>
            </RoundedButton>
            <RoundedButton
                wrapperStyle={styles.secondButton}
                onPress={share}
                text="Send $20"
                width={280}
            />
        </SafeAreaView>
    );
};

export const showShareDialog = () => {
    Navigation.showModal({
        component: {
            name: 'com.flarejewelry.sharedialog',
        },
    });
};

export default ShareDialog;
