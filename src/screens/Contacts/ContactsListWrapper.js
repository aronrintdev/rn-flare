import React from 'react';
import {
    ActivityIndicator,
    Keyboard,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useSelector } from 'react-redux';
import isArrayLike from 'lodash/isArrayLike';
import escapeRegExp from 'lodash/escapeRegExp';
import Icon from 'react-native-vector-icons/Entypo';

import NeedContactsPermission from './NeedContactsPermission';
import ContactsList from './ContactsList';
import Colors from '../../bits/Colors';

const styles = StyleSheet.create({
    activityWrapper: {
        flexGrow: 1,
        alignItems: 'center',
        alignContent: 'center',
    },
    searchWrapper: {
        backgroundColor: Colors.backgrounds.blue,
        alignSelf: 'stretch',
    },
    searchInnerWrapper: {
        marginVertical: 8,
        marginHorizontal: 16,
        alignSelf: 'stretch',
        flexDirection: 'row',
        backgroundColor: Colors.theme.cream,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    icon: {
        color: Colors.black,
    },
    search: {
        flex: 1,
        fontSize: 18,
        lineHeight: 24,
        marginLeft: 8,
    },
});

const selector = ({
    user: { contacts, contactsCount, contactsState, crewUpdateState },
}) => ({
    contacts,
    contactsCount,
    contactsState,
    loading: crewUpdateState === 'requested',
});

const ContactsListWrapper = ({ handleContactPress }) => {
    const searchRef = React.useRef();
    const { contacts, contactsState, contactsCount, loading } = useSelector(
        selector
    );

    const [filter, setFilter] = React.useState('');
    const usingFilter = filter.trim().length > 0;

    const sections = React.useMemo(
        () =>
            isArrayLike(contacts)
                ? Array.prototype.map.call(contacts, ({ title }) => title)
                : undefined,
        [contacts]
    );

    const filteredContacts = React.useMemo(() => {
        const re = new RegExp(escapeRegExp(filter.trim()), 'i');
        if (usingFilter) {
            return contacts
                .map(section =>
                    section.set(
                        'data',
                        section.data.filter(({ name }) => re.test(name))
                    )
                )
                .filter(section => section.data.length > 0);
        } else {
            return contacts;
        }
    }, [contacts, filter, usingFilter]);

    const focusSearch = React.useCallback(() => {
        searchRef.current?.focus();
    }, []);

    const clearSearch = React.useCallback(() => {
        setFilter('');
        Keyboard.dismiss();
    }, []);

    if (loading || contactsState === 'requested') {
        return (
            <View style={styles.activityWrapper}>
                <ActivityIndicator size="large" />
            </View>
        );
    } else if (contactsState === 'failed') {
        return <NeedContactsPermission />;
    } else {
        return (
            <>
                <TouchableWithoutFeedback
                    accessibilityRole="none"
                    onPress={focusSearch}
                >
                    <View style={styles.searchWrapper}>
                        <View style={styles.searchInnerWrapper}>
                            <Icon name="magnifying-glass" size={24} />
                            <TextInput
                                ref={searchRef}
                                style={styles.search}
                                placeholder="Search"
                                onChangeText={setFilter}
                                keyboardType="default"
                                value={filter}
                                color={Colors.black}
                            />
                            <TouchableOpacity onPress={clearSearch}>
                                <Icon name="circle-with-cross" size={24} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <ContactsList
                    contacts={filteredContacts}
                    contactsCount={contactsCount}
                    onPressContact={handleContactPress}
                    sectionList={usingFilter ? undefined : sections}
                />
            </>
        );
    }
};

export default ContactsListWrapper;
