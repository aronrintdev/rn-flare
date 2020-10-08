/* eslint-disable no-console */

import {
    check,
    checkNotifications,
    request,
    requestNotifications,
    PERMISSIONS,
    RESULTS,
} from 'react-native-permissions';

import * as types from './actionTypes';
import { API_URL } from '../constants/Config';
import ProtectedAPICall from '../bits/ProtectedAPICall';
import { getContactsOrder } from '../bits/settingsUrl';
import { getAllContacts } from '../helpers/contacts';
import { cacheCallSounds } from '../helpers/callScripts';

export const resetSetCrewMembers = () => ({ type: types.CREW_SET_RESET });

export const setCrewMembers = (token, crewId, members) => async dispatch => {
    dispatch({
        type: types.CREW_SET_REQUEST,
    });
    try {
        const response = await ProtectedAPICall(
            token,
            API_URL,
            `/crews/${crewId}`,
            {
                method: 'POST',
                data: {
                    members,
                },
            }
        );
        dispatch({
            type: types.CREW_SET_SUCCESS,
            crew: response.data.data.crew,
        });
    } catch (error) {
        console.warn(error);
        dispatch({
            type: types.CREW_SET_FAILURE,
            error,
        });
    }
};

export const checkLocationsPermission = () => async dispatch => {
    const response = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
    dispatch({
        type: types.PERMISSIONS_SUCCESS,
        permission: 'location',
        granted: response === RESULTS.GRANTED,
    });
};

export function syncAccountDetails(args) {
    return function startSyncingAccountDetails(dispatch) {
        dispatch({
            type: types.ACCOUNT_DETAILS_REQUEST,
        });

        const status = { args };
        const requestOptions = {
            method: 'POST',
        };
        if (status) {
            requestOptions.data = {
                status: args.status,
            };
        }

        ProtectedAPICall(
            args.analyticsToken,
            API_URL,
            '/auth/status',
            requestOptions
        )
            .then(response => {
                dispatch({
                    type: types.ACCOUNT_DETAILS_SUCCESS,
                    data: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: types.ACCOUNT_DETAILS_FAILURE,
                    status: error,
                });
            });
    };
}

export const fetchContacts = () => async dispatch => {
    dispatch({
        type: types.CONTACTS_REQUEST,
    });
    try {
        const [contacts, sortOrder] = await Promise.all([
            getAllContacts(),
            getContactsOrder(),
        ]);
        dispatch({
            type: types.CONTACTS_SUCCESS,
            contacts,
            sortOrder,
        });
    } catch (error) {
        dispatch({ type: types.CONTACTS_FAILURE, error });
    }
};

export function getEventTimeline(token) {
    return function getTimeline(dispatch) {
        dispatch({
            type: types.GET_FLARE_TIMELINE_REQUEST,
        });
        ProtectedAPICall(token, API_URL, '/crews/event', {
            method: 'GET',
        })
            .then(response => {
                dispatch({
                    type: types.GET_FLARE_TIMELINE_SUCCESS,
                    data: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: types.GET_FLARE_TIMELINE_FAILURE,
                    error,
                });
            });
    };
}

// eslint-disable-next-line camelcase
export const DEPRECATED_getNotificationsPermission = async dispatch => {
    const { status } = await checkNotifications();
    if (status === RESULTS.GRANTED) {
        dispatch({
            type: types.PERMISSIONS_SUCCESS,
            permission: 'notification',
            granted: true,
        });
    } else {
        const finalResult = await requestNotifications([
            'alert',
            'badge',
            'sound',
            'lockScreen',
        ]);
        dispatch({
            type: types.PERMISSIONS_SUCCESS,
            permission: 'notification',
            granted: finalResult === RESULTS.GRANTED,
        });
    }
};

export const checkNotificationPermission = () => async dispatch => {
    const { status } = await checkNotifications();
    dispatch({
        type: types.PERMISSIONS_SUCCESS,
        permission: 'notification',
        granted: status === RESULTS.GRANTED,
    });
};

