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

import TextAndCallSvg from '../../assets/text-and-call-bg.svg';

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
        marginBottom: (SPACE_HEIGHT * 40) / 480,
    },
    button: {
        position: 'absolute',
        height: (SPACE_HEIGHT * 48) / 480,
        bottom: (SPACE_HEIGHT * 64) / 480,
    },
    blueMsgBox2: {
        marginTop: -25,
        marginLeft: 25,
    },
    noonlightCallingBox: {
        width: 318,
        height: (SPACE_HEIGHT * 320) / 480,
    },
    content: {
        width: 307,
        position: 'relative',
    },
});

const TextAndCall = ({ componentId }) => {
    const close = React.useCallback(() => {
        Navigation.pop(componentId);
    }, [componentId]);

    const moveNext = React.useCallback(() => {
        Navigation.push(componentId, {
            component: {
                name: 'com.flarejewelry.how911works.talktodispatchers',
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
                {`A Text, And\n A Call`}
            </Headline>
            <View style={styles.shrink} />
            <View style={styles.line} />
            <Text style={styles.subhead}>
                The dispatcher will text and call you within 60 seconds to
                confirm your safety. If you are able to text or talk, you can
                communicate directly with the dispatcher—and your Crew—until
                help arrives.
            </Text>
            <TextAndCallSvg
                style={styles.noonlightCallingBox}
                accessible
                accessibilityLabel="Text and Call Messaging"
            />
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

export default TextAndCall;
