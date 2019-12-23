import * as React from 'react';
import { Image, Text, View } from 'react-native';
import { Navigation } from 'react-native-navigation';

import styles from './styles';
import Headline from '../Onboarding/Headline';
import RoundedButton from '../../bits/RoundedButton';

import successfulHands from '../../assets/successful-hands.png';

const Success = ({ style, componentId }) => {
    const finish = React.useCallback(() => {
        Navigation.push(componentId, {
            component: {
                name: 'com.flarejewelry.scenarios',
                options: { topBar: { visible: false } },
            },
        });
    }, [componentId]);

    return (
        <View style={[styles.centerContainer, ...style]}>
            <View style={styles.spacer} />
            <Headline style={styles.headline}>Success!</Headline>
            <View style={styles.spacer} />
            <View style={[styles.line, styles.marginLine]} />
            <Text style={[styles.subhead, { textAlign: 'center' }]}>
                Welcome to to the movement. We’ve got your back.
            </Text>
            <View style={styles.spacer} />
            <Image
                source={successfulHands}
                style={{ width: 128, height: 249 }}
            />
            <View style={styles.spacer} />
            <RoundedButton
                text="Get started with Flare"
                onPress={finish}
                useGradient={false}
                width={240}
                height={48}
                fontSize={14}
            />
            <View style={styles.spacer} />
        </View>
    );
};

export default Success;
