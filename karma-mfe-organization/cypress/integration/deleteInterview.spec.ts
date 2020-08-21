/// <reference types="cypress" />

describe("Delete Interview", () => {
  const url = {
    auth: "https://cognito-identity.us-west-2.amazonaws.com/",
    root: "http://localhost:3000",
    route: "http://localhost:3000/jobs",
  };

  const selectors = {
    addInterviewBtn: '#addBtn',
    auth: {
      passwordInput: '[data-test="sign-in-password-input"]',
      signInButton: '[data-test="sign-in-sign-in-button"]',
      usernameInput: '[data-test="username-input"]',
    },
    cancelBtn: "button[id='cancelBtn']",
    candidateItem: '#list-0',
    candidateView: '.MuiBadge-anchorOriginTopRightRectangle',
    interviewDate: '#interviewDate',
    submitButton: '#submit'
  };

  beforeEach(function() {
    cy.fixture("credentials")
      .then((credentials) => {
        this.credentials = credentials;
      });
    cy.visit(url.root);
  });
    it("Allows a user to delete interview", function()  {
    cy.server().route("POST", url.auth).as('root');

      // Step 1: Login as an organization
      cy.get(selectors.auth.usernameInput).type(this.credentials.userName);
      cy.get(selectors.auth.passwordInput).type(this.credentials.password);
      cy.get(selectors.auth.signInButton)
        .contains("Sign In")
        .click();
      cy.wait("@root", {timeout: 10000}).its('status').should('be', 200);
      // Step 2: Go to the list of jobs
      cy.visit(`${url.route}`);
      cy.wait(2000);
      // Step 3: find job with candidates
      cy.get(selectors.candidateView).not('.MuiBadge-invisible').first().click();
      // Step 4: go to show candidate profile
      cy.get(selectors.candidateItem, {timeout: 5000}).click();
      // Step 5: find first delete button and click
      cy.get(selectors.cancelBtn, {timeout: 5000}).first().click();
    });
  });


