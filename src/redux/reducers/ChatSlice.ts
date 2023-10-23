import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IChatResponse, IChat } from '../../types';
import axios from '../../axios';

interface ChatState {
    chats: IChatResponse[];
    isLoading: boolean;
    currentChat: IChatResponse | null;
    error: string;
}

const initialState: ChatState = {
    chats: [],
    isLoading: false,
    currentChat: null,
    error: '',
};

export const getChat = createAsyncThunk('chats/getChats', async (chat_id) => {
    const { data } = await axios.get(`/chats/${chat_id}`);
    return data;
});

export const getChats = createAsyncThunk('chats/getChats', async () => {
    const { data } = await axios.get('/chats/all');
    return data;
});

export const createChat = createAsyncThunk('chats/createChat', async (params: any) => {
    const { data } = await axios.post<IChat>('/chats', params);
    return data;
});

export const deleteChat = createAsyncThunk('chats/deleteChat', async (params: any) => {
    const { data } = await axios.delete(`/chats/${params}`);
    return data;
});

export const hideChat = createAsyncThunk('chats/hideChat', async (params: any) => {
    const { data } = await axios.patch(`/chats/`, params);
    console.log(data);
    return data;
});

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setCurrentChat(state, action) {
            const currentChat = state.chats.filter((el) => el.id === action.payload)[0];
            if (currentChat) {
                state.currentChat = currentChat;
            } else {
                state.currentChat = null;
            }
        },
    },
    extraReducers: {
        [getChats.pending.type]: (state, action: PayloadAction<IChatResponse[]>) => {
            state.isLoading = true;
        },
        [getChats.fulfilled.type]: (state, action: PayloadAction<IChatResponse[]>) => {
            state.isLoading = false;
            state.chats = action.payload;
            state.error = '';
        },
        [getChats.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [hideChat.pending.type]: (state, action: PayloadAction) => {
            state.isLoading = true;
        },
        [hideChat.fulfilled.type]: (state, action: PayloadAction<IChatResponse>) => {
            state.isLoading = false;
            console.log('123');
            state.chats = state.chats.map((el) => {
                if (el.id === action.payload.id) {
                    el.is_hidden = true;
                    return el;
                }
                return el;
            });
            state.error = '';
            console.log(state.chats);
        },
        [hideChat.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [deleteChat.pending.type]: (state, action: PayloadAction<IChatResponse[]>) => {
            state.isLoading = true;
        },
        [deleteChat.fulfilled.type]: (state, action: PayloadAction<IChatResponse[]>) => {
            state.isLoading = false;
            state.chats = action.payload;
            state.error = '';
        },
        [deleteChat.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
    },
});

export default chatSlice.reducer;
export const { setCurrentChat } = chatSlice.actions;
