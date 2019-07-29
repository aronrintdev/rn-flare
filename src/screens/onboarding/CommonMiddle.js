import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Spacing from '../../bits/Spacing';
import Type from '../../bits/Type';
import Colors from '../../bits/Colors';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        paddingTop: Spacing.medium,
        marginBottom: Spacing.medium,
    },
    right: {
        alignItems: 'flex-start',
        marginLeft: Spacing.huge,
    },
    left: {
        alignItems: 'flex-end',
        marginRight: Spacing.huge,
    },
    h1: {
        fontSize: Type.size.huge,
        color: Colors.white,
        marginBottom: Spacing.medium,
    },
    body: {
        fontSize: Type.size.medium,
        color: Colors.white,
        marginBottom: Spacing.medium,
    },
    image: {
        width: '100%',
        height: 240,
        resizeMode: 'cover',
    },
});

export default function CommonMiddle(props) {
    return (
        <View style={[styles.container, props.left && styles.left, props.right && styles.right]}>
            {props.title && <Text style={styles.h1}>{props.title}</Text>}
            {props.body && <Text style={styles.body}>{props.body}</Text>}
            <Image source={{ uri: props.imageSource }} style={styles.image} />
        </View>
    );
}
