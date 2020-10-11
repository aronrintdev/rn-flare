/* eslint-disable react/jsx-one-expression-per-line */
import * as React from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import Colors from '../../bits/Colors';
import RoundedButton from '../../bits/RoundedButton';
import { textFriendsResponse } from '../../actions/userActions';

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.theme.cream,
        alignItems: 'stretch',
    },
    h1: {
        fontFamily: 'Nocturno Display Std',
        fontSize: 30,
        textAlign: 'center',
        color: Colors.black,
        marginTop: 32,
        marginHorizontal: 24,
    },
    line: {
        backgroundColor: Colors.black,
        height: 1,
        width: 33,
        marginVertical: 12,
        alignSelf: 'center',
    },
    body: {
        fontFamily: 'Nocturno Display Std',
        fontSize: 18,
        textAlign: 'center',
        color: Colors.black,
        marginHorizontal: 24,
    },
    fakeTextContainer: {
        marginTop: 16,
        marginHorizontal: 24,
        backgroundColor: Colors.theme.purple,
        borderRadius: 30,
        borderBottomLeftRadius: 0,
        padding: 24,
    },
    fakeText: {
        textAlign: 'left',
        fontSize: 14,
        alignSelf: 'stretch',
        color: Colors.theme.cream,
    },
    spacedButton: {
        marginBottom: 12,
        alignSelf: 'center',
    },
    otherButton: {
        alignSelf: 'center',
    },
    scroller: {
        flex: 1,
    },
    fakeLink: {
        textDecorationLine: 'underline',
    },
});

const generateFullName = (first, last) => {
    if (first && last) {
        return `${first} ${last[0].toUpperCase()}`;
    } else if (first) {
        return first;
    } else {
        return 'Your friend';
    }
};

const TextConfirm = ({ componentId }) => {
    const { firstName, lastName } = useSelector(({ user: { profile } }) => ({
        firstName: profile ? profile.first_name : undefined,
        lastName: profile ? profile.last_name : undefined,
    }));

    const fullName = generateFullName(firstName, lastName);

    const dispatch = useDispatch();

    const setResponse = React.useCallback(
        response => {
            dispatch(textFriendsResponse(response));
            Navigation.dismissModal(componentId);
        },
        [componentId, dispatch]
    );

    const confirm = React.useCallback(() => {
        setResponse('confirm');
    }, [setResponse]);

    const notNow = React.useCallback(() => {
        Alert.alert(
            'Skipping means you can’t set up a Crew',
            'We need to inform your friends that they’re in your Crew so that they know what to do when you send them a message from your bracelet in the future. If you skip, we will not add friends to your Crew.',
            [
                {
                    text: 'Skip Crew',
                    style: 'destructive',
                    onPress: () => setResponse('cancel'),
                },
                {
                    text: 'Add Crew',
                    style: 'default',
                    onPress: () => setResponse('confirm'),
                },
            ]
        );
    }, [setResponse]);

    return (
        <SafeAreaView style={[StyleSheet.absoluteFill, styles.container]}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.h1}>You have a crew!</Text>
            <View style={styles.line} />
            <ScrollView style={styles.scroller} alwaysBounceVertical={false}>
                <Text style={styles.body}>
                    We need to text your crew members individually so that they
                    know that you’ve chosen them and what that means. (It’s also
                    nice for them to already have our number.)
                    {'\n\n'}
                    Here’s what we will text them:
                </Text>
                <View style={styles.fakeTextContainer}>
                    <Text style={styles.fakeText}>
                        <Text>
                            Hi there! {fullName} has added you to their Crew of
                            friends in Flare (a new safety jewelry company)
                            because you always have their back. You will receive
                            messages when {fullName} presses the hidden button
                            on their bracelet to indicate that they’re in an
                            iffy situation and want you to check up on them.
                            Learn more at
                        </Text>
                        <Text style={styles.fakeLink}>
                            http://bit.ly/FlareCrew
                        </Text>
                        {'\n\n'}
                        <Text>
                            Get your Flare and join the movement! Use {fullName}
                            ’s referral link
                        </Text>
                        <Text style={styles.fakeLink}>
                            https://getflare.com/discount/fl-h5ppzk
                        </Text>
                        <Text> to get $20 off your purchase!</Text>
                    </Text>
                </View>
            </ScrollView>
            <RoundedButton
                wrapperStyle={styles.spacedButton}
                onPress={confirm}
                text="Text My Crew"
                width={240}
            />
            <RoundedButton
                wrapperStyle={styles.otherButton}
                invisible
                onPress={notNow}
                text="Not Now"
                width={240}
            />
        </SafeAreaView>
    );
};

export default TextConfirm;
