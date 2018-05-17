import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Examples, Button, Image, Screen, Text, TextInput, View } from '@shoutem/ui';

import signIn from '../bits/Auth';
import Colors from '../bits/Colors';
import Spacing from '../bits/Spacing';
import Strings from '../locales/en';

export default class SignIn extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            username: null,
            password: null,
            invalid: false,
            signedIn: false,
        };
    }

    static navigationOptions = ({navigation, screenProps}) => ({
        header: null
    });

    changeUserName(newValue) {
        this.setState({
            username: newValue
        });
    }

    changePassword(newValue) {
        this.setState({
            password: newValue
        });
    }

    async startSignIn() {
        const { username, password } = this.state;
        if (username === null || username.length === 0 || password === null || password.length === 0) {
            this.setState({
                invalid: true
            });
            return;
        }
        
        this.setState({
            invalid: false
        });

        console.log(`sign in w/ ${this.state.username} / ${this.state.password}`);
        let response = await signIn(username, password);
        if (response === false) {
            this.setState({
                invalid: true,
                signedIn: false,
            });
        } else {
            this.setState({
                invalid: false,
                signedIn: true,
            });            
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Image 
                    source={require('../assets/FLARE-white.png')}
                    style={styles.logo}
                />
                {this.state.invalid &&
                    <View style={styles.invalid}>
                        <Text style={styles.invalidText}>
                            {Strings.signin.invalid}
                        </Text>
                    </View>
                }
                <View style={styles.inputs}>
                    <TextInput
                        placeholder={Strings.signin.usernamePrompt}
                        style={styles.input}
                        value={this.state.username}
                        onChangeText={(v) => this.changeUserName(v)}
                    />
                    <TextInput
                        placeholder={Strings.signin.passwordPrompt}
                        secureTextEntry
                        style={styles.input}
                        value={this.state.password}
                        onChangeText={(v) => this.changePassword(v)}
                    />
                </View>
                <View style={styles.buttons}>
                    <Button styleName="secondary" onPress={() => this.startSignIn()}>
                        <Text>{Strings.signin.signInLabel}</Text>
                    </Button>
                </View>
                {this.state.signedIn &&
                    <Text>💥 OMG YOU ARE SIGNED IN 🦄</Text>
                }
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundGradient: {
            colors: [Colors.theme.orange, Colors.theme.purple]
        }
    },
    separate: {
        marginTop: 50
    },
    choosePrompt: {
        marginBottom: 12
    },
    logo: {
        width: '70%',
        margin: Spacing.large,
        resizeMode: 'contain'
    },
    invalid: {
        paddingTop: Spacing.small,
        paddingBottom: Spacing.small,
        paddingLeft: Spacing.large,
        paddingRight: Spacing.large,
        backgroundColor: Colors.theme.purple,
    },
    invalidText: {
        color: Colors.white,
    },
    inputs: {
        width: '100%',
        alignItems: 'stretch',
        marginBottom: Spacing.huge,
    },
    input: {
        marginBottom: Spacing.tiny,
    },
    buttons: {
        marginBottom: Spacing.huge + Spacing.huge
    }
};
