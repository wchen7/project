require('cypress-plugin-tab');
const cy = window.cy;
describe('admin happy path', () => {
  // navigate to the home page
  it('should navigate to the home page', () => {
    cy.visit('localhost:3000/');
    cy.url().should('include', 'localhost:3000/');

    // navigate to the register screen

    cy.get('button[name="register-button"]')
      .click();
    cy.url().should('include', 'localhost:3000/Register');

    // enter name, email, password, click register
    // Maybe remove input if it doesn't work
    cy.get('input[name="register-name"]')
      .focus()
      .type('Ricky');
    cy.get('input[name="register-email"]')
      .focus()
      .type('example@email.com');
    cy.get('input[name="register-password"]')
      .focus()
      .type('strongpassword222');

    // navigates to dashboard
    cy.get('button[name="register-submit"]')
      .click();
    cy.wait(4000);
    cy.window();
    cy.get('button[name="close-alert"]')
      .click();
    cy.url().should('include', 'localhost:3000/Dashboard');

    // create a new game
    cy.get('button[name="new-game-button"]')
      .click()
      .tab()
    // cy.get('input[name="new-game-input"]')
      .type('Geography');
    cy.get('button[name="confirm-new-game"]')
      .click();

    // Start and end a new game
    cy.get('button[name="play"]')
      .click();
    cy.get('button[name="cancel-popup"]')
      .click();
    cy.get('button[name="stop"]')
      .click();
    // cy.get('button[name="results-yes"]')
    cy.contains('Yes')
      .click();
    // check if we are at the results page
    window.Cypress.minimatch(window.location.href, 'http://localhost:3000/Dashboard/Results/*');
    // cy.url().should('include', 'localhost:3000/Dashboard/1');

    // log out
    cy.get('button[name="valid-token-logout"]')
      .click();
    cy.url().should('include', 'localhost:3000/');

    // login
    cy.get('button[name="login-button"]')
      .click();
    cy.url().should('include', 'localhost:3000/Login');
    // enter login inputs
    cy.get('input[name="login-email"]')
      .focus()
      .type('example@email.com');
    cy.get('input[name="login-password"]')
      .focus()
      .type('strongpassword222');
    // go back to dashboard
    // cy.get('button[name="submit-login"]')
    cy.contains('Login')
      .click();
    cy.get('button[name="close-alert"]')
      .click();
    cy.url().should('include', 'localhost:3000/Dashboard');
  });
});
