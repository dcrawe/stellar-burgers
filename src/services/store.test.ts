import { rootReducer } from '@services/store';

describe('rootReducer', () => {
  it('возвращает начальное состояние при вызове с неопределённым состоянием и неизвестным действием', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        items: [],
        isLoading: false,
        error: null,
        lastLoadedAt: null
      },
      orders: {
        feed: {
          orders: [],
          total: 0,
          totalToday: 0,
          isLoading: false,
          error: null,
          lastLoadedAt: null
        },
        profile: { orders: [], isLoading: false, error: null },
        orderRequest: false,
        orderModalData: null,
        currentOrder: null
      },
      burgerConstructor: { bun: null, ingredients: [] },
      user: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null,
        lastLoadedAt: null
      }
    });
  });
});
