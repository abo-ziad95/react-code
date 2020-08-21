/// <reference types="cypress" />


describe("Member status change", () => {
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
      listOfInvitationsButton: 'button[id="list-of-invitations"]',
      listOfInvitationsLI: 'li[class="MuiListItem-root MuiListItem-gutters MuiListItem-divider"]',
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

  it("Allows a user to change member's status:", function()  {
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

    // Step 3: Click switch to change status of the first member"
    cy.wait(2000);
    cy.get('input', {timeout: 2000}).eq(0).click();

    // Step 4: Click switch to change back status of the first member"
    cy.get('input').eq(0).click();

  });
});
