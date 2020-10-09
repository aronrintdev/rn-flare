import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import styles from './styles';

const sectionStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        marginBottom: 12,
    },
    icon: {
        width: 32,
        height: 32,
        marginRight: 12,
        alignSelf: 'flex-start',
    },
    emoji: {
        textAlign: 'center',
        fontSize: 30,
    },
    textWrapper: {
        flexDirection: 'column',
        flex: 1,
    },
    nomargin: {
        marginTop: 0,
    },
});

const HelpSection = ({ emoji, icon, title, children, blackText }) => (
    <View style={sectionStyles.container}>
        {typeof emoji === 'string' ? (
            <Text style={[sectionStyles.icon, sectionStyles.emoji]}>
                {emoji}
            </Text>
        ) : (
            <Image
                source={icon}
                style={sectionStyles.icon}
                resizeMode="center"
            />
        )}
        <View style={sectionStyles.textWrapper}>
            <Text
                style={[
                    styles.subhead,
                    blackText ? {} : styles.whiteText,
                    sectionStyles.nomargin,
                ]}
            >
                {title}
            </Text>
            <Text style={[styles.helpText, blackText ? {} : styles.whiteText]}>
                {children}
            </Text>
        </View>
    </View>
);

export default HelpSection;
