import * as React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Dimensions,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import Colors from '../../bits/Colors';
import WhiteBar from '../Onboarding/WhiteBar';
import Headline from '../Onboarding/Headline';
import RoundedButton from '../../bits/RoundedButton';
import BlueMsgBox from '../../bits/BlueMsgBox';
import Strings from '../../locales/en';

import EmojisSvg from '../../assets/emojis.svg';

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
        marginBottom: (SPACE_HEIGHT * 60) / 480,
    },
    button: {
        position: 'absolute',
        bottom: (SPACE_HEIGHT * 64) / 480,
        height: (SPACE_HEIGHT * 48) / 480,
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
                {Strings.feature911.talkToDispatchers.title}
            </Headline>
            <View style={styles.shrink} />
            <View style={styles.line} />
            <Text style={styles.subhead}>
                {Strings.feature911.talkToDispatchers.subtext}
            </Text>
            <View style={styles.content}>
                <BlueMsgBox containerStyles={styles.blueMsgBox1}>
                    {Strings.feature911.talkToDispatchers.message1}
                </BlueMsgBox>
                <View style={styles.rightAligned}>
                    <BlueMsgBox
                        rightAligned
                        containerStyles={styles.blueMsgBox2}
                    >
                        {Strings.feature911.talkToDispatchers.message2}
                    </BlueMsgBox>
                    <View style={styles.emojis}>
                        <EmojisSvg width={60} height={20} />
                    </View>
                </View>
                <BlueMsgBox containerStyles={styles.blueMsgBox1}>
                    {Strings.feature911.talkToDispatchers.message3}
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
