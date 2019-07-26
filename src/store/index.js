/* eslint-disable global-require */
/* eslint-disable no-undef */
import { createStore, applyMiddleware, compose } from 'redux';
import { persistCombineReducers } from 'redux-persist';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import * as reducers from '../reducers/index';
import { seamlessImmutableReconciler, seamlessImmutableTransformCreator } from 'redux-persist-seamless-immutable';
import { REDUX_LOGGING, summary } from '../constants';
import AsyncStorage from '@react-native-community/async-storage';

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
        user: ['profile', 'crews', 'devices', 'authToken', 'radioToken', 'settings', 'hasActiveFlare', 'role'],
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
    const enhancer = compose(applyMiddleware(...middleware));
    return createStore(combinedReducer, initialState, enhancer);
}
