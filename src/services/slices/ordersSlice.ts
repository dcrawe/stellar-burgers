import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '@api';
import { TOrder, TOrdersData } from '@utils-types';

export type OrdersState = {
  feed: {
    orders: TOrder[];
    total: number;
    totalToday: number;
    isLoading: boolean;
    error: string | null;
  };
  profile: {
    orders: TOrder[];
    isLoading: boolean;
    error: string | null;
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  currentOrder: TOrder | null;
};

const initialState: OrdersState = {
  feed: { orders: [], total: 0, totalToday: 0, isLoading: false, error: null },
  profile: { orders: [], isLoading: false, error: null },
  orderRequest: false,
  orderModalData: null,
  currentOrder: null
};

export const fetchFeeds = createAsyncThunk<TOrdersData>(
  'orders/fetchFeeds',
  async () => {
    const data = await getFeedsApi();

    return data;
  }
);

export const fetchUserOrders = createAsyncThunk<TOrder[]>(
  'orders/fetchUserOrders',
  async () => {
    const orders = await getOrdersApi();

    return orders;
  }
);

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'orders/createOrder',
  async (ingredientIds) => {
    const data = await orderBurgerApi(ingredientIds);

    return data.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'orders/fetchOrderByNumber',
  async (number) => {
    const data = await getOrderByNumberApi(number);

    return data.orders[0];
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderModal(state) {
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.feed.isLoading = true;
        state.feed.error = null;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.feed.orders = action.payload.orders;
          state.feed.total = action.payload.total;
          state.feed.totalToday = action.payload.totalToday;
          state.feed.isLoading = false;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.feed.isLoading = false;
        state.feed.error = action.error.message || 'Ошибка загрузки ленты';
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.profile.isLoading = true;
        state.profile.error = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.profile.orders = action.payload;
          state.profile.isLoading = false;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.profile.isLoading = false;
        state.profile.error =
          action.error.message || 'Ошибка загрузки заказов пользователя';
      })

      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.orderModalData = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrder = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.currentOrder = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state) => {
        state.currentOrder = null;
      });
  }
});

export const { clearOrderModal } = ordersSlice.actions;
export default ordersSlice.reducer;
