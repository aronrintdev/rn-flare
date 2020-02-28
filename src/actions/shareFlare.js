import { Share } from 'react-native';
import { USER_DID_SHARE, USER_WILL_SHARE } from './actionTypes';

const url = 'https://getflare.com/';

export const shareFlare = () => async (dispatch, getState) => {
    const {
        user: { referralKey },
    } = getState();
    const message = `Here’s $50 off your first Flare bracelet to celebrate the company’s launch! Use my referral code ${referralKey} to purchase Flare and join the movement.`;

    try {
        dispatch({ type: USER_WILL_SHARE });
        const result = await Share.share({ message, url });
        dispatch({ type: USER_DID_SHARE, result });
    } catch (e) {
        console.error(e);
    }
};
