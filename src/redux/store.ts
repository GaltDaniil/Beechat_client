import { combineReducers, configureStore } from '@reduxjs/toolkit';
import contactReducer from './reducers/ContactSlice';
/* import clientReducer from '../../next/ClientSlice'; */
import accountReducer from './reducers/AccountSlice';
import messageReducer from './reducers/MessageSlice';

const rootReducer = combineReducers({
    contactReducer,
    accountReducer,
    messageReducer,
});

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
    });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
