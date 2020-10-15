/* global __DEV__ */
import RNConfigReader from 'react-native-config-reader';
/**
 * Identify the back end to communicate with:
 */
export const API_URL = `${RNConfigReader.ApiUrl}api`;
export const API_RESET_URL = `${RNConfigReader.ApiUrl}reset`;
export const CONFIG_DEV = RNConfigReader.isDevVersion === 'true' || __DEV__;

/**
 * Toggle logging of BLE beacons:
 * enabled -- report parsed Flare beacons in logs
 + verbose -- report all/unparsed beacons in logs
 + not-enabled (or anything else really) -- no BLE logging at all
 */
export const BLUETOOTH_BEACON_LOGGING = CONFIG_DEV ? 'enabled' : 'not-enabled';

/**
 * URL to bring users to ambassador signup page
 */
export const AMBASSADOR_SIGNUP_URL =
    'https://flare-jewelry.breezy.hr/p/cb160cabd112-brand-ambassador';

/**
 * Toggle showing all beacons (regardless of user) on the home screen
 * true -- show all beacons
 * false -- show only beacons relevant to the current user
 */
export const SHOW_ALL_BEACONS_IN_HOME_SCREEN = true;

/**
 * Toggle logging of redux changes
 */
export const REDUX_LOGGING = false;

/**
 * Interval in ms for syncing account details with server.
 * Default is 300000 (5 mins).
 */
export const ACCOUNT_SYNC_INTERVAL = 300000; // 5 minutes
// export const ACCOUNT_SYNC_INTERVAL = 60000; // 1 minute

/**
 * Interval in ms for syncing account details with server during development.
 */
export const ACCOUNT_SYNC_INTERVAL_DEV = 300000; // 5 minutes
// export const ACCOUNT_SYNC_INTERVAL_DEV = 60000; // 1 minute

/**
 * Interval in ms for syncing account details with server during active flare event (911 or Crew)
 */
export const ACCOUNT_SYNC_INTERVAL_FLARE = 12000; // 12 seconds

/**
 * Interval in ms for refreshing active flare timeline
 */
export const FLARE_TIMELINE_REFRESH_INTERVAL = 10000;

/**
 * The interval at which we remove cached beacons.
 */
export const BEACON_CACHE_PRUNE_INTERVAL_IN_MS = 90000;

/**
 * The minimum amount of time between beacons to consider them as distinct.
 * This needs to be longer than the transmit duration set in the cuff firmware.
 * As of writing (12/3/2018), the longest transmit duration is 8000 ms.
 */
export const UNIQUE_BEACON_TIMING_IN_MS = 36000;

/**
 * The max age of beacons to retain during cache pruning.
 */
export const BEACON_CACHE_MAX_AGE_IN_MINS = 25;

/**
 * The length of the device ID we print on our jewelry.
 */
export const DEVICE_ID_LABEL_LENGTH = 6;

/**
 * The length of the second factor that we print on our jewelry next to the device ID. It's used to ensure that
 * only the person holding the jewelry can add it to her account.
 */
export const DEVICE_TWO_FACTOR_LABEL_LENGTH = 3;

/**
 * The largest allowed device ID.
 */
export const MAX_DEVICE_ID = 16777216;

/**
 * Max time in which to observe three button presses for device addtiion
 */
export const DEVICE_ADDITION_THREE_PRESS_MAX_TIME = 5000;

/**
 * Minimum number of times users press button to add device
 */
export const DEVICE_ADDITION_MIN_PRESS_COUNT = 3;

/**
 * Control whether the app supports manufacturing mode
 */
export const MANUFACTURING_MODE_ENABLED = false;

/**
 * Left navigation width
 */
export const LEFT_NAVIGATION_WIDTH = 300;

/**
 * Toggle visibility of Add New Jewelry feature
 */
export const USERS_CAN_ADD_JEWELRY = true;

/**
 * Toggle logging of network calls
 */
export const VERBOSE_NETWORK_LOGGING = CONFIG_DEV;

/**
 * Time after which a second beacon press will not be considered identical
 * to the first
 */
export const BEACON_DEBOUNCE_TIME = 30000;

/**
 * Summary object from legacy implementation used to present
 * customer service data in UI.
 */
export const summary = [
    { key: 'API', value: API_URL },
    { key: 'Logging / Redux', value: REDUX_LOGGING.toString() },
    { key: 'Logging / BLE', value: BLUETOOTH_BEACON_LOGGING.toString() },
    { key: 'Account Sync', value: ACCOUNT_SYNC_INTERVAL },
];

/**
 * Minimum height of a non-squashed screen
 */
export const MIN_NON_SQUASHED_HEIGHT = 650;
