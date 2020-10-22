import Immutable from 'seamless-immutable';
import moment from 'moment';

import { API_URL } from '../constants/Config';
import * as types from './actionTypes';
import ProtectedAPICall from '../bits/ProtectedAPICall';
import { BeaconTypes } from '../bits/BleConstants';

export const call = ({
    token,
    beacon,
    position,
    forCurrentUser,
    noop,
}) => async dispatch => {
    try {
        await ProtectedAPICall(token, API_URL, '/radio/beacon', {
            method: 'POST',
            data: {
                device_id: beacon.deviceID,
                type: BeaconTypes.Short.value,
                nonce: beacon.nonce,
                timestamp: moment(beacon.timestamp).toISOString(),
                position,
                'no-op': noop,
            },
        });
        if (forCurrentUser) {
            dispatch({
                type: types.BEACON_SHORT_PRESS,
                beacon,
                position,
            });
        }
    } catch (status) {
        if (forCurrentUser) {
            dispatch({
                type: types.BEACON_HANDLING_FAILED,
                beacon,
                position,
                status,
            });
        }
    }
};

export const flare = ({
    token,
    beacon,
    position,
    forCurrentUser,
    noop,
}) => dispatch => {
    const real = forCurrentUser && typeof noop !== 'string';
    if (real) {
        dispatch({
            type: types.BEACON_LONG_PRESS,
        });
        dispatch({
            type: types.ACTIVATE_FLARE_REQUEST,
        });
    }
    return ProtectedAPICall(token, API_URL, '/radio/beacon', {
        method: 'POST',
        data: {
            device_id: beacon.deviceID,
            type: BeaconTypes.Long.value,
            nonce: beacon.nonce,
            timestamp: moment(beacon.timestamp).toISOString(),
            position,
            'no-op': noop,
        },
    })
        .then(response => {
            if (real) {
                dispatch({
                    type: types.ACTIVATE_FLARE_SUCCESS,
                    data: {
                        beacon,
                        position,
                        crewEvents: response.data.crew_events,
                    },
                });
            }
        })
        .catch(status => {
            if (real) {
                dispatch({
                    type: types.ACTIVATE_FLARE_FAILURE,
                    data: {
                        beacon,
                        position,
                        status,
                    },
                });
                dispatch({
                    type: types.BEACON_HANDLING_FAILED,
                    beacon,
                    position,
                    status,
                });
            }
        });
};

export const cancelActiveFlare = token => dispatch => {
    dispatch({
        type: types.CANCEL_ACTIVE_FLARE_REQUEST,
    });
    ProtectedAPICall(token, API_URL, '/crews/event/cancel', {
        method: 'POST',
        data: {},
    })
        .then(response => {
            dispatch({
                type: types.CANCEL_ACTIVE_FLARE_SUCCESS,
                data: {
                    crewEvents: response.crew_events || [],
                },
            });
        })
        .catch(status => {
            dispatch({
                type: types.CANCEL_ACTIVE_FLARE_FAILURE,
                status,
            });
        });
};

export function resetCancelFlareState() {
    return dispatch =>
        dispatch({
            type: types.CANCEL_ACTIVE_FLARE_RESET,
        });
}

export function checkin(token, beacon, position, forCurrentUser) {
    return async function doCheckin(dispatch) {
        ProtectedAPICall(token, API_URL, '/radio/beacon', {
            method: 'POST',
            data: {
                device_id: beacon.deviceID,
                timestamp: moment(beacon.timestamp).toISOString(),
                type: BeaconTypes.Checkin.value,
                position,
                details: {
                    proximity: beacon.proximity,
                    distance: beacon.distance,
                    rssi: beacon.rssi,
                    major: beacon.major,
                    minor: beacon.minor,
                    uuid: beacon.uuid,
                },
            },
        })
            .then(() => {
                if (forCurrentUser) {
                    dispatch({
                        type: types.BEACON_CHECKIN,
                        beacon,
                    });
                }
            })
            .catch(status => {
                if (forCurrentUser) {
                    dispatch({
                        type: types.BEACON_HANDLING_FAILED,
                        beacon,
                        position,
                        status,
                    });
                }
            });
    };
}

export function manufacturingCheckin(token, beacon, position, stage) {
    return async function doCheckin(dispatch) {
        dispatch({
            type: types.MANUFACTURING_BEACON_REQUEST,
        });
        ProtectedAPICall(token, API_URL, '/manufacturing/checkin', {
            method: 'POST',
            data: {
                device_id: beacon.deviceID,
                timestamp: moment(beacon.timestamp).toISOString(),
                position,
                details: {
                    proximity: beacon.proximity,
                    distance: beacon.distance,
                    rssi: beacon.rssi,
                    major: beacon.major,
                    minor: beacon.minor,
                    uuid: beacon.uuid,
                },
                stage,
            },
        })
            .then(response => {
                dispatch({
                    type: types.MANUFACTURING_BEACON_SUCCESS,
                    beacon,
                    latestDeviceUpdate: response.data.manufacturing_event,
                });
            })
            .catch(status => {
                dispatch({
                    type: types.MANUFACTURING_BEACON_FAILURE,
                    beacon,
                    status,
                });
            });
    };
}

/**
 * Attempt to recover tokens that we tried and failed to submit in the past. For example, let's say that a user has
 * a spotty network connection. They might receive a beacon just when the network is unavailable. When that happens,
 * we keep a copy of the beacon and position data in the redux store. At some point, we call this method to try again.
 *
 * @param {func} handleBeacon method to call for each beacon that we tried and failed to submit
 * @param {*} token auth token
 * @param {Array} problemBeacons list of beacons that we tried and failed to submit before
 */
export function processQueuedBeacons(handleBeacon, token, problemBeacons) {
    return async function doProcessQueuedBeacons(dispatch) {
        const beaconsToClear = [];
        problemBeacons.forEach(problem => {
            // increment the retry counter
            let retry = Immutable.getIn(problem.beacon, ['retry']);
            if (typeof retry === 'undefined') {
                retry = 1;
            } else {
                retry += 1;
            }
            const updatedBeacon = Immutable.setIn(
                problem.beacon,
                ['retry'],
                retry
            );

            // resubmit the beacon with the incremented retry counter
            handleBeacon(dispatch, token, updatedBeacon, problem.position);

            // clear any beacons with the same uuid and timestamp but older retry numbers
            beaconsToClear.push({
                uuid: updatedBeacon.uuid,
                timestamp: updatedBeacon.timestamp,
                retry: retry - 1,
            });
        });

        dispatch({
            type: types.CLEAR_PROBLEM_BEACONS,
            beaconsToClear,
        });
    };
}
