/* eslint-disable global-require */
/* eslint-disable no-undef */
import { createStore, applyMiddleware } from 'redux';
import { persistCombineReducers } from 'redux-persist';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {
    seamlessImmutableReconciler,
    seamlessImmutableTransformCreator,
} from 'redux-persist-seamless-immutable';
import AsyncStorage from '@react-native-community/async-storage';
import { composeWithDevTools } from 'redux-devtools-extension';

import * as reducers from '../reducers/index';
import { REDUX_LOGGING, summary } from '../constants/Config';

let middleware = [thunk];

console.log(`App configuration ${JSON.stringify(summary)}`);

if (__DEV__ && REDUX_LOGGING) {
    middleware = [...middleware, logger];
} else {
    middleware = [...middleware];
}

const transformerConfig = {
    whitelistPerReducer: {
        nav: ['root'],
        user: [
            'profile',
            'crews',
            'devices',
            'analyticsToken',
            'authToken',
            'radioToken',
            'settings',
            'hasActiveFlare',
            'hasViewedTutorial',
            'role',
        ],
        beacons: ['latest', 'problems'],
    },
};

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    stateReconciler: seamlessImmutableReconciler,
    transforms: [seamlessImmutableTransformCreator(transformerConfig)],
    version: 1,
    debug: !!__DEV__,
};
const combinedReducer = persistCombineReducers(persistConfig, reducers);

// eslint-disable-next-line
export function configureStore(initialState) {
    const enhancer = composeWithDevTools(applyMiddleware(...middleware));
    return createStore(combinedReducer, initialState, enhancer);
}
