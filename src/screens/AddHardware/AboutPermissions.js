import * as React from 'react';

import HelpSection from './HelpSection';
import HelpScreen from './HelpScreen';

import bluetoothIcon from '../../assets/permission-bluetooth.png';
import locationIcon from '../../assets/permission-location.png';
import contactsIcon from '../../assets/permission-contacts.png';
import notificationsIcon from '../../assets/permission-notifs.png';

const AboutPermissions = props => (
    <HelpScreen
        headline="Our smart jewelry requires some permissions:"
        {...props}
    >
        <HelpSection icon={bluetoothIcon} title="Bluetooth">
            Without Bluetooth on, your phone and bracelet can’t talk to each
            other. And you need to have phone service.
        </HelpSection>
        <HelpSection icon={locationIcon} title="Location">
            We need your location so that we can let your Crew and/or 911 know
            where you are when you need backup.
        </HelpSection>
        <HelpSection icon={contactsIcon} title="Contacts">
            So that you can add friends to your Crew directly from your phone
            contacts.
        </HelpSection>
        <HelpSection icon={notificationsIcon} title="Notifications">
            You can opt to get secret notifications from Flare that confirm that
            your jewelry has sent a text to your Crew.
        </HelpSection>
    </HelpScreen>
);

export default AboutPermissions;
