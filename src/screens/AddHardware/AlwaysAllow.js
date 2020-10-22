import * as React from 'react';
import { Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import PermissionsScreen, { TaskItem } from './PermissionsScreen';
import { openSettings } from '../../bits/settingsUrl';
import { registerPermissionDetection } from '../../bits/NativeEmitters';

import icon29 from '../../assets/Icon-29.png';
import locationIcon from '../../assets/ios-location-icon.png';
import bluetoothIcon from '../../assets/ios-bluetooth-icon.png';

const AlwaysAllow = ({
    nextPage,
    style = [],
    tellMeMore,
    force = false,
    firstHadPermission,
    bluetoothStatus,
}) => {
    const [visitedSettings, setVisitedSettings] = React.useState(false);
    const [didAdvance, setDidAdvance] = React.useState(force);
    const dispatch = useDispatch();

    const locationPermission = useSelector(
        ({ user: { permissions } }) =>
            typeof permissions === 'object' &&
            'location' in permissions &&
            permissions.location
    );

    React.useEffect(() => {
        // iOS 13 and later grant a provisional allow-always permission. if we
        // think we have this provisional permission, refuse to advance until
        // the user clicks the button anyway.
        const mustClickButton = Platform.select({
            ios: !firstHadPermission && parseInt(Platform.Version, 10) >= 13,
            default: false,
        });

        if (
            (!mustClickButton || visitedSettings) &&
            locationPermission &&
            (bluetoothStatus === 'on' || bluetoothStatus === 'off') &&
            !didAdvance
        ) {
            setDidAdvance(true);
            nextPage();
        }
    }, [
        locationPermission,
        didAdvance,
        nextPage,
        visitedSettings,
        firstHadPermission,
        bluetoothStatus,
    ]);

    const visitSettings = React.useCallback(() => {
        setVisitedSettings(true);
        openSettings();
    }, []);

    React.useEffect(() => registerPermissionDetection(dispatch), [dispatch]);

    const showBluetoothLine = !['on', 'off', ''].includes(bluetoothStatus);

    return (
        <PermissionsScreen
            style={style}
            headline="“Always Allow”"
            subhead="We need your location so we can send your location to your friends and/or 911 when you activate your bracelet, even if the app isn’t open."
            visitSettings={visitSettings}
            tellMeMore={tellMeMore}
        >
            <TaskItem icon={icon29} text="Visit Flare Settings" first />
            <TaskItem icon={locationIcon} text="Tap “Location”" />
            <TaskItem emoji="✨" text="Select “Always”" />
            {showBluetoothLine && (
                <TaskItem icon={bluetoothIcon} text="Turn “Bluetooth” on" />
            )}
        </PermissionsScreen>
    );
};

export default AlwaysAllow;
