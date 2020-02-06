import Immutable from 'seamless-immutable';
import Strings from '../locales/en';

export const initialState = Immutable({
    nav: {
        root: 'insecure', // 'insecure' / 'secure',
        rootComponentId: null,
    },
    user: {
        callScript: 1,
        callScripts: null,
        sawCallScripts: false,
        sawNotifSettings: false,
        didShare: false,
        fetchingCallScripts: false,
        contacts: [],
        contactsCrewLookup: {},
        crewEvents: [],
        crews: [],
        devices: [],
        hasActiveFlare: false,
        permissions: {
            bluetooth: false,
            contacts: false,
            location: false,
            locationPrompted: false,
            notification: false,
        },
        profile: {},
        authToken: null,
        radioToken: null,
        settings: {
            promptType: Strings.settings.notifications.defaultOption,
            promptMessage: Strings.settings.notifications.defaultMessage,
            enableNotifications: true,
            analyticsEnabled: true,
        },
        reg: {
            name: null,
            email: null,
            phone: null,
            password: null,
            preferredPairing: null,
            foundDevice: null,
        },
        scenarios: {
            screen: null,
            didCall: false,
            didText: false,
            shortPress: null,
            longPress: null,
        },
        addedToContacts: false,
        textFriends: undefined,
    },
    beacons: {
        latest: null,
        recent: [],
        recentShortPressCounts: [],
        problems: [],
        deviceCounts: {
            // must match keys of Strings.manufacting.stages
            new: 0,
            added: 0,
            burnIn: 0,
            ready: 0,
        },
    },
    hardware: {
        bluetooth: 'on',
        bleListening: false,
        bleListeningChange: 'succeeded',
        bleListeningChangeDir: 'down',
        callStatus: null,
    },
    manufacturing: {},
});
