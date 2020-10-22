/* eslint-disable no-console */
import * as React from 'react';
import { SafeAreaView, StatusBar, Text } from 'react-native';
import { connect } from 'react-redux';
import isPlainObject from 'lodash/isPlainObject';
import { Navigation } from 'react-native-navigation';
import * as userActions from '../../actions/userActions';
import RadioGroup from './RadioGroup';
import { useNavigationButtonCallback } from '../../bits/useNavigationCallback';
import { confirmClose, navOptions, saveButton, styles } from './styles';
import { getCallSound, getCallScriptName } from '../../helpers/callScripts';

let currentSoundClip;

const SettingsCall = ({
    authToken,
    savingSetting,
    savedCallScript,
    setCallScript,
    callScripts,
    componentId,
    sawCallScripts,
}) => {
    const [dirty, setDirty] = React.useState(false);
    const [didSave, setDidSave] = React.useState(false);
    const [currentCallScript, setCurrentCallScript] = React.useState(
        savedCallScript
    );
    const [currentlyPlaying, setCurrentlyPlaying] = React.useState();

    React.useEffect(() => {
        if (currentlyPlaying !== undefined) {
            if (currentSoundClip !== undefined) currentSoundClip.stop();

            const name = getCallScriptName(currentlyPlaying);
            console.debug('Edited Currently Playing', name);
            getCallSound(name).then(soundClip => {
                currentSoundClip = soundClip;
                if (currentSoundClip !== undefined) currentSoundClip.play();
                else setCurrentlyPlaying();
            });
        }
    }, [currentlyPlaying, callScripts, savedCallScript]);

    const clearPlaying = React.useCallback(() => {
        if (currentSoundClip !== undefined) currentSoundClip.stop();
        setCurrentlyPlaying();
    }, []);

    const onCallScriptSelected = React.useCallback(script => {
        setCurrentCallScript(script);
        setDirty(true);
    }, []);

    const saveCallScript = React.useCallback(() => {
        if (currentSoundClip !== undefined) currentSoundClip.stop();
        setCurrentlyPlaying();
        setCallScript(authToken, currentCallScript);
        setDirty(false);
        setDidSave(true);
    }, [setCallScript, authToken, currentCallScript]);

    React.useEffect(() => {
        sawCallScripts();
    }, [sawCallScripts, authToken]);

    React.useEffect(() => {
        if (didSave && !savingSetting) {
            Navigation.pop(componentId);
        }
    }, [savingSetting, componentId, didSave]);

    React.useEffect(() => {
        Navigation.mergeOptions(componentId, {
            topBar: {
                rightButtons: dirty ? [saveButton] : [],
            },
        });
    }, [componentId, dirty]);

    useNavigationButtonCallback(
        ({ buttonId }) => {
            if (currentSoundClip !== undefined) currentSoundClip.stop();
            switch (buttonId) {
                case 'backButton':
                    confirmClose(dirty, componentId);
                    break;
                case 'save':
                    saveCallScript();
                    break;
                default:
                    break;
            }
        },
        [saveCallScript, dirty, componentId]
    );

    const pickerItems = React.useMemo(() => {
        if (isPlainObject(callScripts)) {
            const items = Object.values(callScripts).map(
                ({
                    script_name: label,
                    script_id: key,
                    preview_url: preview,
                }) => ({
                    key,
                    label,
                    preview,
                })
            );
            return items;
        } else {
            return [];
        }
    }, [callScripts]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.subhead}>Select what you’ll hear</Text>
            <RadioGroup
                items={pickerItems}
                selectedItem={currentCallScript}
                onSelected={onCallScriptSelected}
                onPlay={setCurrentlyPlaying}
                onStop={clearPlaying}
                playingPreview={currentlyPlaying}
            />
            <Text style={styles.explain}>
                Select which call you’ll hear when you press the button on your
                bracelet once.
            </Text>
        </SafeAreaView>
    );
};

SettingsCall.options = () => navOptions('Call recording');

const mapStateToProps = ({
    user: { authToken, callScript, callScripts, savingSetting },
}) => ({
    authToken,
    savedCallScript: callScript,
    callScripts,
    savingSetting,
});

const mapDispatchToProps = {
    setCallScript: userActions.setCallScript,
    sawCallScripts: userActions.sawCallScripts,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsCall);
