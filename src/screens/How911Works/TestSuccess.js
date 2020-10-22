import * as React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Dimensions,
    View,
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
    },
    twoHandImg: {
        height: 135,
        width: 182,
        marginVertical: (SPACE_HEIGHT * 30) / 480,
        alignSelf: 'center',
    },
    centerView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: (SPACE_HEIGHT * -30) / 480,
        flex: 1,
    },
    closeBtnStyle: {
        alignSelf: 'flex-end',
        width: 84,
        height: 52,
    },
});

const TestSuccess = ({ componentId }) => {
    const close = React.useCallback(() => {
        Navigation.dismissModal(componentId);
    }, [componentId]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <CloseButton black onPress={close} style={styles.closeBtnStyle} />
            <View style={styles.centerView}>
                <Headline style={styles.headline}>
                    {Strings.feature911.success.title}
                </Headline>
                <TwoHandsImg style={styles.twoHandImg} />
            </View>
        </SafeAreaView>
    );
};

export default TestSuccess;
