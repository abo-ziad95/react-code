/// <reference types="cypress" />

describe("Edit organization", () => {

  const url = {
    auth: "https://cognito-identity.us-west-2.amazonaws.com/",
    root: "http://localhost:3000/",
    route: "http://localhost:3000/settings",
  };

  const selectors = {
    addressField: 'input[id="location-search"]',
    auth: {
      passwordInput: '[data-test="sign-in-password-input"]',
      signInButton: '[data-test="sign-in-sign-in-button"]',
      usernameInput: '[data-test="username-input"]',
    },
    submitButton: 'button[id="submit"]',
    titleField: 'input[id="name"]',
  };

  beforeEach(function() {
    cy.fixture("credentials")
      .then((credentials) => {
        this.credentials = credentials;
      });
    cy.visit(url.root);
  });

    it("Allows a user to edit organization", function()  {
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
      // Step 3: change title addresses and location of organization
      cy.get(selectors.titleField).clear().type("test title");
      cy.get(selectors.addressField).clear().type("Las Vegas, Nivata, USA");
      // Step 4: save changes
      cy.get(selectors.submitButton).contains('Submit').click();
    });

  it("Allows a user to edit organization", function()  {
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
    // Step 3: change title addresses and location of organization
    cy.get(selectors.titleField).clear();
    cy.get(selectors.addressField).clear();
    // Step 4: save changes
    cy.get(selectors.submitButton).contains('Submit').click();
  });
  });


