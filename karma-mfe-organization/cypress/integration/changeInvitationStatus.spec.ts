/// <reference types="cypress" />


describe("Change Invitation status", () => {

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
      acceptedBtn: 'li[id="accepted"]',
      addMemberButton: 'button[id="addInvitation"]',
      dropdownBtn: 'button[id="handleMenu"]',
      linkToInvitations: 'button[id="linkToInvitations"]',
      membersButton: 'button[id="view-members"]',
      pendingBtn: 'li[id="pending"]',
    },
  };
  beforeEach(function() {
    cy.fixture("credentials")
      .then((credentials) => {
        this.credentials = credentials;
      });
    cy.visit(url.root);
  });
  it("Allows a user to change invitation status:", function()  {
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
    // Step 3: Go to the list of invitation
    cy.get(selectors.organization.linkToInvitations, {timeout: 2000}).click()
    // Step 4: select first invitation and click on them
    cy.get(selectors.organization.dropdownBtn, {timeout: 1000}).first().click()
    // Step 5: change status to revoked
    cy.get(selectors.organization.pendingBtn, {timeout: 1000}).click();
    // Step 6: change status to accept
    cy.get(selectors.organization.dropdownBtn, {timeout: 1000}).first().click()
    cy.get(selectors.organization.acceptedBtn).click()
  });
});
