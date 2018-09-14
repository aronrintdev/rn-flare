import Immutable from 'seamless-immutable';
import * as types from '../actions/actionTypes';
import { initialState } from './initialState';
import { filterContacts } from '../helpers/contacts';

function getContactsCrewLookup(crew) {
    const memberKeys = crew.members.map(member => member.key);
    const contactsCrewLookup = {};
    memberKeys.forEach((key) => {
        // @TODO: eventually the values in this object should be arrays of crew IDs.
        contactsCrewLookup[key] = crew.id;
    });
    return contactsCrewLookup;
}

// eslint-disable-next-line import/prefer-default-export
export function user(state = initialState.user, action = {}) {
    switch (action.type) {
    /**
     * AUTHENTICATION
     */
    case types.AUTH_FAILURE:
        return state.merge({
            token: null,
            authState: 'failed',
        });
    case types.AUTH_REQUEST:
        return state.merge({
            token: null,
            authState: 'requested',
        });
    case types.AUTH_SUCCESS: {
        const firstCrew = action.crews && action.crews.length ? action.crews[0] : { id: 0, members: [] };
        return state.merge({
            token: action.data.data.auth_token,
            profile: action.data.data.profile,
            crews: action.data.data.crews,
            devices: action.data.data.devices,
            authState: 'succeeded',
            contactsCrewLookup: getContactsCrewLookup(firstCrew),
        });
    }

    /**
     * ACCOUNT STATUS
     * We check account status on app launch after users authenticate. The intent
     * is to keep all devices in sync with each other.
     */
    case types.ACCOUNT_DETAILS_SUCCESS:
        return state.merge({
            crewEvents: action.data.crew_events,
            crews: action.data.crews,
            devices: action.data.devices,
            hasActiveFlare: action.data.crew_events && action.data.crew_events.length > 0,
            profile: action.data.profile,
        });

    /**
     * BEACONS
     */
    case types.ACTIVATE_FLARE_REQUEST:
        return state.merge({
            activatingFlareState: 'request',
        });

    case types.ACTIVATE_FLARE_SUCCESS:
        return state.merge({
            activatingFlareState: 'success',
            crewEvents: action.data.crewEvents,
            hasActiveFlare: action.data.crewEvents && action.data.crewEvents.length > 0,
        });

    case types.ACTIVATE_FLARE_FAILURE:
        return state.merge({
            activatingFlareState: 'failure',
        });


    case types.CANCEL_ACTIVE_FLARE_REQUEST:
        return state.merge({
            cancelingActiveFlare: true,
            cancelActiveFlareState: 'request',
        });

    case types.CANCEL_ACTIVE_FLARE_SUCCESS:
        return state.merge({
            crewEvents: action.data.crewEvents,
            hasActiveFlare: action.data.crewEvents && action.data.crewEvents.length > 0,
            cancelingActiveFlare: false,
            cancelActiveFlareState: 'success',
        });

    case types.CANCEL_ACTIVE_FLARE_FAILURE:
        return state.merge({
            cancelingActiveFlare: false,
            cancelActiveFlareState: 'failure',
        });

    /**
     * CONTACTS
     */
    case types.CONTACTS_REQUEST:
        return state.merge({
            contactsState: 'requested',
        });

    case types.CONTACTS_FAILURE:
        return state.merge({
            contactsState: 'failed',
        });

    case types.CONTACTS_SUCCESS: {
        const filteredContacts = filterContacts(action.contacts);
        return state.merge({
            contactsState: 'succeeded',
            contacts: filteredContacts.contacts,
            contactsCount: filteredContacts.count,
        });
    }

    /**
     * CREWS
     */
    case types.CREW_SET_REQUEST:
        return state.merge({
            crewUpdateState: 'requested',
        });

    case types.CREW_SET_FAILURE:
        return state.merge({
            crewUpdateState: 'failed',
        });

    case types.CREW_SET_SUCCESS: {
        return state.merge({
            crewUpdateState: 'succeeded',
            crews: [action.crew],
            contactsCrewLookup: getContactsCrewLookup(action.crew),
        });
    }

    /**
     * PERMISSIONS
     */
    case types.PERMISSIONS_REQUEST:
        return state.merge({
            requestingPermissions: true,
        });
    case types.PERMISSIONS_FAILURE:
        return state.merge({
            requestingPermissions: false,
            requestingPermissionsFailed: true,
        });
    case types.PERMISSIONS_SUCCESS: {
        const updatedPermissions = Immutable.setIn(state.permissions, [action.permission], action.granted);
        return state.merge({
            permissions: updatedPermissions,
            requestingPermissions: false,
            requestingPermissionsFailed: false,
        });
    }

    /**
     * DEVICES
     */
    case types.DEVICE_CLAIM_REQUEST:
        return state.merge({
            claimingDevice: true,
            claimingDeviceFailure: null,
        });

    case types.DEVICE_CLAIM_SUCCESS:
        return state.merge({
            claimingDevice: false,
            claimingDeviceFailure: null,
            devices: action.devices,
        });

    case types.DEVICE_CLAIM_FAILURE:
        return state.merge({
            claimingDevice: false,
            claimingDeviceFailure: action.message,
        });

    /**
     * GET CREW EVENT TIMELINE
     */
    case types.GET_FLARE_TIMELINE_REQUEST:
        return state.merge({
            crewEventTimelineState: 'requested',
        });

    case types.GET_FLARE_TIMELINE_SUCCESS:
        return state.merge({
            crewEventTimelineState: 'succeeded',
            crewEventTimeline: action.data.actions,
        });

    case types.GET_FLARE_TIMELINE_FAILURE:
        return state.merge({
            crewEventTimelineState: 'failed',
        });

    default:
        return state;
    }
}
