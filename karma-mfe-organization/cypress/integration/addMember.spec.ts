/// <reference types="cypress" />


describe("Add Member to organization:", () => {

  const url = {
    auth: "https://cognito-identity.us-west-2.amazonaws.com/",
    members: "http://localhost:3000/members",
    root: "http://localhost:3000/",
  };

  const selectors = {
    auth:{
      passwordInput: '[data-test="sign-in-password-input"]',
      signInButton: '[data-test="sign-in-sign-in-button"]',
      usernameInput: '[data-test="username-input"]'
    },
    organization: {
      addMemberButton: 'button[id="addInvitation"]',
      emailInput: 'input[id="email"]',
      emailItem: 'span[id="email"]',
      membersButton: 'button[id="view-members"]',
      submitButton: 'button[id="submit"]',
    },
  };
  beforeEach(function() {
    cy.fixture("credentials")
      .then((credentials) => {
        this.credentials = credentials;
      });
    cy.visit(url.root);
  });

  it("Allows a user to add member:", function()  {
    cy.server().route("POST", url.auth).as('root');
    // Step 1: Login as an organization
    cy.get(selectors.auth.usernameInput).type(this.credentials.userName);
    cy.get(selectors.auth.passwordInput).type(this.credentials.password);
    cy.get(selectors.auth.signInButton)
      .contains("Sign In")
      .click();
    cy.wait("@root", {timeout: 10000}).its('status').should('be', 200);

    // Step 2: Go to the list of members
    cy.visit(url.members);
    cy.wait(2000);
    // Step 3: Click 'addMemberButton'
    cy.get(selectors.organization.addMemberButton).click();

    // Step 4: Type 1
    cy.get(selectors.organization.emailInput).type("test@dd.rt");

    // Step 5: Click "Submit button"
    cy.get(selectors.organization.submitButton).click();
  });

  it("Allows a user to add member with wrong email:", function()  {
    cy.server().route("POST", url.auth).as('root');
    // Step 1: Login as an organization
    cy.get(selectors.auth.usernameInput).type(this.credentials.userName);
    cy.get(selectors.auth.passwordInput).type(this.credentials.password);
    cy.get(selectors.auth.signInButton)
      .contains("Sign In")
      .click();
    cy.wait("@root", {timeout: 10000}).its('status').should('be', 200);

    // Step 2: Go to the list of members
    cy.visit(url.members);
    cy.wait(2000);
    // Step 3: Click 'addMemberButton'
    cy.get(selectors.organization.addMemberButton).click();

    // Step 4: Type 1
    cy.get(selectors.organization.emailInput).type("test email");

    // Step 5: Click "Submit button"
    cy.get(selectors.organization.submitButton).click();
  });

  it("Allows a user to add member with empty email:", function()  {
    cy.server().route("POST", url.auth).as('root');
    // Step 1: Login as an organization
    cy.get(selectors.auth.usernameInput).type(this.credentials.userName);
    cy.get(selectors.auth.passwordInput).type(this.credentials.password);
    cy.get(selectors.auth.signInButton)
      .contains("Sign In")
      .click();
    cy.wait("@root", {timeout: 10000}).its('status').should('be', 200);

    // Step 2: Go to the list of members
    cy.visit(url.members);
    cy.wait(2000);
    // Step 3: Click 'addMemberButton'
    cy.get(selectors.organization.addMemberButton).click();

    // Step 4: Type 1
    // cy.get(selectors.organization.emailInput).type("test email");

    // Step 5: Click "Submit button"
    cy.get(selectors.organization.submitButton).click();
  });
});
