import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    blueBoxText: {
        fontSize: 14,
        lineHeight: 16,
        color: '#fff',
        letterSpacing: 0,
    },
    blueMsgBox: {
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        backgroundColor: '#6978f6',
        paddingLeft: 24,
        paddingRight: 16,
        paddingVertical: 20,
        width: 'auto',
    },
    blueMsgLeftBox: {
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 0,
    },
    blueMsgRightBox: {
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 20,
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
