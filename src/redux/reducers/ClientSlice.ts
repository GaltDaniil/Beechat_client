import { createSlice, createAsyncThunk, PayloadAction, Slice } from '@reduxjs/toolkit';
import { IClient } from '../../types';
import axios from '../../axios';

interface ClientState {
    clients: IClient[];
    isLoading: boolean;
    error: string;
}

const initialState: ClientState = {
    clients: [],
    isLoading: false,
    error: '',
};

export const getClients = createAsyncThunk('chats/getClients', async () => {
    const { data } = await axios.get('/clients/');
    return data;
});

export const uploadCsv = createAsyncThunk('chats/createClient', async (params: any) => {
    await axios.post('/clients/importcsv', params);
});

export const clientSlice: Slice<ClientState, {}, 'clients'> = createSlice({
    name: 'clients',
    initialState,
    reducers: {},
    extraReducers: {
        [getClients.pending.type]: (state, action: PayloadAction<IClient[]>) => {
            state.isLoading = true;
        },
        [getClients.fulfilled.type]: (state, action: PayloadAction<IClient[]>) => {
            state.isLoading = false;
            state.clients = action.payload;
            state.error = '';
        },
        [getClients.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [uploadCsv.pending.type]: (state, action: PayloadAction) => {
            state.isLoading = true;
        },
        [uploadCsv.fulfilled.type]: (state, action: PayloadAction) => {
            state.isLoading = false;
            state.error = '';
        },
        [uploadCsv.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
    },
});

export default clientSlice.reducer;
