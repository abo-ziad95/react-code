/// <reference types="cypress" />

describe("Transaction Description", () => {

  const url = {
    auth: "https://cognito-identity.us-west-2.amazonaws.com/",
    root: "http://localhost:3000/",
    route: "http://localhost:3000/settings",
  };

  const selectors = {
    auth: {
      passwordInput: '[data-test="sign-in-password-input"]',
      signInButton: '[data-test="sign-in-sign-in-button"]',
      usernameInput: '[data-test="username-input"]',
    },
    descriptionButton: '#linkToJob'
  };

  beforeEach(function() {
    cy.fixture("credentials")
      .then((credentials) => {
        this.credentials = credentials;
      });
    cy.visit(url.root);
  });

  it("Allows a user to go to transactions and click on job view", function()  {
    cy.server().route("POST", url.auth).as('root');

    // Step 1: Login as an organization
    cy.get(selectors.auth.usernameInput).type(this.credentials.userName);
    cy.get(selectors.auth.passwordInput).type(this.credentials.password);
    cy.get(selectors.auth.signInButton)
      .contains("Sign In")
      .click();
    cy.wait("@root", {timeout: 10000}).its('status').should('be', 200);
    // Step 2: Go to settings
    cy.visit(`${url.route}`);
    cy.wait(2000);
    // Step 3: find transaction with description
    cy.get(selectors.descriptionButton, {timeout: 5000}).first().click();
  });
});


