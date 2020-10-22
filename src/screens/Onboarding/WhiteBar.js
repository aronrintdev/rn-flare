import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Colors from '../../bits/Colors';
import contactSupport from '../../bits/contactSupport';

import backwardArrow from '../../assets/backward-arrow.png';
import smallestAuraLogo from '../../assets/smallest-aura-logo.png';
import smallestWhiteLogo from '../../assets/smallest-white-logo.png';

const styles = StyleSheet.create({
    bar: {
        flexDirection: 'row',
        height: 30,
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 32,
        marginRight: 32,
        alignItems: 'stretch',
        alignSelf: 'stretch',
    },
    squashed: {
        marginBottom: 12,
    },
    padding: {
        paddingRight: 34,
    },
    backArrowWrapper: {
        width: 34,
        flexDirection: 'column',
        alignSelf: 'flex-start',
    },
    backArrow: {
        width: 34,
        resizeMode: 'center',
        flex: 1,
    },
    logo: {
        flex: 1,
        resizeMode: 'center',
    },
    helpWrapper: {
        marginLeft: 'auto',
        marginRight: -16,
        paddingHorizontal: 16,
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
    },
    help: {
        textTransform: 'uppercase',
        fontSize: 14,
        fontWeight: 'bold',
    },
    tintBlack: {
        tintColor: Colors.black,
    },
    tintOffWhite: {
        tintColor: Colors.theme.cream,
    },
    colorBlack: {
        color: Colors.black,
    },
    colorOffWhite: {
        color: Colors.theme.cream,
    },
});

const computeColorStyles = (black, offWhite) => {
    if (black) {
        return [styles.tintBlack, styles.colorBlack];
    } else if (offWhite) {
        return [styles.tintOffWhite, styles.colorOffWhite];
    } else {
        return [undefined, undefined];
    }
};

const WhiteBar = ({
    goBack,
    showLogo = true,
    showBack = true,
    black = false,
    aura = false,
    offWhite = false,
    showHelp = false,
    squashed = false,
}) => {
    const [tintStyle, colorStyle] = computeColorStyles(black, offWhite);

    return (
        <View
            style={[
                styles.bar,
                showHelp ? undefined : styles.padding,
                squashed ? styles.squashed : undefined,
            ]}
        >
            {showBack && (
                <TouchableOpacity
                    style={styles.backArrowWrapper}
                    onPress={goBack}
                >
                    <Image
                        source={backwardArrow}
                        style={[styles.backArrow, tintStyle]}
                    />
                </TouchableOpacity>
            )}
            {showLogo && (
                <Image
                    source={aura ? smallestAuraLogo : smallestWhiteLogo}
                    style={[styles.logo, tintStyle]}
                />
            )}
            {showHelp && (
                <TouchableOpacity
                    style={styles.helpWrapper}
                    onPress={contactSupport}
                >
                    <Text style={[styles.help, colorStyle]}>Help</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default React.memo(WhiteBar);
