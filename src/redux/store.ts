import { combineReducers, configureStore } from '@reduxjs/toolkit';
import chatReducer from './reducers/ChatSlice';
import clientReducer from './reducers/ClientSlice';
import accountReducer from './reducers/AccountSlice';
import messageReducer from './reducers/MessageSlice';

const rootReducer = combineReducers({
    chatReducer,
    clientReducer,
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
