import BackgroundTimer from 'react-native-background-timer';
import moment from 'moment';

export default class BeaconCache {
    constructor() {
        this.beaconCache = {
            Short: {},
            Long: {},
            Checkin: {},
        };

        this.durationInMinutes = 30;
        this.pruneFrequencyInMilliseconds = 300000; // 5000ms/min * 60 s/min;
        this.backgroundTimer = BackgroundTimer.setInterval(() => {
            this.prune();
        }, this.pruneFrequencyInMilliseconds);
    }

    hasAlreadyHandled(beacon) {
        const {
            type,
            deviceID,
            timestamp,
            nonce,
        } = beacon;

        let handled = false;
        const safeNonce = typeof nonce !== 'undefined' ? nonce : 'x';
        const lastTimestampForNonce = this.beaconCache[type] &&
            this.beaconCache[type][deviceID] &&
            this.beaconCache[type][deviceID][safeNonce];

        // Putting nonce under the deviceID lets us compare timestamps across hour/day boundaries.
        // We consider beacons to be the same if they have the same nonce and were received within
        // 10 seconds of each other.
        if (lastTimestampForNonce) {
            handled = Math.abs(moment(lastTimestampForNonce).diff(timestamp)) < 10000;
            if (deviceID === 7) {
                console.debug(`XXXX>>> Handled: ${handled} for type ${type} device ${deviceID} nonce ${safeNonce}. Old time ${lastTimestampForNonce} new time ${timestamp}`);
            }
        } else if (deviceID === 7) {
            console.debug(`XXXX>>> Not handled; no timestamp to compare ${type} ${safeNonce}`);
        }

        return handled;
    }

    markAsHandled(beacon) {
        const {
            type,
            deviceID,
            timestamp,
            nonce,
        } = beacon;

        if (!this.beaconCache[type]) {
            this.beaconCache[type] = {};
        }

        if (!this.beaconCache[type][deviceID]) {
            this.beaconCache[type][deviceID] = {};
        }

        const safeNonce = typeof nonce !== 'undefined' ? nonce : 'x';
        if (!this.beaconCache[type][deviceID][safeNonce]) {
            this.beaconCache[type][deviceID][safeNonce] = null;
        }

        this.beaconCache[type][deviceID][safeNonce] = timestamp;
    }

    prune() {
        const maxAge = moment().subtract(this.durationInMinutes + 5, 'minutes').unix();
        Object.keys(this.beaconCache).forEach((beaconType) => {
            Object.keys(this.beaconCache[beaconType]).forEach((deviceID) => {
                const pruned =
                    Object.keys(this.beaconCache[beaconType][deviceID])
                        .filter(key => key > maxAge);
                this.beaconCache[beaconType][deviceID] = pruned;
            });
        });

    }

}
