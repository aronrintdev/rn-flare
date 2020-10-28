import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { DeviceTypes } from '../../bits/DeviceConstants';
import Button from '../../bits/Button';
import Colors from '../../bits/Colors';
import FlareDeviceID from '../../bits/FlareDeviceID';
import Spacing from '../../bits/Spacing';
import Strings from '../../locales/en';
import Type from '../../bits/Type';

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.black,
        paddingTop: Spacing.small,
        paddingBottom: Spacing.huge,
    },
    imageContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        height: 256,
    },
    image: {
        position: 'absolute',
        height: 215,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    label: {
        alignSelf: 'center',
        marginBottom: Spacing.small,
    },
    labelBold: {
        fontWeight: 'normal',
        fontSize: Type.size.large,
        marginTop: Spacing.medium,
        marginBottom: Spacing.small,
    },
    labelText: {
        textAlign: 'center',
        fontSize: Type.size.small,
    },
});

const JewelryListItem = ({ item: { id: itemId, type }, onRemove }) => {
    const remove = React.useCallback(() => {
        onRemove(itemId);
    }, [onRemove, itemId]);

    const device = DeviceTypes[type - 1];
    const localized = Strings.jewelry[`cuffV${type}`];

    return (
        <View style={styles.container} key={itemId}>
            <View style={styles.imageContainer}>
                {device && <Image style={styles.image} source={device.image} />}
                <View style={styles.label}>
                    <Text style={[styles.labelText, styles.labelBold]}>
                        {localized ? localized.name : '[Unrecognized Device]'}
                    </Text>
                    <FlareDeviceID value={itemId} style={styles.labelText} />
                </View>
            </View>
            {onRemove && (
                <Button
                    onPress={remove}
                    title={Strings.jewelry.remove}
                    primary
                    dark
                />
            )}
        </View>
    );
};

export default React.memo(JewelryListItem);
