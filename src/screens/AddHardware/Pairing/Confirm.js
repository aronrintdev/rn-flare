import * as React from 'react';
import { Text, KeyboardAvoidingView } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

import styles from '../styles';
import Headline from '../../Onboarding/Headline';
import CuffPreview from './CuffPreview';
import FlareDeviceID from '../../../bits/FlareDeviceID';
import RoundedButton from '../../../bits/RoundedButton';

const Confirm = ({ device, submit, busy, reset, error, squashed }) => {
    const [secondFactor, setSecondFactor] = React.useState('');
    const onPress = React.useCallback(() => {
        submit({ deviceId: device, secondFactor });
    }, [submit, device, secondFactor]);
    const onChangeText = React.useCallback(
        text => {
            setSecondFactor(text);
            reset();
        },
        [reset]
    );
    const insets = useSafeArea();
    const keyboardVerticalOffset = (squashed ? 84 : 96) + insets.bottom;
    const deviceLabel = FlareDeviceID.getJewelryLabelFromDeviceID(device);

    return (
        <KeyboardAvoidingView
            style={[styles.scrollContainer, { paddingTop: 0 }]}
            keyboardVerticalOffset={keyboardVerticalOffset}
            behavior="padding"
        >
            <Headline
                squashed={squashed}
                style={{ marginBottom: squashed ? 0 : 8 }}
            >
                Confirm your Flare
            </Headline>
            <Text
                style={[
                    styles.helpText,
                    styles.whiteText,
                    { marginBottom: 0, letterSpacing: -0.1 },
                ]}
            >
                Enter the last 3 digits of your serial number
            </Text>
            <CuffPreview
                style={{ alignSelf: 'center', marginTop: squashed ? 8 : 32 }}
                text={deviceLabel}
                onChangeText={onChangeText}
                onSubmitEditing={onPress}
                error={
                    error
                        ? 'Please recheck and reenter the last three digits of your serial number'
                        : undefined
                }
            />
            <RoundedButton
                wrapperStyle={{
                    alignSelf: 'center',
                    marginTop: 'auto',
                    marginBottom: squashed ? 8 : 16,
                }}
                text="Continue"
                busy={busy}
                onPress={onPress}
                disabled={secondFactor.length < 3}
            />
        </KeyboardAvoidingView>
    );
};

export default Confirm;
