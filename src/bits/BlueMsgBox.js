import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    blueBoxText: {
        fontSize: 13,
        lineHeight: 16,
        color: '#fff',
        letterSpacing: 0,
        paddingLeft: 22,
        paddingRight: 18,
        paddingVertical: 16,
    },
    blueMsgBox: {
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        backgroundColor: '#6978f6',
        alignSelf: 'flex-start',
    },
    blueMsgLeftBox: {
        borderBottomRightRadius: 18,
        borderBottomLeftRadius: 0,
    },
    blueMsgRightBox: {
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 18,
    },
});

const BlueMsgBox = ({ containerStyles, rightAligned, children }) => (
    <View
        style={[
            styles.blueMsgBox,
            rightAligned ? styles.blueMsgRightBox : styles.blueMsgLeftBox,
            containerStyles,
        ]}
    >
        <Text style={styles.blueBoxText}>{children}</Text>
    </View>
);

export default BlueMsgBox;
