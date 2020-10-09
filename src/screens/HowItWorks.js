import * as React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import VideoPlayer from 'react-native-video-controls';

import Colors from '../bits/Colors';
import CloseButton from './CloseButton';
import Headline from './Onboarding/Headline';
import RoundedButton from '../bits/RoundedButton';
import GoldenRules from './Scenarios/GoldenRules';

const video1 = require('../assets/videos/product-demo-button-location.mp4');
const video2 = require('../assets/videos/product-demo-short-press.mp4');
const video3 = require('../assets/videos/product-demo-long-press.mp4');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.theme.white,
        alignItems: 'center',
    },
    shrink: {
        height: 32,
        flexShrink: 1,
    },
    headline: {
        alignSelf: 'center',
        textAlign: 'center',
        color: Colors.black,
        marginBottom: 10,
    },
    line: {
        height: 1,
        width: 33,
        marginVertical: 12,
        backgroundColor: Colors.black,
    },
    subhead: {
        flex: 1,
        width: 300,
        color: Colors.black,
        fontSize: 15,
        fontFamily: 'Nocturno Display Std',
        textAlign: 'center',
    },
    subheadView: {
        width: 300,
        height: 40,
        marginVertical: 20,
    },
    l: {
        alignSelf: 'flex-start',
        marginLeft: 32,
    },
    sectionhead: {
        color: Colors.black,
        fontSize: 20,
        fontFamily: 'Nocturno Display Std',
    },
    incomingCall: {
        marginTop: 12,
        width: 206,
        height: 134,
        marginBottom: 32,
    },
    r: {
        alignSelf: 'flex-end',
        marginRight: 32,
    },
    chatItem: {
        backgroundColor: Colors.white,
        borderRadius: 30,
        maxWidth: 240,
        padding: 16,
        marginTop: 16,
    },
    chatItemText: {
        color: Colors.black,
        fontSize: 14,
    },
    emojis: {
        marginTop: -10,
        fontSize: 20,
        paddingRight: 32,
    },
    grow: {
        flexGrow: 1,
        alignSelf: 'stretch',
    },
    button: {
        marginTop: 16,
        marginBottom: 24,
    },
    slide: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    slideImage: {
        width: '100%',
        resizeMode: 'contain',
        flex: 1,
    },
    videoPlayerStyle: {
        backgroundColor: 'white',
    },
});

const entries = [
    {
        subtitle: 'There’s a hidden button on the side of your bracelet.',
        image: video1,
    },
    {
        subtitle: 'Click once to get an automated call.',
        image: video2,
    },
    {
        subtitle:
            'Hold for 3 seconds to share your location with your Crew and 911 (optional).',
        image: video3,
    },
];

const HowItWorks = ({ componentId }) => {
    const [golden, setGolden] = React.useState(false);
    const [subtitleText, setSubtitleText] = React.useState(entries[0].subtitle);
    const [activeSlide, setActiveSlide] = React.useState(0);
    const showGolden = React.useCallback(() => {
        setGolden(true);
    }, []);

    const close = React.useCallback(() => {
        Navigation.dismissModal(componentId);
    }, [componentId]);

    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.slide} key={index}>
                {index === activeSlide && (
                    <VideoPlayer
                        source={item.image}
                        disableFullscreen
                        disablePlayPause
                        disableSeekbar
                        disableVolume
                        disableTimer
                        disableBack
                        showOnStart={0}
                        repeat
                        resizeMode="contain"
                        style={styles.videoPlayerStyle}
                    />
                )}
            </View>
        );
    };

    const onChangeItem = index => {
        setActiveSlide(index);
        setSubtitleText(entries[index].subtitle);
    };

    if (golden) {
        return <GoldenRules finishUp={close} />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <CloseButton black onPress={close} />
            <View style={styles.shrink} />
            <Headline style={styles.headline}>How It Works</Headline>
            <View style={styles.line} />
            <View style={styles.subheadView}>
                <Text style={styles.subhead}>{subtitleText}</Text>
            </View>
            <Carousel
                data={entries}
                renderItem={renderItem}
                sliderWidth={310}
                itemWidth={310}
                onSnapToItem={onChangeItem}
                pagingEnabled
            />
            <Pagination
                dotsLength={entries.length}
                activeDotIndex={activeSlide}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 4,
                    backgroundColor: Colors.black,
                    borderWidth: 1,
                    borderColor: Colors.black,
                }}
                inactiveDotStyle={{
                    backgroundColor: Colors.white,
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={1}
            />
            <RoundedButton
                onPress={showGolden}
                wrapperStyle={styles.button}
                text="Read More"
                width={240}
            />
        </SafeAreaView>
    );
};

export default HowItWorks;
