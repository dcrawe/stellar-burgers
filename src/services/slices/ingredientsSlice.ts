import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';
import type { RootState } from '@services/store';

export type IngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
  lastLoadedAt: number | null;
};

const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null,
  lastLoadedAt: null
};

let ingredientsRequestLock = false;
let ingredientsLastStartAt = 0;

const INGREDIENTS_COOLDOWN_MS = 1500;

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { state: RootState }
>('ingredients/fetchAll', getIngredientsApi, {
  condition: (_: void, { getState }) => {
    if (ingredientsRequestLock) return false;

    const now = Date.now();

    if (now - ingredientsLastStartAt < INGREDIENTS_COOLDOWN_MS) return false;

    const { isLoading } = getState().ingredients;

    if (isLoading) return false;

    ingredientsRequestLock = true;
    ingredientsLastStartAt = now;

    return true;
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredients(state, action: PayloadAction<TIngredient[]>) {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.items = action.payload;
          state.lastLoadedAt = Date.now();
          state.isLoading = false;
          ingredientsRequestLock = false;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
        ingredientsRequestLock = false;
      });
  }
});

export const { setIngredients } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
