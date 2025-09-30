export {};

declare global {
  namespace Cypress {
    interface Chainable {
      loginByFakeTokens(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginByFakeTokens', () => {
  window.localStorage.setItem('refreshToken', 'FAKE_REFRESH_TOKEN');
  cy.setCookie('accessToken', 'FAKE_ACCESS_TOKEN');
});
