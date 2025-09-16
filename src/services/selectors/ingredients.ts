import { RootState } from '../store';
import { TIngredient } from '@utils-types';
import { createSelector } from '@reduxjs/toolkit';

export const selectIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.items;

export const selectIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.isLoading;

const selectItems = (state: RootState): TIngredient[] =>
  state.ingredients.items;

export const selectBuns = createSelector([selectItems], (items) =>
  items.filter((i) => i.type === 'bun')
);

export const selectMains = createSelector([selectItems], (items) =>
  items.filter((i) => i.type === 'main')
);

export const selectSauces = createSelector([selectItems], (items) =>
  items.filter((i) => i.type === 'sauce')
);
