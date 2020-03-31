/* global __DEV__ */
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native';
import isPlainObject from 'lodash/isPlainObject';
import DeviceAction from './DeviceAction';
import { awaitShortPress, scenarioDidCall } from '../../actions/regActions';
import { registerCallDetection } from '../../bits/NativeEmitters';
import { TOUCH_AND_RELEASE } from '../Cuff';
import Connecting from './Connecting';
import OhFicus from './OhFicus';
import RoundedButton from '../../bits/RoundedButton';
import Colors from '../../bits/Colors';

const FakeCall = ({ onBack, onSuccess }) => {
    const dispatch = useDispatch();
    const { callStatus, shortPressStatus } = useSelector(
        ({ hardware, user: { scenarios } }) => ({
            callStatus: hardware.callStatus,
            shortPressStatus: scenarios.shortPress,
        })
    );
    const [gotCall, setGotCall] = React.useState(false);
    const [finishedCall, setFinishedCall] = React.useState(false);
    const [timedOut, setTimedOut] = React.useState(false);

    React.useEffect(() => registerCallDetection(dispatch), [dispatch]);

    React.useEffect(() => {
        if (isPlainObject(callStatus)) {
            if (!callStatus.hasEnded && !callStatus.outgoing && !gotCall) {
                setGotCall(true);
            } else if (callStatus.hasEnded && gotCall) {
                setFinishedCall(true);
            }
        }
    }, [dispatch, callStatus, gotCall, onSuccess]);

    React.useEffect(() => {
        if (shortPressStatus === 'done' && !gotCall) {
            const timeoutId = setTimeout(() => setTimedOut(true), 30000);
            return () => clearTimeout(timeoutId);
        } else {
            return undefined;
        }
    }, [shortPressStatus, gotCall]);

    const retry = React.useCallback(() => {
        dispatch(awaitShortPress());
        setTimedOut(false);
    }, [dispatch]);

    const skip = React.useCallback(() => {
        dispatch(awaitShortPress());
        setGotCall(true);
        setFinishedCall(true);
    }, [dispatch]);

    const onNext = React.useCallback(() => {
        dispatch(scenarioDidCall());
        onSuccess();
    }, [dispatch, onSuccess]);

    if (timedOut && !finishedCall) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    backgroundColor: Colors.theme.cream,
                    alignItems: 'center',
                }}
            >
                <OhFicus retry={retry} />
                {__DEV__ && (
                    <RoundedButton
                        neumorphicDark
                        width={240}
                        text="Skip (Dev)"
                        onPress={skip}
                    />
                )}
            </SafeAreaView>
        );
    } else if (shortPressStatus === 'done' && !finishedCall) {
        return <Connecting />;
    } else {
        return (
            <DeviceAction
                onBack={onBack}
                onNext={finishedCall ? onNext : undefined}
                headline1="Ready to try it?"
                headline2="Press once & release."
                body="Press the button on your bracelet and we’ll call you. Listen, react, and hang up whenever!"
                confirm="I got the call"
                animation={finishedCall ? undefined : TOUCH_AND_RELEASE}
            />
        );
    }
};

export default FakeCall;
