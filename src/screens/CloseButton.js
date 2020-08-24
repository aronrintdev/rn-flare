import * as React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

import x from '../assets/x.png';
import Colors from '../bits/Colors';

const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        width: 80,
        height: 48,
        alignSelf: 'flex-start',
    },
    image: {
        height: '100%',
        width: '100%',
    },
    black: {
        tintColor: Colors.black,
    },
});

const CloseButton = ({ onPress, style, black = false }) => (
    <TouchableOpacity onPress={onPress} style={[styles.wrapper, style]}>
        <Image
            source={x}
            style={[styles.image, black ? styles.black : undefined]}
        />
    </TouchableOpacity>
);

export default React.memo(CloseButton);
