import * as React from 'react';
import { SafeAreaView, ScrollView, StatusBar, View } from 'react-native';

import HelpSection from '../AddHardware/HelpSection';
import Headline from '../Onboarding/Headline';
import Aura from '../../bits/Aura';
import styles from './styles';

import aura1521 from '../../assets/aura-1521.jpg';
import RoundedButton from '../../bits/RoundedButton';

const GoldenRules = ({ finishUp, buttonText = 'Got it. Let’s go!' }) => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Aura source={aura1521} />
            <Headline style={[styles.headline, { marginTop: 32 }]}>
                {'Flare’s Golden\nRules'}
            </Headline>
            <View style={styles.line} />
            <ScrollView
                style={{ flex: 1, alignSelf: 'stretch', paddingHorizontal: 32 }}
                contentContinerStyle={{
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                alwaysBounceVertical={false}
            >
                <HelpSection emoji="✅" title="Bluetooth On.">
                    Leave your bluetooth on for Flare to work (but you don’t
                    need to pair with your bracelet). Your phone needs to have
                    service for Flare to work.
                </HelpSection>
                <HelpSection emoji="📍" title="Location Services.">
                    If you send a message to your crew, they will also receive
                    your location. Keep location services “always” allowed.
                </HelpSection>
                <HelpSection emoji="👯" title="5 feet or less.">
                    Your phone needs to be within 5 feet of your bracelet to get
                    the signal.
                </HelpSection>
                <HelpSection emoji="💕" title="Love.">
                    Use Flare with love, thoughtfulness, honesty and good
                    intention. You are now part of the movement that is breaking
                    stereotypes about safety and supporting one another.
                </HelpSection>
            </ScrollView>
            <RoundedButton
                wrapperStyle={{ marginBottom: 24 }}
                text={buttonText}
                onPress={finishUp}
            />
        </SafeAreaView>
    );
};

export default GoldenRules;
