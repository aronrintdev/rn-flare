import * as React from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';

import Colors from '../../bits/Colors';

import cardbg from '../../assets/card-bg.jpg';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        paddingHorizontal: 8,
        height: 200,
        paddingTop: 32,
    },
    card: {
        height: 200,
        paddingHorizontal: 24,
        paddingTop: 67,
        flexDirection: 'column',
        alignSelf: 'stretch',
        alignItems: 'flex-start',
    },
    cardbg: {
        position: 'absolute',
        left: -5,
        top: 8,
        height: 200,
        borderTopLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    title: {
        color: Colors.theme.cream,
        fontFamily: 'Nocturno Display Std',
        fontSize: 20,
        marginBottom: 8,
    },
    body: {
        color: Colors.theme.cream,
        fontSize: 14,
        marginTop: 10,
    },
    disabled: {
        opacity: 0.4,
    },
});

const TaskCard = ({
    title,
    body,
    onPress,
    width,
    image: { source, width: imageWidth, height: imageHeight },
}) => (
    <TouchableOpacity style={[styles.container, { width }]} onPress={onPress}>
        <View style={styles.card}>
            <Image
                source={cardbg}
                style={[styles.cardbg, { width: width - 24 }]}
                resizeMode="cover"
            />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.body}>{body}</Text>
        </View>
        <Image
            source={source}
            width={imageWidth}
            height={imageHeight}
            style={{
                position: 'absolute',
                left: 24,
                width: imageWidth,
                height: imageHeight,
                top: Math.max(0, 91 - imageHeight),
            }}
        />
    </TouchableOpacity>
);

export default React.memo(TaskCard);
