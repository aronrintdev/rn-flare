import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import HelpSection from '../AddHardware/HelpSection';
import { resetOnboardingComplete } from '../../actions/userActions';

import OhFicus from './OhFicus';

const GoldenRules = () => {
    const dispatch = useDispatch();
    const status = useSelector(
        ({ user }) => user.settingOnboardingCompleteStatus
    );

    const reset = React.useCallback(() => {
        dispatch(resetOnboardingComplete());
    }, [dispatch]);

    if (status === 'error') {
        return <OhFicus retry={reset} />;
    } else {
        return (
            <>
                <HelpSection emoji="โ" title="Bluetooth On." blackText>
                    Leave your bluetooth on for Flare to work (but you donโt
                    need to pair with your bracelet). Your phone needs to have
                    service for Flare to work.
                </HelpSection>
                <HelpSection emoji="๐" title="Location Services." blackText>
                    If you send a message to your crew, they will also receive
                    your location. Keep location services โalwaysโ allowed.
                </HelpSection>
                <HelpSection emoji="๐ฏ" title="10 Feet Away Is Best" blackText>
                    Your phone needs to be within range of your bracelet to get
                    the signal.
                </HelpSection>
                <HelpSection emoji="๐" title="Love." blackText>
                    Use Flare with love, thoughtfulness, honesty and good
                    intention.
                </HelpSection>
            </>
        );
    }
};

export default GoldenRules;
