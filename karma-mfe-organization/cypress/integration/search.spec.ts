/// <reference types="cypress" />

describe("Search candidates", () => {

  const url = {
    auth: "https://cognito-identity.us-west-2.amazonaws.com/",
    candidates: "http://localhost:3000/candidates",
    root: "http://localhost:3000/",
  };

  const selectors = {
    auth:{
      passwordInput: '[data-test="sign-in-password-input"]',
      signInButton: '[data-test="sign-in-sign-in-button"]',
      usernameInput: '[data-test="username-input"]'
    },
    search: {
      dropdown: 'div[class="MuiPaper-root MuiPaper-elevation1 autocomplete-dropdown-container MuiPaper-rounded"]',
      searchButton: 'button[class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"]',
      searchField: 'input[id="search"]',
    },
  };
  beforeEach(function() {
    cy.fixture("credentials")
      .then((credentials) => {
        this.credentials = credentials;
      });
    cy.visit(url.root);
  });

  it("Allows a user to search candidates:", function()  {
    cy.server().route("POST", url.auth).as('root');

    // Step 1: Login as an organization
    cy.get(selectors.auth.usernameInput).type(this.credentials.userName);
    cy.get(selectors.auth.passwordInput).type(this.credentials.password);
    cy.get(selectors.auth.signInButton)
      .contains("Sign In")
      .click();
    cy.wait("@root", {timeout: 10000}).its('status').should('be', 200);

    // Step 2: Go to the candidates search view
    cy.visit(url.candidates);
    cy.wait(2000);
    // Step 3: Type location to the input box
    cy.get('input', {timeout: 5000}).eq(1).clear().type('Las Vegas, Nevada, USA').click();

    // Step 4: Click first dropdown option
    cy.get(selectors.search.dropdown, {timeout: 5000}).eq(0).click();

    // Step 5: Click "searchButton"
    cy.get(selectors.search.searchButton).click();
    // Step 6: add "manager" in search field
    cy.get(selectors.search.searchField).type('manager');
    // Step 7: Click "searchButton"
    cy.get(selectors.search.searchButton).click();
    // Step 8: Clear fields
    cy.get(selectors.search.searchField).clear();
    // Step 7: Click "searchButton"
    cy.get(selectors.search.searchButton).click();
  });
});
