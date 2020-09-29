/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import {
    Animated,
    Easing,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import Colors from '../../bits/Colors';
import RoundedButton from '../../bits/RoundedButton';
import { scenarioDidText } from '../../actions/regActions';
import haveEmoji12 from '../../bits/haveEmoji12';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#282737',
    },
    headline: {
        color: Colors.theme.cream,
        textAlign: 'center',
        alignSelf: 'stretch',
        fontSize: 20,
        fontFamily: 'Nocturno Display Std',
        marginTop: 48,
    },
    subhead: {
        color: Colors.theme.cream,
        textAlign: 'center',
        alignSelf: 'stretch',
        fontSize: 12,
        marginBottom: 24,
    },
    entryContainer: {
        flex: 1,
        backgroundColor: '#4C5282',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 12,
    },
    entry: {
        flexDirection: 'column',
        width: 280,
        marginTop: 24,
        marginHorizontal: 32,
        alignSelf: 'flex-start',
    },
    entryBodyWrapper: {
        borderRadius: 30,
        borderBottomLeftRadius: 0,
        marginBottom: 4,
        shadowColor: '#FFFFFF',
        shadowOpacity: 0.28,
        shadowOffset: { width: -2, height: -2 },
        shadowRadius: 2,
    },
    entryBodyInnerWrapper: {
        backgroundColor: '#4C5282',
        borderRadius: 30,
        borderBottomLeftRadius: 0,
        padding: 16,
        shadowColor: '#282737',
        shadowOpacity: 0.57,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 6,
    },
    entryBody: {
        fontSize: 14,
        color: Colors.theme.cream,
    },
    entryDetailBox: {
        flexDirection: 'row',
    },
    entrySender: {
        fontSize: 12,
        color: Colors.white,
        marginRight: 8,
    },
    entryTimestamp: {
        fontSize: 12,
        color: Colors.white,
        opacity: 0.7,
    },
    buttonWrapper: {
        marginTop: 'auto',
        paddingTop: 24,
        marginBottom: 24,
        alignSelf: 'center',
    },
});

const Entry = ({ text, timestamp = 'Just now', style }) => (
    <Animated.View style={[styles.entry, style]}>
        <View style={styles.entryBodyWrapper}>
            <View style={styles.entryBodyInnerWrapper}>
                <Text style={styles.entryBody}>{text}</Text>
            </View>
        </View>
        <View style={styles.entryDetailBox}>
            <Text style={styles.entrySender}>Flare</Text>
            <Text style={styles.entryTimestamp}>{timestamp}</Text>
        </View>
    </Animated.View>
);

const messages = [
    'Hey there, looks like you’re testing your flare! Holding down the button for 3 seconds is how we know to text the designated friend(s) in your Crew. 👯',
    'Choose contacts to add to your Crew so you’ll always have trusty friends by your side.',
    'Flare can also message 911 first responders and ask them to come to your location; you can enable this feature later in your settings.',
    'Text responses from your Crew will appear in the app like this. You won’t get texts on your phone so that it doesn’t start buzzing out of the blue.',
    'Instead, you’ll get a notification from Flare as a way of knowing that your message was sent. You can customize the notification so that it’s stealthy.',
    'If you have the 911 feature enabled, emergency dispatchers will call and text you.',
    'Press ‘I’m Okay’ when you’ve left the situation and we’ll let your Crew know. Try it now to continue.',
];

const TextSimulator = ({ onSuccess }) => {
    const dispatch = useDispatch();
    const insets = useSafeArea();
    const scrollRef = React.useRef();
    const [animations] = React.useState(() =>
        messages.map(() => new Animated.Value(0.0))
    );
    const [current, setCurrent] = React.useState(0);
    const [busy, setBusy] = React.useState(true);

    const fullSuccess = React.useCallback(() => {
        dispatch(scenarioDidText());
        onSuccess();
    }, [dispatch, onSuccess]);

    const nextAnimation = React.useCallback(() => {
        setBusy(true);
        if (scrollRef.current) {
            scrollRef.current.scrollToEnd();
        }
        Animated.timing(animations[current], {
            useNativeDriver: true,
            toValue: 1.0,
            duration: 300,
            easing: Easing.ease,
        }).start(() => {
            setBusy(false);
            setCurrent(n => n + 1);
        });
    }, [animations, current]);

    React.useEffect(() => {
        if (current === 0) {
            nextAnimation();
        }
    }, [current, nextAnimation]);

    const done = current === messages.length;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" />
            <Text style={styles.headline}>You started a message. 📢</Text>
            <Text style={styles.subhead}>Just now</Text>
            <View
                style={[
                    styles.entryContainer,
                    { paddingBottom: insets.bottom },
                ]}
            >
                <ScrollView
                    alwaysBounceVertical={false}
                    ref={scrollRef}
                    indicatorStyle="white"
                >
                    {messages.map(
                        (message, index) =>
                            index <= current && (
                                <Entry
                                    key={index}
                                    text={message}
                                    style={{ opacity: animations[index] }}
                                />
                            )
                    )}
                </ScrollView>
                <RoundedButton
                    neumorphic
                    color="#4C5282"
                    onPress={done ? fullSuccess : nextAnimation}
                    text={done ? 'I’m okay 👌' : 'Next'}
                    wrapperStyle={styles.buttonWrapper}
                    width={200}
                    fontSize={14}
                    height={46}
                    disabled={busy}
                />
            </View>
        </View>
    );
};

export default TextSimulator;
