import { SELECTORS } from '../support/selectors';
import { TEXTS } from '../support/texts';

describe('Страница конструктора бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
  });

  it('добавляет ингредиент из списка в конструктор', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.addIngredientToConstructor(TEXTS.bunN1);
    cy.addIngredientToConstructor(TEXTS.patty);

    cy.get(SELECTORS.burgerConstructor).within(() => {
      cy.contains(TEXTS.bunTop).should('be.visible');
      cy.contains(TEXTS.bunBottom).should('be.visible');
      cy.contains('li', TEXTS.patty).should('be.visible');
    });

    cy.contains('button', TEXTS.placeOrder).should('be.enabled');
  });

  it('открывает модальное окно ингредиента и закрывает его кнопкой закрытия и кликом по оверлею', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.addIngredientToConstructor(TEXTS.sauceX);
    cy.verifyIngredientInConstructor(TEXTS.sauceX);

    cy.contains('li', TEXTS.sauceX).find('a').click();

    cy.contains('h3', TEXTS.ingredientDetailsTitle).should('be.visible');
    cy.contains('.text_type_main-default', TEXTS.sauceX).should('be.visible');

    cy.closeModalByButton();
    cy.contains('h3', TEXTS.ingredientDetailsTitle).should('not.exist');

    cy.contains('li', TEXTS.sauceX).find('a').click();
    cy.contains('h3', TEXTS.ingredientDetailsTitle).should('be.visible');

    cy.closeModalByOverlay();
    cy.contains('h3', TEXTS.ingredientDetailsTitle).should('not.exist');

    cy.verifyIngredientInConstructor(TEXTS.sauceX);
  });

  it('создаёт заказ: открывает модальное окно заказа с корректным номером и очищает конструктор', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.loginByFakeTokens();

    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.addIngredientToConstructor(TEXTS.bunN1);
    cy.addIngredientToConstructor(TEXTS.patty);

    cy.contains('button', TEXTS.placeOrder).should('be.enabled').click();

    cy.wait('@createOrder');

    cy.contains('h3', TEXTS.orderInfoTitle).should('be.visible');
    cy.contains(TEXTS.orderNumber).should('be.visible');

    cy.get('div')
      .filter((_, el) => (el.textContent || '').includes(TEXTS.orderInfoTitle))
      .parents()
      .find('button')
      .first()
      .should('be.visible')
      .click();

    cy.contains('h3', TEXTS.orderInfoTitle).should('not.exist');
    cy.contains('button', TEXTS.placeOrder).should('be.disabled');
  });
});
