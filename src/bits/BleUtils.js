/* global __DEV__ */
import { BeaconTypes } from './BleConstants';

/**
 * JavaScript bit handling is weak. We treat the major bits that the firmware sent as a string.
 * This leads to a bunch of string comparisons and manipulations that will probably offend
 * competent firmware developers.
 */
class BleUtils {
    static getDeviceVersionAndBeaconType(majorBits) {
        const typeBits = majorBits.substring(0, 8);
        const typeNumber = parseInt(typeBits, 2);
        const versionRangeSize = 10;
        const deviceVersion = (typeNumber + (versionRangeSize - (typeNumber % versionRangeSize))) / versionRangeSize;
        const beaconTypeNumber = typeNumber % versionRangeSize;
        const beaconType = Object.keys(BeaconTypes).find(type => BeaconTypes[type].value === beaconTypeNumber);
        return {
            deviceVersion,
            beaconType,
        };
    }

    static getDeviceID(majorBits, minorBits, deviceVersion) {
        // Legacy firmware used single byte for device ID
        if (deviceVersion === 1) {
            const bits = majorBits.substring(8);
            const deviceID = parseInt(bits, 2);
            return deviceID;
        }

        const numberOfBitsToPrepend = 16 - minorBits.length;
        const paddedMinorBits = `${'0'.repeat(numberOfBitsToPrepend)}${minorBits}`;
        const bits = majorBits.substring(8) + paddedMinorBits;
        const deviceID = parseInt(bits, 2);
        return deviceID;
    }

    static getNonceFromMinorBits(minorBits) {
        const nonceBits = minorBits.substring(0, 8);
        const nonce = parseInt(nonceBits, 2);
        return nonce;
    }

    /**
     * Extract the device version, beacon type and device ID from the beacon payload.
     *
     *   1. convert major bytes to bits, padded if necessary
     *   2. convert minor bytes to bits, padded if necessary
     *   3. calculate device version and beacon type from major
     *       3a. type is first byte of major mod version range size
     *       3b. device version =
     *           (type + (versionRangeSize - (type % versionRangeSize))) / versionRangeSize;
     *   4. calculate device ID from major, minor, device version
     *       4a. concatenate first byte of major with 2 bytes of minor
     *       4b. device id = convert concatenated number to decimal
     *
     * @param {*} beacon
     */
    static parseBeacon(beacon) {
        const {
            uuid, major, minor, rssi, proximity, accuracy,
        } = beacon;

        const majorBitsUnpadded = major.toString(2);
        const numberOfBitsToPrepend = 16 - majorBitsUnpadded.length;
        const majorBits = `${'0'.repeat(numberOfBitsToPrepend)}${majorBitsUnpadded}`;
        const minorBits = minor.toString(2);
        const { deviceVersion, beaconType } = BleUtils.getDeviceVersionAndBeaconType(majorBits);
        const deviceID = BleUtils.getDeviceID(majorBits, minorBits, deviceVersion);
        const nonce = deviceVersion === 1 ? BleUtils.getNonceFromMinorBits(minorBits) : null;

        const parsedBeacon = {
            uuid,
            nonce,
            type: beaconType,
            deviceID,
            deviceVersion,
            rssi,
            proximity,
            accuracy,
            timestamp: Date.now(),
        };

        return parsedBeacon;
    }
}

export default BleUtils;
