import React, { Component } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Linking, Text, TextInput, View } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import { signIn, resetAuth } from '../actions/authActions';
import Aura from '../bits/Aura';
import Button from '../bits/Button';
import Colors from '../bits/Colors';
import Spacing from '../bits/Spacing';
import Strings from '../locales/en';

const styles = {
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backgroundAura: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: undefined,
        height: undefined,
        resizeMode: 'cover',
    },
    logo: {
        width: '70%',
        flex: 4,
        marginTop: Spacing.huge,
        marginBottom: Spacing.huge,
        maxHeight: 128,
        resizeMode: 'contain',
    },
    invalid: {
        paddingTop: Spacing.small,
        paddingBottom: Spacing.small,
        paddingLeft: Spacing.large,
        paddingRight: Spacing.large,
        backgroundColor: Colors.theme.blue,
    },
    invalidText: {
        color: Colors.white,
    },
    inputs: {
        flex: 3,
        width: '80%',
        padding: Spacing.large,
        alignItems: 'stretch',
        marginHorizontal: Spacing.large,
        marginBottom: Spacing.huge,
        borderRadius: Spacing.large,
    },
    input: {
        marginBottom: Spacing.small,
        paddingHorizontal: Spacing.smallish,
        paddingVertical: Spacing.medium,
        backgroundColor: Colors.theme.cream,
        borderBottomWidth: 1,
        borderBottomColor: Colors.theme.purple,
        borderRightColor: Colors.theme.peach,
        fontSize: 18,
        color: Colors.black,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'stretch',
        padding: Spacing.small,
        height: Spacing.huge,
        minHeight: Spacing.huge,
        maxHeight: Spacing.huge,
    },
    buttons: {
        padding: Spacing.huge,
        flex: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signinButton: {
        marginTop: Spacing.huge,
    },
};

class Register extends Component {
    static options() {
        return {
            topBar: {
                visible: false,
            },
        };
    }

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

    goToPushedView = () => {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'com.flarejewelry.app.Register',
            },
        });
    };

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

    register() {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'com.flarejewelry.app.Register',
            },
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
                <Image source={{ uri: 'aura-4.jpg' }} style={styles.backgroundAura} />
                <Image source={{ uri: 'logo-aura.png' }} style={styles.logo} />
                {(this.state.invalid || this.props.authState === 'failed') && (
                    <View style={styles.invalid}>
                        <Text style={styles.invalidText}>{Strings.signin.invalid}</Text>
                    </View>
                )}
                <View style={styles.inputs}>
                    <TextInput
                        autoCapitalize="none"
                        placeholder={Strings.register.usernamePrompt}
                        placeholderTextColor={Colors.black}
                        style={styles.input}
                        value={this.state.username}
                        onChangeText={v => this.changeUserName(v)}
                    />
                    <TextInput
                        autoCapitalize="none"
                        placeholder={Strings.register.passwordPrompt}
                        placeholderTextColor={Colors.black}
                        secureTextEntry
                        style={styles.input}
                        value={this.state.password}
                        onChangeText={v => this.changePassword(v)}
                    />
                    <TextInput
                        autoCapitalize="none"
                        placeholder={Strings.register.confirmPasswordPrompt}
                        placeholderTextColor={Colors.black}
                        secureTextEntry
                        style={styles.input}
                        value={this.state.password}
                        onChangeText={v => this.changeConfirmPassword(v)}
                    />
                    <TextInput
                        autoCapitalize="characters"
                        placeholder={Strings.register.serialNumber}
                        placeholderTextColor={Colors.black}
                        style={styles.input}
                        value={this.state.serialNumber}
                        onChangeText={v => this.changeSerialNumber(v)}
                    />
                    <Button
                        secondary
                        title={Strings.signin.needToBuy}
                        onPress={() => Linking.openURL('https://getflare.com')}
                    />
                    <Button
                        primary
                        onPress={() => this.startSignIn()}
                        title={Strings.register.title}
                        styleBackground={styles.signinButton}
                    />
                </View>
                <View style={styles.loadingContainer}>
                    {this.props.authState === 'requested' && <ActivityIndicator color={Colors.white} />}
                </View>
            </KeyboardAvoidingView>
        );
    }
}
function mapStateToProps(state) {
    return {
        devices: state.user.devices,
    };
}

export default connect(mapStateToProps)(Register);
