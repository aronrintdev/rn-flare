import * as React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import Colors from '../../bits/Colors';
import Aura from '../../bits/Aura';
import CloseButton from '../CloseButton';
import Headline from '../Onboarding/Headline';
import Strings from '../../locales/en';

import AuraBg from '../../assets/aura-1519.jpg';
import WatchPng from '../../assets/watch.png';

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
        color: Colors.whiteBorder,
        textTransform: 'capitalize',
        marginBottom: 0,
        width: 310,
        marginTop: (SPACE_HEIGHT * 20) / 480,
    },
    shrink: {
        height: 5,
        flexShrink: 1,
    },
    line: {
        height: 1,
        width: 33,
        marginVertical: 12,
        backgroundColor: Colors.whiteBorder,
    },
    subhead: {
        width: 310,
        color: Colors.whiteBorder,
        fontSize: 20,
        lineHeight: 28,
        fontFamily: 'Nocturno Display Std',
        textAlign: 'center',
        marginBottom: (SPACE_HEIGHT * 20) / 480,
    },
    closeBtnStyle: {
        alignSelf: 'flex-end',
        width: 84,
        height: 52,
    },
    watchImg: {
        marginTop: (SPACE_HEIGHT * 30) / 480,
        width: 240,
        height: 210,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
});

const ReadyToTestIt = ({ componentId }) => {
    const close = React.useCallback(() => {
        Navigation.dismissModal(componentId);
    }, [componentId]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Aura source={AuraBg} />
            <CloseButton white onPress={close} style={styles.closeBtnStyle} />
            <Headline style={styles.headline}>
                {Strings.feature911.readyToTest.title}
            </Headline>
            <View style={styles.shrink} />
            <View style={styles.line} />
            <Text style={styles.subhead}>
                {Strings.feature911.readyToTest.subtext}
            </Text>
            <Image
                source={WatchPng}
                style={styles.watchImg}
                accessible
                accessibilityLabel="Watch Image"
            />
        </SafeAreaView>
    );
};

export default ReadyToTestIt;
