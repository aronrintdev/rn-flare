import * as React from 'react';
import {
    Image,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import { navOptions, styles } from './styles';
import chevron from '../../assets/chevron.png';
import { useSlideMenu } from '../../bits/useNavigationCallback';

const Crew = ({ componentId }) => {
    const editCrew = React.useCallback(() => {
        Navigation.push(componentId, {
            component: {
                name: 'com.flarejewelry.app.Contacts',
            },
        });
    }, [componentId]);

    useSlideMenu(componentId);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.subhead}>Manage my crew</Text>
            <View
                style={[
                    styles.itemContainer,
                    styles.firstItemContainer,
                    styles.lastItemContainer,
                ]}
            >
                <TouchableOpacity
                    style={[styles.item, styles.lastItem]}
                    onPress={editCrew}
                >
                    <Text style={styles.text}>Add/Edit Crew Members</Text>
                    <Image
                        resizeMode="center"
                        source={chevron}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.explain}>
                Choose which friends to message. We call them your Crew.
            </Text>
        </SafeAreaView>
    );
};

Crew.options = navOptions('My Crew', false);

export default Crew;
