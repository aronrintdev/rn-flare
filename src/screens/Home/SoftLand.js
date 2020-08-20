import * as React from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import isPlainObject from 'lodash/isPlainObject';
import { Navigation } from 'react-native-navigation';

import Aura from '../../bits/Aura';
import Colors from '../../bits/Colors';
import Constellation from './Constellation';
import TaskCard from './TaskCard';
import useDimensions from '../../bits/useDimensions';
import { getCallScripts } from '../../actions/userActions';
import count from '../../bits/count';
import useBluetoothStatus from '../../bits/useBluetoothStatus';
import { registerPermissionDetection } from '../../bits/NativeEmitters';
import { useCards } from './Cards';
import Warning from '../Warning';

import aura1528 from '../../assets/aura-1528.jpg';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    headline: {
        textAlign: 'center',
        color: Colors.theme.cream,
        fontFamily: 'Nocturno Display Std',
        fontSize: 20,
        marginBottom: 24,
        marginTop: 48,
    },
    subhead: {
        textAlign: 'left',
        alignSelf: 'flex-start',
        color: Colors.theme.cream,
        fontFamily: 'Nocturno Display Std',
        fontSize: 20,
        marginTop: 12,
        marginHorizontal: 56,
    },
    list: {
        flexGrow: 0,
        marginTop: 16,
        paddingBottom: 12,
    },
    listContainer: {
        alignSelf: 'stretch',
        height: 224,
    },
    spacer: {
        width: 48,
    },
    bottomCard: {
        backgroundColor: Colors.theme.cream,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'column',
        marginTop: 'auto',
        alignSelf: 'stretch',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'stretch',
        height: 46,
        marginTop: -23,
        width: 180,
    },
    toggleItem: {
        width: 90,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.theme.cream,
        borderWidth: 1,
    },
    toggleItemLeft: {
        borderTopLeftRadius: 23,
        borderBottomLeftRadius: 23,
        borderRightWidth: 0,
        paddingLeft: 4,
    },
    toggleItemRight: {
        borderTopRightRadius: 23,
        borderBottomRightRadius: 23,
        borderLeftWidth: 0,
        paddingRight: 4,
    },
    toggleItemSelected: {
        backgroundColor: Colors.black,
    },
    toggleItemUnselected: {
        backgroundColor: '#B77CA3',
    },
    toggleText: {
        color: Colors.theme.cream,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Nocturno Display Std',
    },
});

const mapState = ({
    user: {
        authToken,
        crews,
        permissions: { location: locationPermission },
        callScripts,
        sawCallScripts,
        sawNotifSettings,
        addedToContacts,
        didShare,
    },
}) => ({
    authToken,
    locationPermission,
    haveCrew:
        Array.isArray(crews) &&
        crews.some(
            crew =>
                'members' in crew &&
                Array.isArray(crew.members) &&
                crew.members.length > 0
        ),
    haveCallScripts:
        isPlainObject(callScripts) && Object.keys(callScripts).length > 0,
    sawCallScripts,
    sawNotifSettings,
    addedToContacts,
    didShare,
});

const SoftLand = ({ componentId }) => {
    const dispatch = useDispatch();
    const selector = useSelector(mapState);
    const insets = useSafeArea();
    const bluetoothStatus = useBluetoothStatus();
    React.useEffect(() => registerPermissionDetection(dispatch), [dispatch]);

    const items = useCards({
        componentId,
        selector: { ...selector, bluetoothStatus },
        dispatch,
    });
    const doneCount = count(items, ({ done }) => done);
    const undoneItems = items.filter(
        ({ done, alwaysShow = false }) => !done || alwaysShow
    );

    const { width: screenWidth } = useDimensions();
    const cardWidth = screenWidth - 96;

    const renderItem = React.useCallback(
        ({ item }) => <TaskCard {...item} width={cardWidth} />,
        [cardWidth]
    );

    const getItemLayout = React.useCallback(
        (data, index) => ({
            length: cardWidth,
            offset: 48 + index * cardWidth,
            index,
        }),
        [cardWidth]
    );

    const bluetoothHelp = React.useCallback(() => {
        Navigation.showModal({
            component: {
                name: 'com.flarejewelry.app.PermissionsReminder',
                passProps: { bluetooth: true },
            },
        });
    }, []);

    // preload list of call scripts if we've never seen them before, so as to
    // lower the odds of them being not yet available when we want to show
    // the UI
    React.useEffect(() => {
        if (selector.authToken && !selector.haveCallScripts) {
            dispatch(getCallScripts(selector.authToken));
        }
    }, [selector.haveCallScripts, selector.authToken, dispatch]);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" />
            <Aura source={aura1528} />
            <Text style={styles.headline}>Customize your Flare</Text>
            <Constellation count={doneCount} />
            <FlatList
                style={styles.list}
                contentContainerStyle={styles.listContainer}
                data={undoneItems}
                extraData={cardWidth}
                renderItem={renderItem}
                horizontal
                ListHeaderComponent={<View style={styles.spacer} />}
                ListFooterComponent={<View style={styles.spacer} />}
                snapToAlignment="start"
                snapToInterval={cardWidth}
                decelerationRate="fast"
                getItemLayout={getItemLayout}
            />
            {bluetoothStatus === 'off' ? (
                <Warning onPress={bluetoothHelp} bottomInset={insets.bottom}>
                    Bluetooth is currently turned off on your device. You must
                    turn it on to connect to your jewelry.
                </Warning>
            ) : null}
        </View>
    );
};

export default SoftLand;
