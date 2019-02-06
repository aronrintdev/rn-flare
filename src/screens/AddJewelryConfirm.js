import React from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Entypo';

import { DEVICE_TWO_FACTOR_LABEL_LENGTH } from '../constants';
import { claimDevice } from '../actions/index';
import Button from '../bits/Button';
import Colors from '../bits/Colors';
import Spacing from '../bits/Spacing';
import Type from '../bits/Type';
import Strings from '../locales/en';
import JewelryLabelPreview from '../bits/JewelryLabelPreview';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: Colors.backgrounds.blue,
        padding: Spacing.medium,
    },
    manualInputArea: {
        alignItems: 'stretch',
        flex: 1,
        flexDirection: 'row',
        marginBottom: Spacing.medium,
    },
    manualInputField: {
        flex: 1,
        borderWidth: 2,
        fontSize: Type.size.large,
        paddingLeft: Spacing.small,
        paddingRight: Spacing.small,
        textAlign: 'center',
    },
    promptBackground: {
        marginBottom: Spacing.medium,
    },
    promptForeground: {
        fontSize: Type.size.medium,
        paddingTop: Spacing.medium,
    },
    preview: {
        flex: 4,
        flexDirection: 'column',
        marginBottom: Spacing.medium,
    },
    previewImage: {
        flex: 5,
        width: '100%',
    },
    pointAtJewelry: {
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        textAlign: 'center',
    },
    previewLabel: {
        position: 'absolute',
        top: 140,
        left: '5%',
        right: '5%',
    },
    buttonArea: {
        flex: 1,
        marginBottom: Spacing.small,
    },
});

class AddJewelryConfirm extends React.Component {
    static options() {
        return {
            topBar: {
                visible: true,
                animate: false,
                leftButtons: [],
            },
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            twoFactor: null,
        };
    }

    static onPressTryAgain() {
        Navigation.popToRoot('JEWELRY_STACK');
    }

    componentDidUpdate(prevProps) {
        if (!this.props.claimingDevice && prevProps.claimingDevice && this.props.claimedDevice) {
            Navigation.popToRoot('JEWELRY_STACK');
        }
    }

    componentDidAppear() {
        this.setState({
            twoFactor: null,
        });
    }

    componentDidDisappear() {
        this.setState({
            twoFactor: null,
        });
    }

    changeTwoFactor(newCode) {
        this.setState({
            twoFactor: newCode.replace(/[^0-9A-Z]+/g, ''),
        });
        if (newCode.length === DEVICE_TWO_FACTOR_LABEL_LENGTH) {
            this.props.dispatch(claimDevice(this.props.token, this.props.deviceID, newCode));
        }
    }

    goToPushedView = () => {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'com.flarejewelry.app.AddJewelryConfirm',
            },
        });
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container}>
                <View style={styles.promptBackground}>
                    <Text style={styles.promptForeground}>
                        {Strings.jewelry.addNewConfirm.prompt}
                    </Text>
                </View>
                <View style={styles.preview}>
                    <Image
                        source={require('../assets/cuff-v2.png')}
                        style={styles.previewImage}
                        resizeMode="contain"
                    />
                    <Icon
                        name="arrow-long-up"
                        size={30}
                        color={Colors.theme.cream}
                        style={styles.pointAtJewelry}
                    />
                    <JewelryLabelPreview
                        deviceID={this.props.deviceID}
                        containerStyle={styles.previewLabel}
                        circleTwoFactor
                    />
                </View>
                <View style={styles.manualInputArea}>
                    {this.props.claimingDevice &&
                        <ActivityIndicator />
                    }
                    {!this.props.claimingDevice &&
                        <TextInput
                            autoCapitalize="characters"
                            placeholder={Strings.jewelry.addNewConfirm.placeholderTwoFactor}
                            style={styles.manualInputField}
                            value={this.state.twoFactor}
                            onChangeText={v => this.changeTwoFactor(v)}
                            maxLength={DEVICE_TWO_FACTOR_LABEL_LENGTH}
                        />
                    }
                </View>
                <View style={styles.buttonArea}>
                    <Button
                        onPress={() => AddJewelryConfirm.onPressTryAgain()}
                        title={Strings.jewelry.addNewTryAgain}
                    />
                </View>
            </KeyboardAvoidingView>
        );
    }
}

function mapStateToProps(state) {
    return {
        shortPressCounts: state.beacons.recentShortPressCounts,
        claimingDevice: state.user.claimingDevice,
        claimedDevice: state.user.claimedDevice,
        token: state.user.token,
    };
}

export default connect(mapStateToProps)(AddJewelryConfirm);
