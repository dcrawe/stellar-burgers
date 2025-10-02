import reducer, { fetchUser, updateUser, clearUser } from './userSlice';
import { TUser } from '@utils-types';

describe('Асинхронные редьюсеры userSlice', () => {
  const user: TUser = {
    email: 'test@example.com',
    name: 'Tester'
  } as any;

  it('fetchUser: pending/fulfilled/rejected', () => {
    let state = reducer(undefined, { type: fetchUser.pending.type });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();

    state = reducer(state, { type: fetchUser.fulfilled.type, payload: user });

    expect(state.user).toEqual(user);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.lastLoadedAt).not.toBeNull();

    const errorMessage = 'Ошибка загрузки пользователя';

    state = reducer(state, {
      type: fetchUser.rejected.type,
      error: { message: errorMessage }
    } as any);

    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe(errorMessage);
  });

  it('updateUser: pending/fulfilled/rejected', () => {
    let state = reducer(undefined, { type: updateUser.pending.type });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();

    const updated: TUser = { ...user, name: 'Updated' } as any;

    state = reducer(state, {
      type: updateUser.fulfilled.type,
      payload: updated
    });

    expect(state.user).toEqual(updated);
    expect(state.isLoading).toBe(false);

    const errorMessage = 'Ошибка обновления пользователя';

    state = reducer(state, {
      type: updateUser.rejected.type,
      error: { message: errorMessage }
    } as any);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('clearUser: сбрасывает состояние', () => {
    const prevState = reducer(undefined, {
      type: fetchUser.fulfilled.type,
      payload: user
    });

    const state = reducer(prevState, clearUser());

    expect(state).toEqual({
      user: null,
      isAuthChecked: false,
      isLoading: false,
      error: null,
      lastLoadedAt: null
    });
  });
});
