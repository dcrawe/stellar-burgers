import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserApi, updateUserApi, TRegisterData } from '@api';
import { TUser } from '@utils-types';
import type { RootState } from '@services/store';

export type UserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
  lastLoadedAt: number | null;
};

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
  lastLoadedAt: null
};

let userRequestLock = false;
let userLastStartAt = 0;
const USER_COOLDOWN_MS = 1500;

export const fetchUser = createAsyncThunk<TUser, void, { state: RootState }>(
  'user/fetchUser',
  async () => {
    const data = await getUserApi();
    return data.user;
  },
  {
    condition: (_: void, { getState }) => {
      if (userRequestLock) return false;

      const now = Date.now();

      if (now - userLastStartAt < USER_COOLDOWN_MS) return false;

      const { isLoading } = getState().user;

      if (isLoading) return false;

      userRequestLock = true;
      userLastStartAt = now;

      return true;
    }
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/updateUser',
  async (payload) => {
    const data = await updateUserApi(payload);

    return data.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser(state) {
      state.user = null;
      state.isAuthChecked = false;
      state.isLoading = false;
      state.error = null;
      state.lastLoadedAt = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
        state.lastLoadedAt = Date.now();
        userRequestLock = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true; // even if failed, we've checked
        state.error = action.error.message || 'Ошибка загрузки пользователя';
        userRequestLock = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка обновления пользователя';
      });
  }
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
