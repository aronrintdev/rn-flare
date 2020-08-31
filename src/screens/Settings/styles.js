import { Alert, StyleSheet } from 'react-native';
import { Navigation } from 'react-native-navigation';

import Colors from '../../bits/Colors';

import backIcon from '../../assets/backward-arrow.png';

const borderColor = '#545458A6';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.theme.cream,
        justifyContent: 'flex-start',
        flex: 1,
        alignItems: 'stretch',
    },
    subhead: {
        fontSize: 13,
        marginTop: 16,
        textTransform: 'uppercase',
        marginHorizontal: 24,
        marginBottom: 8,
    },
    explain: {
        fontSize: 13,
        marginHorizontal: 32,
        marginTop: 8,
        lineHeight: 15,
        color: Colors.black,
        alignSelf: 'flex-start',
    },
    itemContainer: {
        flexDirection: 'column',
        backgroundColor: Colors.backgrounds.gray,
        paddingLeft: 0,
    },
    firstItemContainer: {
        borderTopWidth: 1,
        borderColor,
    },
    lastItemContainer: {
        borderBottomWidth: 1,
        borderColor,
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    item: {
        flexDirection: 'row',
        height: 48,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: 16,
        paddingLeft: 16,
        paddingRight: 24,
        borderColor,
        borderBottomWidth: 1,
    },
    itemBorder: {
        borderColor,
        borderTopWidth: 1,
    },
    action: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginRight: -12,
    },
    icon: {
        width: 24,
        height: 24,
    },
    text: {
        fontSize: 17,
        color: Colors.black,
        flex: 1,
    },
    disabled: {
        opacity: 0.4,
    },
    spaced: {
        marginTop: 48,
    },
    textField: {
        marginHorizontal: 24,
    },
});

export const navOptions = (titleText, back = true) => {
    const opts = {
        topBar: {
            visible: true,
            animate: false,
            background: { color: Colors.theme.cream },
            title: {
                text: titleText,
                color: Colors.black,
            },
        },
    };

    if (back) {
        opts.topBar.leftButtons = [
            {
                id: 'backButton',
                icon: backIcon,
                color: Colors.black,
            },
        ];
    }

    return opts;
};

export const saveButton = {
    id: 'save',
    text: 'Save',
    color: Colors.black,
};

export const confirmClose = (dirty, componentId) => {
    if (dirty) {
        Alert.alert('Are you sure?', 'You haven’t saved your changes', [
            {
                style: 'cancel',
                text: 'Cancel',
                onPress: () => {},
            },
            {
                style: 'destructive',
                text: 'Close Anyway',
                onPress: () => {
                    Navigation.pop(componentId);
                },
            },
        ]);
    } else {
        Navigation.pop(componentId);
    }
};
