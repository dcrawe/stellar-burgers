import reducer, {
  fetchFeeds,
  fetchUserOrders,
  createOrder,
  fetchOrderByNumber,
  clearOrderModal
} from './ordersSlice';
import { TOrder, TOrdersData } from '@utils-types';

describe('Асинхронные редьюсеры ordersSlice', () => {
  const orderA: TOrder = {
    _id: 'o1',
    number: 111,
    name: 'Заказ A',
    ingredients: [],
    status: 'done',
    createdAt: '',
    updatedAt: ''
  } as any;

  const orderB: TOrder = {
    _id: 'o2',
    number: 222,
    name: 'Заказ B',
    ingredients: [],
    status: 'pending',
    createdAt: '',
    updatedAt: ''
  } as any;

  const feeds: TOrdersData = {
    orders: [orderA, orderB],
    total: 5,
    totalToday: 2
  };

  it('feed: pending/fulfilled/rejected', () => {
    let state = reducer(undefined, { type: fetchFeeds.pending.type });

    expect(state.feed.isLoading).toBe(true);
    expect(state.feed.error).toBeNull();

    state = reducer(state, { type: fetchFeeds.fulfilled.type, payload: feeds });

    expect(state.feed.orders).toEqual(feeds.orders);
    expect(state.feed.total).toBe(5);
    expect(state.feed.totalToday).toBe(2);
    expect(state.feed.isLoading).toBe(false);
    expect(state.feed.lastLoadedAt).not.toBeNull();

    const errorMessage = 'Ошибка загрузки ленты';

    state = reducer(state, {
      type: fetchFeeds.rejected.type,
      error: { message: errorMessage }
    } as any);

    expect(state.feed.isLoading).toBe(false);
    expect(state.feed.error).toBe(errorMessage);
  });

  it('profile orders: pending/fulfilled/rejected', () => {
    let state = reducer(undefined, { type: fetchUserOrders.pending.type });

    expect(state.profile.isLoading).toBe(true);
    expect(state.profile.error).toBeNull();

    state = reducer(state, {
      type: fetchUserOrders.fulfilled.type,
      payload: [orderA]
    });

    expect(state.profile.orders).toEqual([orderA]);
    expect(state.profile.isLoading).toBe(false);

    const errorMessage = 'Ошибка загрузки заказов пользователя';

    state = reducer(state, {
      type: fetchUserOrders.rejected.type,
      error: { message: errorMessage }
    } as any);

    expect(state.profile.isLoading).toBe(false);
    expect(state.profile.error).toBe(errorMessage);
  });

  it('createOrder: pending/fulfilled/rejected and clearOrderModal', () => {
    let state = reducer(undefined, { type: createOrder.pending.type });

    expect(state.orderRequest).toBe(true);
    expect(state.orderModalData).toBeNull();

    state = reducer(state, {
      type: createOrder.fulfilled.type,
      payload: orderB
    });

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(orderB);

    state = reducer(state, clearOrderModal());

    expect(state.orderModalData).toBeNull();
    expect(state.orderRequest).toBe(false);

    state = reducer(undefined, { type: createOrder.rejected.type });

    expect(state.orderRequest).toBe(false);
  });

  it('fetchOrderByNumber: pending/fulfilled/rejected', () => {
    let state = reducer(undefined, { type: fetchOrderByNumber.pending.type });

    expect(state.currentOrder).toBeNull();

    state = reducer(state, {
      type: fetchOrderByNumber.fulfilled.type,
      payload: orderA
    });

    expect(state.currentOrder).toEqual(orderA);

    state = reducer(state, { type: fetchOrderByNumber.rejected.type });

    expect(state.currentOrder).toBeNull();
  });
});
