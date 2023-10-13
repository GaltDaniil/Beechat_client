//@ts-ignore
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IMessage } from '../../types';
import axios from '../../axios';

interface MessageState {
    messages: IMessage[];
    isLoading: boolean;
    error: string;
}

const initialState: MessageState = {
    messages: [],
    isLoading: true,
    error: '',
};

export const readOneMessages = createAsyncThunk('messages/readOne', async (params: number) => {
    const { data } = await axios.put(`/messages/${params}`);
    return data;
});

export const getAndReadMessages = createAsyncThunk(
    'messages/getMessages',
    async (params: number) => {
        const { data } = await axios.put(`/messages/many/${params}`);
        return data;
    },
);

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        addNewMessage(state, action) {
            console.log('это в слайсе', action.payload);
            state.messages = [...state.messages, action.payload];
        },
    },
    extraReducers: {
        [getAndReadMessages.pending.type]: (state, action: PayloadAction<IMessage[]>) => {
            state.isLoading = true;
        },
        [getAndReadMessages.fulfilled.type]: (state, action: PayloadAction<IMessage[]>) => {
            state.isLoading = false;
            state.messages = action.payload;
            state.error = '';
        },
        [getAndReadMessages.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
    },
});

export default messageSlice.reducer;
export const { addNewMessage } = messageSlice.actions;
