import * as React from 'react';
import { Navigation } from 'react-native-navigation';

import { openContactsScreen } from '../Contacts';
import shareFlare from '../../bits/shareFlare';
import addToContacts from '../AddToContacts';

import cardCrew from '../../assets/card-crew.png';
import cardNotifs from '../../assets/card-notifs.png';
import cardCallscript from '../../assets/card-callscript.png';
import cardPermissions from '../../assets/card-permissions.png';
import cardShare from '../../assets/card-share.png';
import cardAddcontacts from '../../assets/card-addcontacts.png';

const ITEM_TEMPLATES = [
    {
        key: 'crew',
        image: { source: cardCrew, width: 106, height: 79 },
        title: 'Choose your backup',
        body:
            'Which friends do you want your Flare bracelet to text? This is your crew.',
        done: ({ haveCrew }) => haveCrew,
    },
    {
        key: 'notifs',
        image: { source: cardNotifs, width: 84, height: 88 },
        title: 'Customize Notifications',
        body:
            'How do you want to be notified that your text has been sent? Choose your level of discretion.',
        done: ({ sawNotifSettings }) => sawNotifSettings,
    },
    {
        key: 'callscript',
        image: { source: cardCallscript, width: 69, height: 91 },
        title: 'Pick the perfect phone call',
        body:
            'What script do you want to hear when we call you? Choose the best for you.',
        done: ({ sawCallScripts }) => sawCallScripts,
    },
    {
        key: 'permissions',
        image: { source: cardPermissions, width: 119, height: 77 },
        title: 'Allow Location and Bluetooth',
        body: '“Always allow” your location and turn Bluetooth on.',
        done: ({ locationPermission, bluetoothStatus }) =>
            locationPermission &&
            (bluetoothStatus === 'on' || bluetoothStatus === ''),
    },
    {
        key: 'share',
        image: { source: cardShare, width: 83, height: 89 },
        title: 'Share Flare 💕',
        body:
            'Invite your friends to join the movement. Send a special promo code.',
        done: () => false,
    },
    {
        key: 'addcontacts',
        image: { source: cardAddcontacts, width: 40, height: 95 },
        title: 'Add Flare to Contacts',
        body: 'Make sure you add our number to your contacts.',
        done: ({ addedToContacts }) => addedToContacts,
    },
    {
        key: 'onboard',
        title: 'Onboard with Flare',
        body: 'Test your cuff to learn how it works and when to use it.',
        done: () => true,
    },
];

export const useCards = ({ componentId, selector, dispatch }) => {
    const callbacks = {
        crew: React.useCallback(() => {
            openContactsScreen(componentId);
        }, [componentId]),
        callscript: React.useCallback(() => {
            Navigation.push(componentId, {
                component: { name: 'com.flarejewelry.app.settings.Call' },
            });
        }, [componentId]),
        notifs: React.useCallback(() => {
            Navigation.push(componentId, {
                component: {
                    name: 'com.flarejewelry.app.settings.Notifications',
                },
            });
        }, [componentId]),
        permissions: React.useCallback(() => {
            Navigation.showModal({
                component: { name: 'com.flarejewelry.app.PermissionsReminder' },
            });
        }, []),
        share: React.useCallback(() => {
            shareFlare(selector.referralKey);
        }, [selector.referralKey]),
        addcontacts: React.useCallback(() => {
            addToContacts(dispatch);
        }, [dispatch]),
    };

    return ITEM_TEMPLATES.map(({ done, key, ...rest }) => ({
        done: done(selector),
        key,
        onPress: callbacks[key],
        ...rest,
    }));
};
