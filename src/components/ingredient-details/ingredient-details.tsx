import { FC } from 'react';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';
import { useSelector } from '@services/store';
import { selectIngredients } from '@selectors/ingredients';

export const IngredientDetails: FC = () => {
  const { id } = useParams();

  const ingredients = useSelector(selectIngredients);

  const ingredientData = ingredients.find((i) => i._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
