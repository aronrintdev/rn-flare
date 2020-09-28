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
        showFlareServiceError: false,
        didShare: false,
        fetchingCallScripts: false,
        contacts: [],
        contactsCrewLookup: {},
        crewEvents: [],
        crews: [],
        devices: [],
        hasActiveFlare: false,
        crewEventTimeline: [
            {
                name: 'Flare',
                message:
                    'Hey there, looks like you’re testing your flare! Holding down the button for 3 seconds is how we know to text the designated friend(s) in your Crew. 👯',
                timestamp: new Date(),
                action_type: 2,
            },
            {
                name: 'Flare',
                message:
                    'Choose contacts to add to your Crew so you’ll always have trusty friends by your side.',
                timestamp: new Date(),
                action_type: 2,
            },
            {
                name: 'Flare',
                message:
                    'Flare can also message 911 first responders and ask them to come to your location; you can enable this feature later in your settings.',
                timestamp: new Date(),
                action_type: 2,
            },
            {
                name: 'Flare',
                message:
                    'Text responses from your Crew will appear in the app like this. You won’t get texts on your phone so that it doesn’t start buzzing out of the blue.',
                timestamp: new Date(),
                action_type: 2,
            },
            {
                name: 'Flare',
                message:
                    'Instead, you’ll get a notification from Flare as a way of knowing that your message was sent. You can customize the notification so that it’s stealthy.',
                timestamp: new Date(),
                action_type: 2,
            },
            {
                name: 'Flare',
                message:
                    'If you have the 911 feature enabled, emergency dispatchers will call and text you.',
                timestamp: new Date(),
                action_type: 2,
            },
            {
                name: 'Flare',
                message:
                    'Press ‘I’m Okay’ when you’ve left the situation and we’ll let your Crew know. Try it now to continue.',
                timestamp: new Date(),
                action_type: 2,
            },
        ],
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
            enabled911Feature: false,
            crewEnabled: false,
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
