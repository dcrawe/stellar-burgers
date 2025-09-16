import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '@ui';
import { useSelector } from '@services/store';
import { selectConstructorItems } from '@selectors/constructor';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const burgerConstructor =
    useSelector(selectConstructorItems) ||
    ({ bun: null, ingredients: [] } as {
      bun: TIngredient | null;
      ingredients: TIngredient[];
    });

  const ingredientsCounters = useMemo(() => {
    const bun = burgerConstructor.bun;
    const items = burgerConstructor.ingredients || [];
    const counters: { [key: string]: number } = {};

    items.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    if (bun) counters[bun._id] = 2;

    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
