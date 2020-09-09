import * as React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import Colors from '../../bits/Colors';
import WhiteBar from '../Onboarding/WhiteBar';
import Headline from '../Onboarding/Headline';
import RoundedButton from '../../bits/RoundedButton';

import CrewWillKnowPng from '../../assets/crew-will-know.png';

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
    button: {
        position: 'absolute',
        bottom: (SPACE_HEIGHT * 64) / 480,
        height: (SPACE_HEIGHT * 48) / 480,
    },
    mapboxImg: {
        width: 310,
        maxHeight: (SPACE_HEIGHT * 460) / 480,
        resizeMode: 'contain',
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
            <Image
                source={CrewWillKnowPng}
                style={styles.mapboxImg}
                accessible
                accessibilityLabel="Crew Will Know Messaging"
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

export default CrewWillKnow;
