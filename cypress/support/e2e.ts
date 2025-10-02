import './commands';

beforeEach(() => {
  window.localStorage.removeItem('refreshToken');
  cy.clearCookie('accessToken');
});

afterEach(() => {
  window.localStorage.removeItem('refreshToken');
  cy.clearCookie('accessToken');
});
