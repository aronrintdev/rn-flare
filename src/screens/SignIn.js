import React, { Component } from 'react';
import { Image, Text, TextInput, View, KeyboardAvoidingView } from 'react-native';
import RadialGradient from 'react-native-radial-gradient';
import { connect } from 'react-redux';

import { signIn, signOut, resetAuth } from '../actions/authActions';

import Button from '../bits/Button';
import Colors from '../bits/Colors';
import Spacing from '../bits/Spacing';
import Strings from '../locales/en';

const styles = {
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 0,
        backgroundColor: Colors.theme.purple,
    },
    backgroundGradient: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.7,
    },
    choosePrompt: {
        marginBottom: 12,
    },
    logo: {
        width: '70%',
        flex: 4,
        margin: Spacing.large,
        marginTop: Spacing.huge,
        resizeMode: 'contain',
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
        flex: 3,
        paddingLeft: Spacing.medium,
        paddingRight: Spacing.medium,
        alignItems: 'stretch',
        marginBottom: Spacing.huge,
    },
    input: {
        marginBottom: Spacing.tiny,
        backgroundColor: Colors.white,
        height: Spacing.huge,
        minHeight: Spacing.huge,
    },
    buttons: {
        marginBottom: Spacing.huge + Spacing.huge,
        padding: Spacing.medium,
        flex: 1,
    },
};

export class SignIn extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            username: null,
            password: null,
            invalid: false,
        };
        
        const { dispatch } = props;
        dispatch(resetAuth());
    }

    changeUserName(newValue) {
        this.setState({
            username: newValue,
        });
    }

    changePassword(newValue) {
        this.setState({
            password: newValue,
        });
    }

    async startSignIn() {
        const { dispatch } = this.props;
        const { username, password } = this.state;
        if (username === null || username.length === 0 || password === null || password.length === 0) {
            this.setState({
                invalid: true,
            });
            return;
        }

        this.setState({
            invalid: false,
        });

        dispatch(signIn(username, password));
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <RadialGradient
                    style={styles.backgroundGradient}
                    colors={[Colors.theme.orangeDark, Colors.theme.purple]}
                    radius={300}
                />
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
                        autoCapitalize="none"
                        placeholder={Strings.signin.usernamePrompt}
                        style={styles.input}
                        value={this.state.username}
                        onChangeText={v => this.changeUserName(v)}
                    />
                    <TextInput
                        autoCapitalize="none"
                        placeholder={Strings.signin.passwordPrompt}
                        secureTextEntry
                        style={styles.input}
                        value={this.state.password}
                        onChangeText={v => this.changePassword(v)}
                    />
                </View>
                <View style={styles.buttons}>
                    <Button
                        whiteOutline
                        fullWidth
                        onPress={() => this.startSignIn()}
                        title={Strings.signin.signInLabel}
                    />
                </View>
            </KeyboardAvoidingView>
        );
    }
}

export default connect()(SignIn);
