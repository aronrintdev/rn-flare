import React from 'react';
import { DeviceEventEmitter } from 'react-native';
import Beacons from 'react-native-beacons-manager';
import BleConstants from './BleConstants';

export default class BleManager {

    constructor() {
        this.beaconsDidRange = null;
        this.regionDidEnterEvent = null;
    }

    static startListening(options) {
        console.log('started listening iOS');

        // Tells the library to detect iBeacons
        Beacons.requestWhenInUseAuthorization();

        Beacons.startMonitoringForRegion(BleConstants.region);
        Beacons.startRangingBeaconsInRegion(BleConstants.region);

        Beacons.startUpdatingLocation();

        // Listen for beacon changes
        this.beaconsDidRange = DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
            // data.region - The current region
            // data.region.identifier
            // data.region.uuid

            // data.beacons - Array of all beacons inside a region
            //  in the following structure:
            //    .uuid
            //    .major - The major version of a beacon
            //    .minor - The minor version of a beacon
            //    .rssi - Signal strength: RSSI value (between -100 and 0)
            //    .proximity - Proximity value, can either be "unknown", "far", "near" or "immediate"
            //    .accuracy - The accuracy of a beacon
            const numBeacons = data.beacons.length;
            if (numBeacons > 0) {
                const lastBeacon = data.beacons[numBeacons - 1];
                const uuid = lastBeacon.uuid.substring(0, 7);
                const { proximity, accuracy } = lastBeacon;
                // this.setState({
                //     lastDevice: 'Detected beacon: ' + uuid + ', proximity: ' + proximity + ', accuracy: ' + accuracy
                // });
                if (options && options.onBeaconDetected) {
                    options.onBeaconDetected({
                        uuid,
                        proximity,
                        accuracy,
                    });
                }
            }
        });

        this.regionDidEnterEvent = DeviceEventEmitter.addListener(
            'regionDidEnter',
            (data) => {
                console.log('monitoring - regionDidEnter data: ', data);
            },
        );
    }
}
