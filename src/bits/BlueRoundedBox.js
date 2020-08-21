import * as React from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
    blueMsgBox: {
        borderRadius: 20,
        backgroundColor: 'rgba(105, 120, 246, 0.35)',
        padding: 15,
        width: 'auto',
        marginVertical: 8,
    },
});

const BlueRoundedBox = ({ style, children }) => (
    <View style={[styles.blueMsgBox, style]}>{children}</View>
);

export default BlueRoundedBox;
