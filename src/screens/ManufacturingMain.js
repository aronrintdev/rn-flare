import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import { signOut } from '../actions/authActions';
import getDeviceCounts from '../actions/manufacturingActions';
import Button from '../bits/Button';
import Colors from '../bits/Colors';
import DeviceStages from '../bits/DeviceStages';
import Spacing from '../bits/Spacing';
import Strings from '../locales/en';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    body: {
        flex: 16,
    },
    header: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Spacing.large,
    },
    logoArea: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        paddingLeft: Spacing.small,
    },
    logoImage: {
        resizeMode: 'contain',
        width: 110,
        borderWidth: 1,
        borderColor: Colors.white,
    },
    brandArea: {
        flex: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerActions: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: Spacing.small,
    },
});

class ManufacturingMain extends React.Component {
    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
        this.screenEventListener = Navigation.events().registerComponentDidDisappearListener(
            () => {
                this.setState({ showSideMenu: false });
            }
        );
        this.state = {
            showSideMenu: false,
        };
    }

    componentDidMount() {
        const { dispatch, authToken } = this.props;
        dispatch(getDeviceCounts(authToken));
    }

    componentWillUnmount() {
        this.screenEventListener.remove();
    }

    goToPushedView = () => {
        const { componentId } = this.props;
        Navigation.push(componentId, {
            component: {
                name: 'com.flarejewelry.manufacturing.main',
            },
        });
    };

    toggleSideMenu() {
        const { showSideMenu } = this.state;
        const { componentId } = this.props;
        const newSideMenuState = !showSideMenu;

        Navigation.mergeOptions(componentId, {
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

    handleSignOut() {
        const { dispatch } = this.props;
        dispatch(signOut());
    }

    render() {
        const { manufacturingLoading, deviceCounts } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.logoArea}>
                        <Image
                            source={{ uri: 'logo-aura' }}
                            style={styles.logoImage}
                        />
                    </View>
                    <View style={styles.brandArea}>
                        <Text>{Strings.manufacturing.title}</Text>
                    </View>
                    <View style={styles.headerActions}>
                        {manufacturingLoading && <ActivityIndicator />}
                        <Button
                            outline
                            onPress={() => this.handleSignOut()}
                            title={Strings.generic.signOut}
                        />
                    </View>
                </View>
                <View style={styles.body}>
                    <DeviceStages
                        stages={Object.keys(Strings.manufacturing.stages)}
                        deviceCounts={deviceCounts}
                    />
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        authToken: state.user.authToken,
        cancelingActiveFlare: state.user.cancelingActiveFlare,
        hasActiveFlare: state.user.hasActiveFlare,
        deviceCounts: state.manufacturing.deviceCounts,
        manufacturingLoading: state.manufacturing.loading,
    };
}

export default connect(mapStateToProps)(ManufacturingMain);
