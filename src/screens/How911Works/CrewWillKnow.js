import * as React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Navigation } from 'react-native-navigation';

import Colors from '../../bits/Colors';
import WhiteBar from '../Onboarding/WhiteBar';
import Headline from '../Onboarding/Headline';
import RoundedButton from '../../bits/RoundedButton';
import BlueMsgBox from '../../bits/BlueMsgBox';
import BlueRoundedBox from '../../bits/BlueRoundedBox';

import MapSvg from '../../assets/map.svg';

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
        marginBottom: 20,
    },
    button: {
        marginTop: 16,
        marginBottom: 24,
        position: 'absolute',
        bottom: 34,
    },
    blueMsgBox1: {
        marginVertical: 5,
        backgroundColor: 'rgba(105,120,246, 0.75)',
    },
    content: {
        width: 310,
        position: 'relative',
    },
    messengerName: {
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 16,
        marginTop: 5,
    },
});

const CrewWillKnow = ({ componentId }) => {
    const close = React.useCallback(() => {
        Navigation.pop(componentId);
    }, [componentId]);

    const moveNext = React.useCallback(() => {
        Navigation.push(componentId, {
            component: {
                name: 'com.flarejewelry.how911works.gotyourback',
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
                {`Your Crew Will\n Know, Too`}
            </Headline>
            <View style={styles.shrink} />
            <View style={styles.line} />
            <Text style={styles.subhead}>
                If you have a Crew, they will be still notified that you are in
                a situation.
            </Text>
            <View style={styles.content}>
                <Text style={styles.messengerName}>Flare</Text>
                <BlueMsgBox containerStyles={styles.blueMsgBox1}>
                    Sara is in an iffy situation. Please check-in.
                </BlueMsgBox>
                <BlueMsgBox containerStyles={styles.blueMsgBox1}>
                    She has also reached out to 911. Flare has shared her
                    location with emergency first responders.
                </BlueMsgBox>
                <BlueRoundedBox>
                    <MapSvg height={110} />
                </BlueRoundedBox>
                <Text style={styles.messengerName}>Jamie</Text>
                <BlueMsgBox containerStyles={styles.blueMsgBox1}>
                    Are any of you with her? Calling her now.
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

export default CrewWillKnow;
