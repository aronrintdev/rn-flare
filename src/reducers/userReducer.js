import Immutable from 'seamless-immutable';
import * as types from '../actions/actionTypes';
import { initialState } from './initialState';
import { filterContacts } from '../helpers/contacts';

function getContactsCrewLookup(crew) {
    const memberKeys = crew.members.map(member => member.key);
    const contactsCrewLookup = {};
    memberKeys.forEach(key => {
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
                authToken: null,
                authState: 'failed',
            });
        case types.AUTH_REQUEST:
            return state.merge({
                authToken: null,
                authState: 'requested',
            });
        case types.AUTH_SUCCESS: {
            const firstCrew =
                action.data &&
                action.data &&
                action.data.crews &&
                action.data.crews.length
                    ? action.data.crews[0]
                    : { id: 0, members: [] };

            return state.merge({
                analyticsToken: action.data.analytics_token,
                authToken: action.data.auth_token,
                radioToken: action.data.radio_token,
                profile: action.data.profile,
                crews: action.data.crews,
                crewEvents: action.data.crew_events,
                hasActiveFlare:
                    action.data.crew_events &&
                    action.data.crew_events.length > 0,
                devices: action.data.devices,
                authState: 'succeeded',
                role: action.data.role,
                hasViewedTutorial: !!action.data.viewed_tutorial,
                contactsCrewLookup: getContactsCrewLookup(firstCrew),
            });
        }
        case types.AUTH_RESET:
            return state.merge({
                authToken: null,
                callScript: null,
                profile: null,
                crews: [],
                role: null,
                contactsCrewLookup: null,
                authState: null,
            });

        /**
         * ACCOUNT STATUS
         * We check account status on app launch after users authenticate. The intent
         * is to keep all devices in sync with each other.
         */
        case types.ACCOUNT_DETAILS_SUCCESS:
            return state.replace(
                state,
                {
                    crewEvents: action.data.crew_events,
                    crews: action.data.crews,
                    devices: action.data.devices,
                    hasActiveFlare:
                        action.data.crew_events &&
                        action.data.crew_events.length > 0,
                    profile: action.data.profile,
                },
                {
                    deep: true,
                }
            );

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
                hasActiveFlare: true,
                crewEvents: action.data.crewEvents,
                crewEventTimeline: [],
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
                hasActiveFlare: false,
                cancelingActiveFlare: false,
                cancelActiveFlareState: 'success',
                crewEventTimeline: [],
            });

        case types.CANCEL_ACTIVE_FLARE_FAILURE:
            return state.merge({
                cancelingActiveFlare: false,
                cancelActiveFlareState: 'failure',
            });

        case types.CANCEL_ACTIVE_FLARE_RESET:
            return state.merge({
                cancelingActiveFlare: false,
                cancelActiveFlareState: null,
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
            const grantUpdate = Immutable.setIn(
                state.permissions,
                [action.permission],
                action.granted
            );
            const updatedPermissions = Immutable.setIn(
                grantUpdate,
                [`${action.permission}Prompted`],
                true
            );
            return state.merge({
                permissions: updatedPermissions,
                requestingPermissions: false,
                requestingPermissionsFailed: false,
            });
        }

        /**
         * USER REGISTRATION
         */
        case types.REGISTER_USER_REQUEST:
            return state.merge({
                registrationState: 'requested',
            });
        case types.REGISTER_USER_FAILURE:
            return state.merge({
                registrationState: 'failed',
            });
        case types.REGISTER_USER_SUCCESS:
            return state.merge({
                registrationState: 'succeeded',
                analyticsToken: action.data.analytics_token,
                authToken: action.data.auth_token,
                radioToken: action.data.radio_token,
                devices: action.data.devices,
            });

        /**
         * SET USER DETAILS
         */
        case types.SET_USER_DETAILS_REQUEST:
            return state.merge({
                settingDetailsState: 'requested',
            });
        case types.SET_USER_DETAILS_FAILURE:
            return state.merge({
                settingDetailsState: 'failed',
            });
        case types.SET_USER_DETAILS_SUCCESS:
            return state.merge({
                settingDetailsState: 'succeeded',
                completedRegistration: true,
            });

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
                claimedDevice: action.claimedDevice,
                claimingDevice: false,
                claimingDeviceFailure: null,
                devices: action.devices,
            });

        case types.DEVICE_CLAIM_FAILURE:
            return state.merge({
                claimingDevice: false,
                claimedDevice: null,
                claimingDeviceFailure: action.status,
            });

        case types.DEVICE_DISCLAIM_REQUEST:
            return state.merge({
                disclaimingDevice: true,
            });

        case types.DEVICE_DISCLAIM_SUCCESS: {
            const newState = state.merge({
                disclaimingDevice: false,
                devices: action.devices,
            });

            return newState;
        }

        case types.DEVICE_DISCLAIM_FAILURE:
            return state.merge({
                disclaimingDevice: false,
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

        /**
         * SET NOTIFICATION MESSAGE
         */
        case types.SETTINGS_SET_POPUP_MESSAGE_REQUEST: {
            Immutable.setIn(state.settings, ['saving'], true);
            return state;
        }

        case types.SETTINGS_SET_POPUP_MESSAGE_SUCCESS: {
            const updated = state.settings.merge({
                saving: false,
                promptMessage: action.data.notification.message,
                promptType: action.custom,
            });
            return state.merge({
                settings: updated,
            });
        }

        case types.SETTINGS_SET_POPUP_MESSAGE_FAILURE: {
            const updatedSettings = Immutable.setIn(
                state.settings,
                ['saving'],
                false
            );
            return state.merge({
                settings: updatedSettings,
            });
        }

        /**
         * SET USER PIN
         */
        case types.USER_SET_PIN_REQUEST:
            return state.merge({
                updatingPIN: true,
                updatedPIN: false,
            });

        case types.USER_SET_PIN_SUCCESS:
            return state.merge({
                updatingPIN: false,
                updatedPIN: true,
            });

        case types.USER_SET_PIN_FAILURE:
            return state.merge({
                updatingPIN: false,
                updatedPIN: false,
                pinUpdateError: action.error,
            });

        /**
         * SET USER ONBOARDING COMPLETE
         */
        case types.USER_SET_ONBOARDING_COMPLETE_REQUEST:
            return state.merge({
                settingOnboardingComplete: true,
            });

        case types.USER_SET_ONBOARDING_COMPLETE_SUCCESS:
            return state.merge({
                settingOnboardingComplete: false,
                hasViewedTutorial: true,
            });

        case types.USER_SET_ONBOARDING_COMPLETE_FAILURE:
            return state.merge({
                settingOnboardingComplete: false,
            });

        /**
         * SET USER PRIVACY CONFIG
         */
        case types.USER_SET_PRIVACY_CONFIG_REQUEST:
            return state.merge({
                savingSetting: true,
            });

        case types.USER_SET_PRIVACY_CONFIG_SUCCESS:
            return state.merge({
                savingSetting: false,
                settings: Immutable.setIn(
                    state.settings,
                    ['analyticsEnabled'],
                    action.analyticsEnabled
                ),
            });

        case types.USER_SET_PRIVACY_CONFIG_FAILURE:
            return state.merge({
                savingSetting: false,
            });

        case types.USER_SET_CALL_SCRIPT_REQUEST:
            return state.merge({
                savingSetting: true,
            });

        case types.USER_SET_CALL_SCRIPT_SUCCESS:
            return state.merge({
                savingSetting: false,
                callScript: action.script,
            });

        case types.USER_SET_CALL_SCRIPT_FAILURE:
            return state.merge({
                savingSetting: false,
            });

        case types.USER_REG_START:
            return state.set('reg', initialState.user.reg);
        case types.USER_REG_SET_NAME:
            return state.setIn(['reg', 'name'], action.value);
        case types.USER_REG_SET_EMAIL:
            return state.setIn(['reg', 'email'], action.value);
        case types.USER_REG_SET_PHONE:
            return state.setIn(['reg', 'phone'], action.value);
        case types.USER_REG_SET_PASSWORD:
            return state.setIn(['reg', 'password'], action.value);
        case types.USER_REG_SET_PAIRING:
            return state.setIn(['reg', 'preferredPairing'], action.value);

        default:
            return state;
    }
}
