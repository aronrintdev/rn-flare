/* eslint-disable react/jsx-curly-brace-presence */
import * as React from 'react';
import { Image, StyleSheet, Text } from 'react-native';

import Colors from '../../bits/Colors';

import constellation1 from '../../assets/constellation-1.png';
import constellation2 from '../../assets/constellation-2.png';
import constellation3 from '../../assets/constellation-3.png';
import constellation4 from '../../assets/constellation-4.png';
import constellation5 from '../../assets/constellation-5.png';
import constellation6 from '../../assets/constellation-6.png';

const styles = StyleSheet.create({
    image: {
        width: 168,
        height: 94,
        marginBottom: 24,
    },
    text: {
        fontSize: 12,
        color: Colors.theme.cream,
        letterSpacing: 1,
    },
    textNumber: {
        fontWeight: 'bold',
    },
    textString: {
        fontFamily: 'Nocturno Display Std',
    },
});

const images = [
    null,
    constellation1,
    constellation2,
    constellation3,
    constellation4,
    constellation5,
    constellation6,
    constellation6,
];

const Constellation = ({ count, maxCount = 7 }) => {
    const image = images[count];

    return (
        <>
            {image && <Image source={image} style={styles.image} />}
            <Text style={styles.text}>
                <Text style={styles.textNumber}>{count}</Text>
                <Text style={styles.textString}>{' of '}</Text>
                <Text style={styles.textNumber}>{maxCount}</Text>
                <Text style={styles.textString}>{' complete'}</Text>
            </Text>
        </>
    );
};

export default Constellation;
