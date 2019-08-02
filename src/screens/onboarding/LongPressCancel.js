import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

import { LONG_PRESS_CANCEL_PIN_LENGTH } from '../../constants';
import Button from '../../bits/Button';
import Colors from '../../bits/Colors';
import CommonBottom from './CommonBottom';
import CommonTop from './CommonTop';
import CommonMiddle from './CommonMiddle';
import Spacing from '../../bits/Spacing';
import Strings from '../../locales/en';
import FlareTextInput from '../../bits/FlareTextInput';
import Type from '../../bits/Type';

const styles = StyleSheet.create({
    subtitleArea: {
        paddingHorizontal: Spacing.medium,
    },
    titleContainer: {
        width: '100%',
    },
    subtitleText: {
        marginBottom: Spacing.medium,
        color: Colors.white,
        fontSize: Type.size.medium,
    },
    pinInputArea: {
        margin: Spacing.medium,
    },
});

export default function getLongPressCancelPage(props) {
    let title = null;
    let subtitle = null;
    const image = null;

    if (props.hasSetPin) {
        ({ title, subtitle } = Strings.onboarding.longPressCancel.hasSetPin);
    } else {
        ({ title } = Strings.onboarding.longPressCancel.initial);
        subtitle = (
            <View>
                <View style={styles.subtitleArea}>
                    <Text style={styles.subtitleText}>{Strings.onboarding.longPressCancel.initial.subtitle}</Text>
                </View>
                <View style={styles.pinInputArea}>
                    <FlareTextInput
                        autoCapitalize="characters"
                        placeholder={Strings.onboarding.longPressCancel.pinPlaceholder}
                        onChangeText={v => props.changeCancelPIN(v)}
                        maxLength={LONG_PRESS_CANCEL_PIN_LENGTH}
                        value={props.pin}
                        secureTextEntry
                    />
                    <FlareTextInput
                        autoCapitalize="characters"
                        placeholder={Strings.onboarding.longPressCancel.pinConfirmPlaceholder}
                        onChangeText={v => props.changeConfirmCancelPIN(v)}
                        maxLength={LONG_PRESS_CANCEL_PIN_LENGTH}
                        value={props.confirmPin}
                        secureTextEntry
                    />
                    <Button
                        title={Strings.onboarding.longPressCancel.initial.buttonLabel}
                        onPress={() => props.setCancelPIN()}
                        disabled={props.pin.length < LONG_PRESS_CANCEL_PIN_LENGTH && props.pin !== props.pinConfirm}
                        primary
                    />
                </View>
            </View>
        );
    }

    return {
        backgroundColor: Colors.theme.peach,
        image: (
            <View>
                <CommonTop />
            </View>
        ),
        title: (
            <View>
                {props.hasSetPin && (
                    <View style={styles.titleContainer}>
                        <CommonMiddle center title={title} imageSource={{ uri: 'onboarding-cancelflare' }} />
                    </View>
                )}
                {!props.hasSetPin && <CommonMiddle center form={subtitle} />}
            </View>
        ),
        subtitle: (
            <View>
                {props.hasSetPin && (
                    <View>
                        <CommonBottom center bodyText={subtitle} />
                    </View>
                )}
            </View>
        ),
    };
}
