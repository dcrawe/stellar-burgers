import reducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('Асинхронные редьюсеры ingredientsSlice', () => {
  const ingredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Bun',
      type: 'bun',
      proteins: 1,
      fat: 1,
      carbohydrates: 1,
      calories: 1,
      price: 100,
      image: '',
      image_large: '',
      image_mobile: ''
    },
    {
      _id: '2',
      name: 'Sauce',
      type: 'sauce',
      proteins: 1,
      fat: 1,
      carbohydrates: 1,
      calories: 1,
      price: 50,
      image: '',
      image_large: '',
      image_mobile: ''
    }
  ];

  it('корректно обрабатывает состояние pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(undefined, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('корректно обрабатывает состояние fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: ingredients
    };
    const state = reducer(
      { items: [], isLoading: true, error: null, lastLoadedAt: null },
      action
    );

    expect(state.items).toEqual(ingredients);
    expect(state.isLoading).toBe(false);
    expect(state.lastLoadedAt).not.toBeNull();
  });

  it('корректно обрабатывает состояние rejected', () => {
    const errorMessage = 'Network error';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = reducer(
      { items: [], isLoading: true, error: null, lastLoadedAt: null },
      action as any
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
