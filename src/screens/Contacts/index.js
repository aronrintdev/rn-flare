import React from 'react';
import { Alert, StatusBar, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import CrewList from './CrewList';
import ErrorMessage from './ErrorMessage';
import SuccessfullySent from './SuccessfullySent';
import * as userActions from '../../actions/userActions';
import * as navActions from '../../actions/navActions';
import Colors from '../../bits/Colors';
import Spacing from '../../bits/Spacing';
import Strings from '../../locales/en';
import Type from '../../bits/Type';
import { saveButton, settingsNavOptions } from '../Settings';
import ContactsListWrapper from './ContactsListWrapper';

const MAX_CREW_SIZE = 5;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.theme.cream,
        flexDirection: 'column',
    },
    nameFieldContainer: {
        marginBottom: Spacing.small,
    },
    nameField: {
        borderWidth: 1,
        borderColor: Colors.grey,
        paddingLeft: Spacing.small,
    },
    prompt: {
        padding: Spacing.medium,
        fontWeight: 'bold',
        fontSize: Type.size.small,
    },
    instructions: {
        paddingBottom: Spacing.large,
        fontSize: Type.size.medium,
    },
    onboardingHeader: {},
    tutorialOverlay: {
        paddingHorizontal: Spacing.huge,
        paddingBottom: Spacing.medium,
        backgroundColor: Colors.theme.purple,
    },
    tutorialTitle: {
        fontWeight: 'bold',
        fontSize: Type.size.medium,
        marginTop: Spacing.medium,
        marginBottom: Spacing.small,
        color: Colors.white,
        textAlign: 'center',
    },
    tutorialText: {
        color: Colors.white,
        textAlign: 'center',
    },
    tutorialButtons: {
        backgroundColor: Colors.theme.purple,
        paddingBottom: Spacing.medium,
    },
});

class Contacts extends React.Component {
    static options = () => settingsNavOptions('My Crew', true);

    constructor(props) {
        super(props);
        this.state = {
            crew: props.crew,
            dirty: false,
            addedMembers: false,
            showingSuccess: false,
        };
    }

    componentDidMount() {
        const {
            fetchContacts,
            textFriendsReset,
            resetSetCrewMembers,
        } = this.props;
        fetchContacts();
        textFriendsReset();
        resetSetCrewMembers();
        this.navigationEventListener = Navigation.events().bindComponent(this);
    }

    componentDidUpdate(
        { textFriendsState: prevTextFriendsState, loading: prevLoading },
        { dirty: prevDirty }
    ) {
        const {
            textFriendsState,
            componentId,
            loading,
            crewUpdateState,
            showFlareServiceError,
        } = this.props;
        const { dirty, addedMembers } = this.state;
        if (
            prevTextFriendsState === 'requested' &&
            textFriendsState !== 'requested'
        ) {
            switch (textFriendsState) {
                case 'confirm':
                    this.performSave();
                    break;
                case 'cancel':
                default:
                    Navigation.pop(componentId);
                    break;
            }
        }
        if (dirty !== prevDirty || loading !== prevLoading) {
            const showButton = dirty && !loading;
            Navigation.mergeOptions(componentId, {
                topBar: {
                    rightButtons: showButton ? [saveButton] : [],
                },
            });
        }
        if (loading !== prevLoading) {
            if (crewUpdateState === 'succeeded' && !addedMembers) {
                Navigation.pop(componentId);
            }
        }
        if (showFlareServiceError) {
            this.showEnableCrewErrorAlert();
        }
    }

    componentWillUnmount() {
        if (this.navigationEventListener) {
            this.navigationEventListener.remove();
        }
    }

