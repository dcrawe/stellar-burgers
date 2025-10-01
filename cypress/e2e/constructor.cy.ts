describe('Страница конструктора бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
  });

  it('добавляет ингредиент из списка в конструктор', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.contains('li', 'Булка N1').within(() => {
      cy.contains('button', 'Добавить').click();
    });
    cy.contains('li', 'Котлета').within(() => {
      cy.contains('button', 'Добавить').click();
    });

    cy.get('[data-testid="burger-constructor"]').within(() => {
      cy.contains('Булка N1 (верх)').should('be.visible');
      cy.contains('Булка N1 (низ)').should('be.visible');
      cy.contains('li', 'Котлета').should('be.visible');
    });

    cy.contains('Оформить заказ').should('be.enabled');
  });

  it('открывает модальное окно ингредиента и закрывает его кнопкой закрытия и кликом по оверлею', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.contains('li', 'Соус X').within(() => {
      cy.contains('button', 'Добавить').click();
    });

    cy.get('[data-testid="burger-constructor"]').within(() => {
      cy.contains('li', 'Соус X').should('be.visible');
    });

    cy.contains('li', 'Соус X').find('a').click();

    cy.contains('h3', 'Детали ингредиента').should('be.visible');
    cy.contains('.text_type_main-default', 'Соус X').should('be.visible');

    cy.get('button[aria-label="Закрыть модальное окно"]').click({ force: true });
    cy.contains('h3', 'Детали ингредиента').should('not.exist');

    cy.contains('li', 'Соус X').find('a').click();
    cy.contains('h3', 'Детали ингредиента').should('be.visible');

    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.contains('h3', 'Детали ингредиента').should('not.exist');

    cy.get('[data-testid="burger-constructor"]').within(() => {
      cy.contains('li', 'Соус X').should('be.visible');
    });
  });

  it('создаёт заказ: открывает модальное окно заказа с корректным номером и очищает конструктор', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.loginByFakeTokens();

    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.contains('li', 'Булка N1').within(() => {
      cy.contains('button', 'Добавить').click();
    });
    cy.contains('li', 'Котлета').within(() => {
      cy.contains('button', 'Добавить').click();
    });

    cy.contains('button', 'Оформить заказ').click();

    cy.wait('@createOrder');

    cy.contains('h3', 'Информация о заказе').should('be.visible');
    cy.contains('424242').should('be.visible');

    cy.get('div')
      .filter((_, el) => (el.textContent || '').includes('Информация о заказе'))
      .parents()
      .find('button')
      .first()
      .click({ force: true });

    cy.contains('h3', 'Информация о заказе').should('not.exist');
    cy.contains('button', 'Оформить заказ').should('be.disabled');
  });
});
