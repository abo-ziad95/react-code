/// <reference types="cypress" />


describe("Authenticator:", () => {

  const url = {
    auth: "https://cognito-identity.us-west-2.amazonaws.com/",
    root: "http://localhost:3000/",
  };

  const selectors = {
    passwordInput: '[data-test="sign-in-password-input"]',
    signInButton: '[data-test="sign-in-sign-in-button"]',
    usernameInput: '[data-test="username-input"]'
  };

  beforeEach(function() {
    cy.fixture("credentials")
      .then((credentials) => {
        this.credentials = credentials;
      });
    cy.visit(url.root);
  });
    it("Allows a user to sign in", function()  {
    cy.server().route("POST", url.auth).as('root');
      cy.get(selectors.usernameInput).type("testuser1");
      cy.get(selectors.passwordInput).type("(TestUser123)");
      cy.get(selectors.signInButton)
        .contains("Sign In")
        .click();
      cy.wait("@root", {timeout: 10000}).its('status').should('be', 200);
    });
  });
