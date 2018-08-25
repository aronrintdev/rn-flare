import { Platform } from 'react-native';
import PushNotification, { PushNotificationIOS } from 'react-native-push-notification';

import Colors from './Colors';
import Strings from '../locales/en';

export default class NotificationManager {
    constructor() {
        PushNotification.configure({
            onNotification: notification => this.onNotification(notification),
            requestPermissons: true,
            popInitialNotification: false,
        });
    }

    onNotification(notification) {
        if (Platform.OS === 'ios') {
            notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
    }

    localNotify(notification) {
        // Play sounds unless directed otherwise by the playSound option.
        const { message, options = {} } = notification;
        const playSound = options.playSound !== false;
        const { smallIcon = 'notification', largeIcon = 'notsorry' } = options;

        PushNotification.setApplicationIconBadgeNumber(0);

        PushNotification.localNotification({
            title: Strings.notifications.title,
            message,
            playSound,
            smallIcon,
            largeIcon,
            color: Colors.theme.green,
        });
    }
}
