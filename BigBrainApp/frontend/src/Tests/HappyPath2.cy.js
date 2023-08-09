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
    // Maybe  remove input if it doesn't work
    cy.get('input[name="register-name"]')
      .focus()
      .type('Ricky');
    cy.get('input[name="register-email"]')
      .focus()
      .type('example2@email.com');
    cy.get('input[name="register-password"]')
      .focus()
      .type('strongpassword2222');

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
      .type('History');
    cy.get('button[name="confirm-new-game"]')
      .click();
    // click on the edit game button
    cy.get('[name="edit-page-link"]')
      .click();
    // You are now in the edit game page
    window.Cypress.minimatch(window.location.href, 'http://localhost:3000/Dashboard/*');

    // now create a new quiz question
    cy.get('input[name="type-new-question"]')
      .focus()
      .type('Question 1');
    cy.get('button[name="add-new-question"]')
      .click();

    // now edit the question
    cy.get('[name="edit-question"]')
      .click();

    // we are now in the edit question page
    window.Cypress.minimatch(window.location.href, 'http://localhost:3000/Dashboard/*/*');
    cy.get('[name="multiple"]')
      .click();
    cy.get('input[name="new-question"]').clear()
      .focus()
      .type('What year is this?');
    cy.get('input[name="time-duration"]').clear()
      .focus()
      .type('30');
    cy.get('input[name="points"]').clear()
      .focus()
      .type('100');
    cy.get('input[name="answers"]')
      .focus()
      .type('2020');
    cy.get('button[name="add-answer"]')
      .click();
    cy.get('input[name="answers"]')
      .focus()
      .type('2021');
    cy.get('button[name="add-answer"]')
      .click();
    cy.get('input[name="answers"]')
      .focus()
      .type('2022');
    cy.get('button[name="add-answer"]')
      .click();
    cy.get('input[name="answers"]')
      .focus()
      .type('2023');
    cy.get('button[name="add-answer"]')
      .click();
    cy.contains('2023')
      .click();
    cy.get('button[name="edit-question-submit"]')
      .click();
    window.Cypress.minimatch(window.location.href, 'http://localhost:3000/Dashboard/*');

    // after making the question, delete the question
    cy.get('[name="delete-question"]')
      .click();

    // now logout
    cy.get('button[name="valid-token-logout"]')
      .click();
    cy.url().should('include', 'localhost:3000/');
  });
});
