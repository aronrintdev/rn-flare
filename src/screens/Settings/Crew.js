import * as React from 'react';
import {
    Image,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { navOptions, styles } from './styles';
import chevron from '../../assets/chevron.png';
import { openContactsScreen } from '../Contacts';
import { useSlideMenu } from '../../bits/useNavigationCallback';

const Crew = ({ componentId }) => {
    const editCrew = React.useCallback(() => {
        openContactsScreen(componentId);
    }, [componentId]);

    useSlideMenu(componentId);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.subhead}>Manage my crew</Text>
            <View style={styles.itemContainer}>
                <TouchableOpacity style={styles.item} onPress={editCrew}>
                    <Text style={styles.text}>Add/Edit Crew</Text>
                    <Image
                        resizeMode="center"
                        source={chevron}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.explain}>
                Choose who will be notified that you sent a flare when you
                choose to text a friend with your bracelet.
            </Text>
        </SafeAreaView>
    );
};

Crew.options = navOptions('My Crew', false);

export default Crew;
