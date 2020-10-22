import * as React from 'react';
import { Image, StyleSheet, Text, View, Dimensions } from 'react-native';

import styles from './styles';

const SPACE_HEIGHT = Dimensions.get('window').height - 30;

const sectionStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        marginBottom: (SPACE_HEIGHT * 8) / 670,
    },
    icon: {
        width: 32,
        height: 32,
        marginRight: 12,
        alignSelf: 'flex-start',
    },
    emoji: {
        textAlign: 'center',
        fontSize: (SPACE_HEIGHT * 24) / 670,
    },
    textWrapper: {
        flexDirection: 'column',
        flex: 1,
    },
    nomargin: {
        marginTop: 0,
    },
    subheadText: {
        fontSize: (SPACE_HEIGHT * 18) / 670,
        lineHeight: (SPACE_HEIGHT * 24) / 670,
    },
    helpText: {
        fontSize: (SPACE_HEIGHT * 13) / 670,
        lineHeight: (SPACE_HEIGHT * 16) / 670,
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
                    sectionStyles.subheadText,
                ]}
            >
                {title}
            </Text>
            <Text
                style={[
                    styles.helpText,
                    blackText ? {} : styles.whiteText,
                    sectionStyles.helpText,
                ]}
            >
                {children}
            </Text>
        </View>
    </View>
);

export default HelpSection;
