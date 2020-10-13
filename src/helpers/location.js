import RNLocation from 'react-native-location';

function parsePosition(position) {
    const parsed = {
        coords: {
            latitude: position.latitude,
            longitude: position.longitude,
        },
        timestamp: position.timestamp,
        ...position,
    };

    return parsed;
}

export default function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        RNLocation.requestPermission({
            ios: 'always',
        })
            .then(granted => {
                if (granted) {
                    RNLocation.configure({ disatnceFilter: 5 });
                    RNLocation.getLatestLocation({ timeout: 60000 }).then(
                        position => resolve(parsePosition(position)),
                        ({ code, message }) =>
                            reject(
                                Object.assign(new Error(message), {
                                    name: 'PositionError',
                                    code,
                                })
                            )
                    );
                } else {
                    reject(new Error('Location permissions not granted'));
                }
            })
            .catch(error => {
                reject(new Error(error));
            });
    });
}
