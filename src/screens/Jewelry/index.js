import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import { disclaimDevice } from '../../actions';
import { USERS_CAN_ADD_JEWELRY } from '../../constants/Config';
import * as actionTypes from '../../actions/actionTypes';
import Button from '../../bits/Button';
import FlareDeviceID from '../../bits/FlareDeviceID';
import JewelryList from './JewelryList';
import Spacing from '../../bits/Spacing';
import Strings from '../../locales/en';
import Colors from '../../bits/Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: Spacing.medium,
        backgroundColor: Colors.theme.cream,
    },
    buttonArea: {
        paddingTop: Spacing.small,
    },
});

// eslint-disable-next-line react/prefer-stateless-function
class Jewelry extends React.Component {
    static options() {
        return {
            topBar: {
                visible: true,
            },
        };
    }

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
        this.state = {
            showSideMenu: false,
        };
    }

    addNewJewelry() {
        this.props.dispatch({
            type: actionTypes.BEACON_COUNTS_RESET,
        });
        Navigation.push(this.props.componentId, {
            component: {
                name: 'com.flarejewelry.app.AddJewelry',
                passProps: {
                    bleManager: this.props.bleManager,
                },
            },
        });
    }

    removeJewelry(deviceID) {
        this.props.dispatch(disclaimDevice(this.props.authToken, deviceID));
    }

    confirmRemoveJewelry(deviceID) {
        const jewelryLabel = FlareDeviceID.getJewelryLabelFromDeviceID(
            deviceID
        );
        const prompt = `${Strings.jewelry.removeConfirm.promptBegin}${jewelryLabel}${Strings.jewelry.removeConfirm.promptEnd}`;
        Navigation.showModal({
            stack: {
                children: [
                    {
                        component: {
                            name: 'com.flarejewelry.app.Confirm',
                            passProps: {
                                cancelLabel:
                                    Strings.jewelry.removeConfirm.cancelLabel,
                                confirmLabel:
                                    Strings.jewelry.removeConfirm.confirmLabel,
                                onConfirm: () => this.removeJewelry(deviceID),
                                prompt,
                            },
                        },
                    },
                ],
            },
        });
    }

    toggleSideMenu() {
        const { showSideMenu } = this.state;
        const newSideMenuState = !showSideMenu;

        Navigation.mergeOptions(this.props.componentId, {
            sideMenu: {
                left: {
                    visible: newSideMenuState,
                },
            },
        });

        this.setState({
            showSideMenu: newSideMenuState,
        });
    }

    navigationButtonPressed({ buttonId }) {
        switch (buttonId) {
            case 'menuButton':
                this.toggleSideMenu();
                break;
            default:
                console.warn('Unhandled button press in home screen.');
                break;
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {(this.props.claimingDevice ||
                    this.props.disclaimingDevice) && (
                    <ActivityIndicator size={24} />
                )}
                <JewelryList
                    jewelry={this.props.devices}
                    onRemove={deviceID => this.confirmRemoveJewelry(deviceID)}
                />
                <View style={styles.buttonArea}>
                    {USERS_CAN_ADD_JEWELRY && (
                        <Button
                            dark
                            primary
                            onPress={() => this.addNewJewelry()}
                            title={Strings.jewelry.addNew}
                        />
                    )}
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        authToken: state.user.authToken,
        devices: state.user.devices,
        loading: state.user.loadingDevices === 'requested',
    };
}

export default connect(mapStateToProps)(Jewelry);