export const getNotificationPermission = () => async dispatch => {
    const result = await requestNotifications([
        'alert',
        'badge',
        'sound',
        'lockScreen',
    ]);
    dispatch({
        type: types.PERMISSIONS_SUCCESS,
        permission: 'notification',
        granted: result.status === RESULTS.GRANTED,
    });
};

export const getPermission = name => {
    const friendlyNames = {
        'ios.permission.CONTACTS': 'contacts',
        'ios.permission.LOCATION_ALWAYS': 'location',
    };

    return async dispatch => {
        const checkResponse = await check(name);
        dispatch({
            type: types.PERMISSIONS_REQUEST,
            name,
        });
        if (checkResponse === RESULTS.GRANTED) {
            dispatch({
                type: types.PERMISSIONS_SUCCESS,
                permission: friendlyNames[name],
                granted: true,
            });
        } else {
            await request(name);
            const finalResponse = await check(name);
            dispatch({
                type: types.PERMISSIONS_SUCCESS,
                permission: friendlyNames[name],
                granted: finalResponse === RESULTS.GRANTED,
            });
        }
    };
};

export function setNotificationMessage(token, message, custom) {
    return function setMessage(dispatch) {
        dispatch({
            type: types.SETTINGS_SET_POPUP_MESSAGE_REQUEST,
        });
        ProtectedAPICall(token, API_URL, '/users/notification', {
            method: 'POST',
            data: {
                message,
            },
        })
            .then(response => {
                dispatch({
                    type: types.SETTINGS_SET_POPUP_MESSAGE_SUCCESS,
                    data: response.data.data,
                    custom,
                });
            })
            .catch(error => {
                dispatch({
                    type: types.SETTINGS_SET_POPUP_MESSAGE_FAILURE,
                    error,
                });
            });
    };
}

export const setNotificationsEnabled = value => ({
    type: types.USER_SET_NOTIFICATIONS_ENABLED,
    value,
});

export function setCancelPIN(token, pin) {
    return function setPin(dispatch) {
        dispatch({
            type: types.USER_SET_PIN_REQUEST,
        });
        ProtectedAPICall(token, API_URL, '/users/pin', {
            method: 'PUT',
            data: {
                pin,
            },
        })
            .then(() => {
                dispatch({
                    type: types.USER_SET_PIN_SUCCESS,
                });
            })
            .catch(error => {
                dispatch({
                    type: types.USER_SET_PIN_FAILURE,
                    error,
                });
            });
    };
}

export const resetOnboardingComplete = () => ({
    type: types.USER_SET_ONBOARDING_COMPLETE_RESET,
});

export const setOnboardingComplete = token => async dispatch => {
    dispatch({
        type: types.USER_SET_ONBOARDING_COMPLETE_REQUEST,
    });
    try {
        await ProtectedAPICall(token, API_URL, '/users/onboarding/complete', {
            method: 'PUT',
        });
        dispatch({
            type: types.USER_SET_ONBOARDING_COMPLETE_SUCCESS,
        });
    } catch (error) {
        dispatch({
            type: types.USER_SET_ONBOARDING_COMPLETE_FAILURE,
            error,
        });
    }
};

export function setUserDetails(token, firstName, lastName, password) {
    return async function doSetDetails(dispatch) {
        dispatch({
            type: types.SET_USER_DETAILS_REQUEST,
        });
        ProtectedAPICall(token, API_URL, '/auth/register/details', {
            method: 'PUT',
            data: {
                first: firstName,
                last: lastName,
                password,
            },
        })
            .then(() => {
                dispatch({
                    type: types.SET_USER_DETAILS_SUCCESS,
                });
            })
            .catch(error => {
                dispatch({
                    type: types.SET_USER_DETAILS_FAILURE,
                    error,
                });
            });
    };
}

export function setPrivacyConfig(token, config) {
    return function doSetPrivacyConfig(dispatch) {
        dispatch({
            type: types.USER_SET_PRIVACY_CONFIG_REQUEST,
        });
        const { analytics } = config;
        ProtectedAPICall(token, API_URL, '/users/privacy', {
            method: 'POST',
            data: {
                analytics,
            },
        })
            .then(response => {
                dispatch({
                    type: types.USER_SET_PRIVACY_CONFIG_SUCCESS,
                    analyticsEnabled: response.data.privacy.analytics,
                });
            })
            .catch(error => {
                dispatch({
                    type: types.USER_SET_PRIVACY_CONFIG_FAILURE,
                    error,
                });
            });
    };
}

