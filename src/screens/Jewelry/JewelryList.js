import React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import JewelryListItem from './JewelryListItem';
import Strings from '../../locales/en';
import Spacing from '../../bits/Spacing';

const styles = StyleSheet.create({
    emptyWarningText: {
        marginTop: Spacing.huge,
        textAlign: 'center',
        fontSize: 20,
    },
});

const EmptyJewelry = () => (
    <Text style={styles.emptyWarningText}>{Strings.jewelry.emptyList}</Text>
);

const JewelryList = ({ jewelry, onRemove }) => (
    <FlatList
        data={jewelry || []}
        ListEmptyComponent={EmptyJewelry}
        renderItem={({ item }) => (
            <JewelryListItem item={item} onRemove={onRemove} />
        )}
    />
);

export default JewelryList;
