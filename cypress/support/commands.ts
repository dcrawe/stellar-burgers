import { SELECTORS } from './selectors';
import { TEXTS } from './texts';

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      loginByFakeTokens(): Chainable<void>;
      addIngredientToConstructor(ingredientName: string): Chainable<void>;
      closeModalByButton(): Chainable<void>;
      closeModalByOverlay(): Chainable<void>;
      verifyIngredientInConstructor(ingredientName: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginByFakeTokens', () => {
  window.localStorage.setItem('refreshToken', 'FAKE_REFRESH_TOKEN');
  cy.setCookie('accessToken', 'FAKE_ACCESS_TOKEN');
});

Cypress.Commands.add('addIngredientToConstructor', (ingredientName: string) => {
  cy.contains('li', ingredientName).within(() => {
    cy.contains('button', TEXTS.addButton).click();
  });
});

Cypress.Commands.add('closeModalByButton', () => {
  cy.get(SELECTORS.modalCloseButton).as('modalCloseBtn');
  cy.get('@modalCloseBtn').click({ force: true });
});

Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get(SELECTORS.modalOverlay).as('modalOverlay');
  cy.get('@modalOverlay').click({ force: true });
});

Cypress.Commands.add(
  'verifyIngredientInConstructor',
  (ingredientName: string) => {
    cy.get(SELECTORS.burgerConstructor).as('burgerConstructor');
    cy.get('@burgerConstructor').within(() => {
      cy.contains('li', ingredientName).should('be.visible');
    });
  }
);
