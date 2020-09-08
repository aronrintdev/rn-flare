import * as React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Navigation } from 'react-native-navigation';

import Colors from '../../bits/Colors';
import WhiteBar from '../Onboarding/WhiteBar';
import Headline from '../Onboarding/Headline';
import RoundedButton from '../../bits/RoundedButton';
import BlueMsgBox from '../../bits/BlueMsgBox';

import EmojisSvg from '../../assets/emojis.svg';

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
        marginBottom: 60,
    },
    button: {
        marginTop: 16,
        marginBottom: 24,
        position: 'absolute',
        bottom: 34,
    },
    blueMsgBox1: {
        backgroundColor: 'rgba(105,120,246, 0.75)',
    },
    rightAligned: {
        marginLeft: '10%',
    },
    blueMsgBox2: {
        marginVertical: 14,
    },
    content: {
        width: 310,
        position: 'relative',
    },
    emojis: {
        position: 'absolute',
        bottom: 10,
        right: 30,
        width: 60,
    },
});

const TalkToDispatchers = ({ componentId }) => {
    const close = React.useCallback(() => {
        Navigation.pop(componentId);
    }, [componentId]);

    const moveNext = React.useCallback(() => {
        Navigation.push(componentId, {
            component: {
                name: 'com.flarejewelry.how911works.crewwillknow',
                options: {
                    topBar: {
                        visible: false,
                        animate: false,
                    },
                },
            },
        });
    }, [componentId]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <WhiteBar showBack showLogo={false} black goBack={close} />
            <Headline style={styles.headline}>
                {`Talk Directly To\nDispatchers`}
            </Headline>
            <View style={styles.shrink} />
            <View style={styles.line} />
            <Text style={styles.subhead}>
                If it was an accidental activation of the 911 feature, you can
                easily cancel the alarm by responding to the dispatcher.
            </Text>
            <View style={styles.content}>
                <BlueMsgBox containerStyles={styles.blueMsgBox1}>
                    Hi, this is Nikki from Noonlight. We received an alarm from
                    your Flare device. What is your emergency?
                </BlueMsgBox>
                <View style={styles.rightAligned}>
                    <BlueMsgBox
                        rightAligned
                        containerStyles={styles.blueMsgBox2}
                    >
                        I’m just testing my Flare bracelet, no problem here.
                        Thanks!
                    </BlueMsgBox>
                    <View style={styles.emojis}>
                        <EmojisSvg width={60} height={20} />
                    </View>
                </View>
                <BlueMsgBox containerStyles={styles.blueMsgBox1}>
                    Great. Glad you are safe. Have a good night.
                </BlueMsgBox>
            </View>
            <RoundedButton
                onPress={moveNext}
                wrapperStyle={styles.button}
                text="NEXT"
                width={240}
                fontSize={12}
            />
        </SafeAreaView>
    );
};

export default TalkToDispatchers;
