import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  setBun,
  clearConstructor
} from './constructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

describe('Редьюсер burgerConstructor', () => {
  const bun: TIngredient = {
    _id: 'bun1',
    name: 'Bun',
    type: 'bun',
    proteins: 10,
    fat: 1,
    carbohydrates: 20,
    calories: 200,
    price: 100,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  const ingA: TConstructorIngredient = {
    id: 'a1',
    _id: 'i1',
    name: 'A',
    type: 'main',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 1,
    image: '',
    image_large: '',
    image_mobile: ''
  };
  const ingB: TConstructorIngredient = {
    id: 'b2',
    _id: 'i2',
    name: 'B',
    type: 'main',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 1,
    image: '',
    image_large: '',
    image_mobile: ''
  };
  const ingC: TConstructorIngredient = {
    id: 'c3',
    _id: 'i3',
    name: 'C',
    type: 'main',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 1,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  it('корректно обрабатывает setBun и clearConstructor', () => {
    let state = reducer(undefined, { type: 'UNKNOWN' });

    state = reducer(state, setBun(bun));

    expect(state.bun).toEqual(bun);

    state = reducer(state, clearConstructor());

    expect(state).toEqual({ bun: null, ingredients: [] });
  });

  it('корректно обрабатывает addIngredient и removeIngredient', () => {
    let state = reducer(undefined, addIngredient(ingA));

    state = reducer(state, addIngredient(ingB));

    expect(state.ingredients).toHaveLength(2);

    state = reducer(state, removeIngredient(ingA.id));

    expect(state.ingredients).toEqual([ingB]);
  });

  it('корректно обрабатывает moveIngredient', () => {
    let state = reducer(undefined, addIngredient(ingA));

    state = reducer(state, addIngredient(ingB));
    state = reducer(state, addIngredient(ingC));
    state = reducer(state, moveIngredient({ from: 0, to: 2 }));

    expect(state.ingredients.map((i) => i.id)).toEqual(['b2', 'c3', 'a1']);

    state = reducer(state, moveIngredient({ from: 1, to: 0 }));

    expect(state.ingredients.map((i) => i.id)).toEqual(['c3', 'b2', 'a1']);
  });
});
