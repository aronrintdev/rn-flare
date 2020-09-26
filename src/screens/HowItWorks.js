import * as React from 'react';
import {
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import Colors from '../bits/Colors';
import CloseButton from './CloseButton';
import Headline from './Onboarding/Headline';
import LongPressGif from '../assets/LongPressGif3Seconds.gif';
import PeriwinkleButton from '../assets/PeriwinkleButtonPress.gif';

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
        width: 300,
        color: Colors.black,
        fontSize: 15,
        fontFamily: 'Nocturno Display Std',
        textAlign: 'center',
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
    },
    slideImage: {
        width: '100%',
        resizeMode: 'contain',
        flex: 1,
    },
});

const subTitles = ['Tap for a call', 'Hold for your crew'];

const HowItWorks = ({ componentId }) => {
    const [subtitleText, setSubtitleText] = React.useState(subTitles[0]);
    const [activeSlide, setActiveSlide] = React.useState(0);
    const close = React.useCallback(() => {
        Navigation.dismissModal(componentId);
    }, [componentId]);

    const entries = [
        {
            image: LongPressGif,
        },
        {
            image: PeriwinkleButton,
        },
    ];

    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.slide} key={index}>
                <Image style={styles.slideImage} source={item.image} />
            </View>
        );
    };

    const onChangeItem = index => {
        setActiveSlide(index);
        setSubtitleText(subTitles[index]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <CloseButton black onPress={close} />
            <View style={styles.shrink} />
            <Headline style={styles.headline}>How It Works</Headline>
            <View style={styles.line} />
            <Text style={styles.subhead}>{subtitleText}</Text>
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
        </SafeAreaView>
    );
};

export default HowItWorks;
