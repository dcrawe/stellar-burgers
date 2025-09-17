import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '@services/store';
import { selectConstructorItems } from '@selectors/constructor';
import { selectOrderModalData, selectOrderRequest } from '@selectors/orders';
import { createOrder, clearOrderModal } from '@slices/ordersSlice';
import { clearConstructor } from '@slices/constructorSlice';
import { getCookie } from '@utils/cookie';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems =
    useSelector(selectConstructorItems) ||
    ({ bun: null, ingredients: [] } as {
      bun: TIngredient | null;
      ingredients: TConstructorIngredient[];
    });
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);

  const onOrderClick = () => {
    const isAuthenticated = Boolean(getCookie('accessToken'));

    if (!isAuthenticated) {
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }
    if (!constructorItems.bun || orderRequest) return;

    const ingredientIds: string[] = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i: TConstructorIngredient) => i._id),
      constructorItems.bun._id
    ];
    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      (constructorItems.ingredients || []).reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
