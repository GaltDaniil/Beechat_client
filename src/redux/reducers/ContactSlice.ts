import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IContactResponse, IContact } from '../../types';
import axios from '../../axios';

interface ContactState {
    contacts: IContactResponse[];
    isLoading: boolean;
    currentContact: IContactResponse | null;
    error: string;
}

const initialState: ContactState = {
    contacts: [],
    isLoading: false,
    currentContact: null,
    error: '',
};

export const getOneContact = createAsyncThunk(
    'contacts/getContacts',
    async (contact_id: number) => {
        const { data } = await axios.get<IContact>(`/contacts/${contact_id}`);
        return data;
    },
);

export const getManyContacts = createAsyncThunk('contacts/getContacts', async () => {
    const { data } = await axios.get('/contacts/all');
    return data;
});

export const createContact = createAsyncThunk('contacts/createContact', async (params: any) => {
    const { data } = await axios.post<IContact>('/contacts', params);
    return data;
});

export const deleteContact = createAsyncThunk('contacts/deleteContact', async (params: any) => {
    const { data } = await axios.delete(`/contacts/${params}`);
    return data;
});

export const hideContact = createAsyncThunk('contacts/hideContact', async (params: any) => {
    const { data } = await axios.patch(`/contacts/`, params);
    console.log(data);
    return data;
});

export const contactSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {
        setCurrentContact(state, action) {
            const currentContact = state.contacts.filter((el) => el.id === action.payload)[0];
            if (currentContact) {
                state.currentContact = currentContact;
            } else {
                state.currentContact = null;
            }
        },
    },
    extraReducers: {
        [getManyContacts.pending.type]: (state, action: PayloadAction<IContactResponse[]>) => {
            state.isLoading = true;
        },
        [getManyContacts.fulfilled.type]: (state, action: PayloadAction<IContactResponse[]>) => {
            state.isLoading = false;
            state.contacts = action.payload;
            state.error = '';
        },
        [getManyContacts.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [hideContact.pending.type]: (state, action: PayloadAction) => {
            state.isLoading = true;
        },
        [hideContact.fulfilled.type]: (state, action: PayloadAction<IContactResponse>) => {
            state.isLoading = false;
            state.contacts = state.contacts.map((el) => {
                if (el.id === action.payload.id) {
                    el.is_hidden = true;
                    return el;
                }
                return el;
            });
            state.error = '';
        },
        [hideContact.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [deleteContact.pending.type]: (state, action: PayloadAction<IContactResponse[]>) => {
            state.isLoading = true;
        },
        [deleteContact.fulfilled.type]: (state, action: PayloadAction<IContactResponse[]>) => {
            state.isLoading = false;
            state.contacts = action.payload;
            state.error = '';
        },
        [deleteContact.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
    },
});

export default contactSlice.reducer;
export const { setCurrentContact } = contactSlice.actions;
