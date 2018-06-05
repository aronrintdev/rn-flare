import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import moment from 'moment';

import Colors from '../bits/Colors';
import Strings from '../locales/en';

import { API } from '../bits/API';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0
    },
    containerWithActiveFlare: {
        backgroundColor: Colors.theme.orange,
    },
    separate: {
        marginTop: 50
    },
    choosePrompt: {
        marginBottom: 12
    },
    logo: {
        width: 200,
        margin: 25,
        marginBottom: 90,
        padding: 8,
        resizeMode: 'contain'
    },
});

export default class Home extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        header: null
    });

    async checkAuth() {
        const pingResponse = await this.props.screenProps.flareAPI.ping();
        if (pingResponse.status === this.props.screenProps.flareAPI.requestStatus.failure) {
            this.props.navigation.navigate('SignIn');
        }
    }

    componentDidMount() {
        this.checkAuth();
        this.props.screenProps.checkForActiveFlare();
    }

    cancelActiveFlare() {
        this.props.navigation.navigate('CodeInput');
    }

    render() {
        const { screenProps } = this.props;
        const hasTimestamp = screenProps && screenProps.lastBeacon && screenProps.lastBeacon.timestamp;
        const lastBeaconTimeHeading = hasTimestamp ? 
            Strings.beacons.lastReceived : Strings.beacons.notYetReceived;

        const containerStyles = [styles.container];
        if (screenProps.hasActiveFlare) {
            containerStyles.push(styles.containerWithActiveFlare);
        }

        return (
            <View style={containerStyles}>
                <Image
                    source={require('../assets/FLARE-white.png')}
                    style={styles.logo}
                />
                <Text>
                    {lastBeaconTimeHeading}
                </Text>
                {hasTimestamp &&
                    <Text>
                        {moment(screenProps.lastBeacon.timestamp).toLocaleString()}
                    </Text>
                }
                {screenProps.hasActiveFlare &&
                    <Button 
                        title={Strings.home.cancelActiveFlare}
                        onPress={() => this.cancelActiveFlare()}
                    />
                }
            </View>
        );
    }
}
