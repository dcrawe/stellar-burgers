import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { TIngredient, TOrder } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '@services/store';
import { selectIngredients } from '@selectors/ingredients';
import { selectOrderByNumber, selectCurrentOrder } from '@selectors/orders';
import { fetchOrderByNumber } from '@slices/ordersSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const parsedNumber = Number(number);
  const orderFromLists: TOrder | undefined = useSelector(
    selectOrderByNumber(parsedNumber)
  );
  const currentOrder = useSelector(selectCurrentOrder);
  const orderData = orderFromLists || currentOrder || null;

  useEffect(() => {
    if (!orderFromLists && parsedNumber) {
      dispatch(fetchOrderByNumber(parsedNumber));
    }
  }, [dispatch, orderFromLists, parsedNumber]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);

          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