export function setCallScript(token, script) {
    return function setEnabled(dispatch) {
        dispatch({
            type: types.USER_SET_CALL_SCRIPT_REQUEST,
        });
        ProtectedAPICall(token, API_URL, '/users/call/script', {
            method: 'POST',
            data: {
                script,
            },
        })
            .then(response => {
                dispatch({
                    type: types.USER_SET_CALL_SCRIPT_SUCCESS,
                    script: response.data.script,
                });
            })
            .catch(error => {
                dispatch({
                    type: types.USER_SET_CALL_SCRIPT_FAILURE,
                    error,
                });
            });
    };
}

export const getCallScripts = token => async dispatch => {
    dispatch({ type: types.USER_GET_CALL_SCRIPTS_REQUEST });
    try {
        const { data } = await ProtectedAPICall(
            token,
            API_URL,
            '/call/scripts',
            {
                method: 'GET',
            }
        );
        dispatch({ type: types.USER_GET_CALL_SCRIPTS_SUCCESS, data });
        cacheCallSounds(data.data);
    } catch (error) {
        console.debug(`Failed to Download call scripts ${error}`);
        dispatch({ type: types.USER_GET_CALL_SCRIPTS_FAILURE, error });
    }
};

export const sawCallScripts = () => ({ type: types.USER_SAW_CALL_SCRIPTS });

export const sawNotifSettings = () => ({ type: types.USER_SAW_NOTIF_SETTINGS });

export const textFriendsReset = () => ({ type: types.USER_TEXT_FRIENDS_RESET });
export const textFriendsRequest = () => ({
    type: types.USER_TEXT_FRIENDS_REQUEST,
});
export const textFriendsResponse = response => ({
    type: types.USER_TEXT_FRIENDS_RESPONSE,
    response,
});

export const hideFlareServiceErrorAlert = () => ({
    type: types.HIDE_FLARE_SERVICE_FAILURE_ALERT,
});

export function set911Features(token, userId) {
    return function setEnabled(dispatch) {
        dispatch({
            type: types.USER_SET_911_FEATURE_REQUEST,
        });
        ProtectedAPICall(token, API_URL, `/config/user/${userId}/toggle_ems`, {
            method: 'POST',
        })
            .then(response => {
                dispatch({
                    type: types.USER_SET_911_FEATURE_SUCCESS,
                    ems_services: response.data.ems_services,
                });
            })
            .catch(error => {
                dispatch({
                    type: types.USER_SET_911_FEATURE_FAILURE,
                    error,
                });
            });
    };
}

export function setCrewEnabled(token, userId) {
    return function setEnabled(dispatch) {
        dispatch({
            type: types.USER_SET_CREW_ENABLE_REQUEST,
        });
        return ProtectedAPICall(
            token,
            API_URL,
            `/config/user/${userId}/toggle_crew`,
            {
                method: 'POST',
            }
        )
            .then(response => {
                if (response.data && typeof response.data === 'object') {
                    dispatch({
                        type: types.USER_SET_CREW_ENABLE_SUCCESS,
                        crew_services: response.data.crew_services,
                    });
                    return response.data.crew_services;
                }
                throw new Error('Toggle Crew API Response is invalid');
            })
            .catch(error => {
                dispatch({
                    type: types.USER_SET_CREW_ENABLE_FAILURE,
                    error,
                });
            });
    };
}

export function fetchSettings(token, userId) {
    return function setEnabled(dispatch) {
        dispatch({
            type: types.USER_SET_SETTINGS_REQUEST,
        });
        ProtectedAPICall(token, API_URL, `/config/user/${userId}/settings`, {
            method: 'GET',
        })
            .then(response => {
                dispatch({
                    type: types.USER_SET_SETTINGS_SUCCESS,
                    data: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: types.USER_SET_SETTINGS_FAILURE,
                    error,
                });
            });
    };
}

export const hideUserSettingsError = () => ({
    type: types.HIDE_USER_SETTINGS_ERROR,
});
