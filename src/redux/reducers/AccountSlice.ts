import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IAccount, IPipeline, IStage, IDealJoin } from '../../types';
import axios from '../../axios';

interface AccountState {
    account: IAccount | object;
    pipelines: IPipeline[];
    stages: IStage[];
    deals: IDealJoin[];
    isLoading: boolean;
    error: string;
}

const initialState: AccountState = {
    account: {},
    pipelines: [],
    stages: [],
    deals: [],
    isLoading: false,
    error: '',
};

export const getAccount = createAsyncThunk('account/getChats', async (id: number) => {
    const { data } = await axios.get('/accounts/1');
    return data;
});
export const getPipelines = createAsyncThunk('account/getPipelines', async (params: number) => {
    const { data } = await axios.get(`/pipelines/${params}`);
    return data;
});
export const getStages = createAsyncThunk('account/getStages', async (params: object) => {
    const { data } = await axios.post(`/stages/many`, params);
    return data;
});
export const getDeals = createAsyncThunk('account/getDeals', async (params: object) => {
    const { data } = await axios.post(`/deals/many`, params);
    return data;
});
export const updateDeal = createAsyncThunk('account/updateDeals', async (params: object) => {
    const { data } = await axios.post(`/deals/update`, params);
    return data;
});

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        changeStage(state, action) {
            const withChangedDeal = state.deals.map((deal) => {
                if (deal.id === action.payload.id) {
                    deal.stage_id = action.payload.stage_id;
                    return deal;
                }
                return deal;
            });
            state.deals = withChangedDeal.sort((a, b) => a.deal_order + b.deal_order);
        },
        sortStage(state) {
            console.log('stage обновлен');
            const withChangedDeal = state.deals.sort((a, b) => a.deal_order + b.deal_order);
            state.deals = withChangedDeal;
        },
        changeDealOrder(state, action) {
            const withChangedDeal = state.deals.map((deal) => {
                if (deal.id === action.payload.id) {
                    deal.deal_order = action.payload.deal_order;
                    return deal;
                }
                return deal;
            });
            state.deals = withChangedDeal.sort((a, b) => a.deal_order + b.deal_order);
        },
    },
    extraReducers: {
        [getAccount.pending.type]: (state, action: PayloadAction<IAccount>) => {
            state.isLoading = true;
        },
        [getAccount.fulfilled.type]: (state, action: PayloadAction<IAccount>) => {
            state.isLoading = false;
            state.account = action.payload;
            state.error = '';
        },
        [getAccount.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [getPipelines.pending.type]: (state, action: PayloadAction<IPipeline[]>) => {
            state.isLoading = true;
        },
        [getPipelines.fulfilled.type]: (state, action: PayloadAction<IPipeline[]>) => {
            state.isLoading = false;
            state.pipelines = action.payload;
            state.error = '';
        },
        [getPipelines.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [getStages.pending.type]: (state, action: PayloadAction<IStage[]>) => {
            state.isLoading = true;
        },
        [getStages.fulfilled.type]: (state, action: PayloadAction<IStage[]>) => {
            state.isLoading = false;
            state.stages = action.payload.sort((a, b) => a.stage_index - b.stage_index);
            state.error = '';
        },
        [getStages.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        [getDeals.pending.type]: (state, action: PayloadAction<IDealJoin[]>) => {
            state.isLoading = true;
        },
        [getDeals.fulfilled.type]: (state, action: PayloadAction<IDealJoin[]>) => {
            state.isLoading = false;
            state.deals = action.payload.sort((a, b) => a.deal_order - b.deal_order).reverse();
            state.error = '';
        },
        [getDeals.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
    },
});

export default accountSlice.reducer;
export const { changeStage, changeDealOrder, sortStage } = accountSlice.actions;
