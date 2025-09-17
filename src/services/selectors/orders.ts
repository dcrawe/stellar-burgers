import { RootState } from '../store';
import { TOrder } from '@utils-types';
import { createSelector } from '@reduxjs/toolkit';

export const selectFeedOrders = (state: RootState): TOrder[] =>
  state.orders.feed.orders;

const selectFeedTotal = (state: RootState) => state.orders.feed.total;
const selectFeedTotalToday = (state: RootState) => state.orders.feed.totalToday;

export const selectFeedTotals = createSelector(
  [selectFeedTotal, selectFeedTotalToday],
  (total, totalToday) => ({ total, totalToday })
);

export const selectFeedLoading = (state: RootState): boolean =>
  state.orders.feed.isLoading;

export const selectProfileOrders = (state: RootState): TOrder[] =>
  state.orders.profile.orders;

export const selectOrderRequest = (state: RootState): boolean =>
  state.orders.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.orders.orderModalData;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;

export const selectOrderByNumber =
  (number: number) =>
  (state: RootState): TOrder | undefined =>
    state.orders.feed.orders.find((o) => o.number === number) ||
    state.orders.profile.orders.find((o) => o.number === number);