    performSave = async () => {
        const {
            setCrewMembers,
            authToken,
            profile,
            setCrewEnabled,
            crewEnabled,
        } = this.props;
        const { crew } = this.state;
        try {
            if (!crewEnabled) {
                const resp = await setCrewEnabled(authToken, profile.id);
                if (!resp) {
                    const resp2 = await setCrewEnabled(authToken, profile.id);
                    if (!resp2) {
                        this.showEnableCrewErrorAlert();
                    }
                }
            }
            setCrewMembers(authToken, crew.id || 0, crew.members);
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    showEnableCrewErrorAlert = () => {
        const { hideFlareServiceErrorAlert } = this.props;
        Alert.alert(
            `Sorry, we are unable to connect to Flare to toggle your settings. Please try again later, or contact us at help@getflare.com if this issue persists.`
        );
        hideFlareServiceErrorAlert();
    };

    handleContactPress = contact => {
        const {
            crew: { members: oldMembers },
        } = this.state;

        if (!contact || !contact.name || oldMembers.length === MAX_CREW_SIZE) {
            return;
        }

        const memberIndex = oldMembers.findIndex(e => e.key === contact.key);
        const newMembers =
            memberIndex === -1
                ? // If the selected contact is not in the crew, add it
                  [...oldMembers, contact]
                : // The selected contact is in the crew, so remove it by keeping everyone else
                  oldMembers.filter((val, index) => index !== memberIndex);

        this.setState(({ crew }) => ({
            crew: { ...crew, members: newMembers },
            dirty: true,
            addedMembers: true,
        }));
    };

    removeCrewMember = contact => {
        const {
            crew: { members: oldMembers },
        } = this.state;

        const memberIndex = oldMembers.findIndex(e => e.id === contact.id);
        const newMembers = oldMembers.filter(
            (val, index) => index !== memberIndex
        );

        this.setState(({ crew }) => ({
            crew: { ...crew, members: newMembers },
            dirty: true,
        }));
    };

    confirmClose = (title, message, cancel, ok) => {
        const { componentId } = this.props;
        Alert.alert(title, message, [
            {
                style: 'cancel',
                text: cancel,
                onPress: () => {},
            },
            {
                style: 'destructive',
                text: ok,
                onPress: () => {
                    Navigation.pop(componentId);
                },
            },
        ]);
    };

    handleBack = () => {
        const { componentId } = this.props;
        const { dirty, crew } = this.state;
        if (dirty) {
            this.confirmClose(
                'Leave without saving?',
                undefined,
                'Go Back',
                'Yes'
            );
        } else if (!crew || !crew.members || crew.members.length === 0) {
            this.confirmClose(
                'Are you sure you don’t want to add a crew?',
                'If you don’t add a crew, we can’t text your friends with your bracelet.',
                'Add a Crew',
                'I’m sure'
            );
        } else {
            Navigation.pop(componentId);
        }
    };

    handleSave = () => {
        const { textFriendsRequest } = this.props;
        const { addedMembers } = this.state;
        if (addedMembers) {
            textFriendsRequest();
            Navigation.showModal({
                component: {
                    name: 'com.flarejewelry.app.contacts.TextConfirm',
                },
            });
        } else {
            this.performSave();
        }
    };

    navigationButtonPressed({ buttonId }) {
        switch (buttonId) {
            case 'backButton':
                this.handleBack();
                break;
            case 'save':
                this.handleSave();
                break;
            default:
                break;
        }
    }

    render() {
        const { contactsState, crewUpdateState, componentId } = this.props;
        const { crew, addedMembers } = this.state;
        const hasCrew = crew && crew.members && crew.members.length > 0;

        if (crewUpdateState === 'succeeded' && addedMembers) {
            return <SuccessfullySent componentId={componentId} />;
        }

        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />
                {(hasCrew || contactsState !== 'failed') && (
                    <Text style={styles.prompt}>
                        {hasCrew
                            ? `${Strings.contacts.chooseInstruction.start} ${crew.members.length} ${Strings.contacts.chooseInstruction.end}`
                            : Strings.contacts.choosePrompt}
                    </Text>
                )}
                {hasCrew && (
                    <CrewList
                        crew={crew}
                        onPressContact={this.removeCrewMember}
                    />
                )}
                <ContactsListWrapper
                    handleContactPress={this.handleContactPress}
                />
                {crewUpdateState === 'failed' && <ErrorMessage />}
            </View>
        );
    }
}

const mapStateToProps = ({
    user: {
        crews,
        authToken,
        contactsState,
        hasViewedTutorial,
        crewUpdateState,
        textFriends,
        profile,
        settings,
        showFlareServiceError,
    },
}) => {
    const crew = crews?.length > 0 ? crews[0] : { name: null, members: [] };
    return {
        authToken,
        crew,
        contactsState,
        hasViewedTutorial,
        crewUpdateState,
        loading: crewUpdateState === 'requested',
        textFriendsState: textFriends,
        profile,
        crewEnabled: settings.crewEnabled,
        showFlareServiceError,
    };
};

const mapDispatchToProps = {
    setCrewMembers: userActions.setCrewMembers,
    fetchContacts: userActions.fetchContacts,
    changeAppRoot: navActions.changeAppRoot,
    textFriendsRequest: userActions.textFriendsRequest,
    textFriendsReset: userActions.textFriendsReset,
    resetSetCrewMembers: userActions.resetSetCrewMembers,
    setCrewEnabled: userActions.setCrewEnabled,
    hideFlareServiceErrorAlert: userActions.hideFlareServiceErrorAlert,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Contacts);

export const openContactsScreen = componentId => {
    Navigation.push(componentId, {
        component: {
            name: 'com.flarejewelry.app.Contacts',
        },
    });
};

export { default as TextConfirm } from './TextConfirm';
