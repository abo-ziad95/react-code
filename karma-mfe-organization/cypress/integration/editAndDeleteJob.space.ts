/// <reference types="cypress" />

describe("Edit and delete job", () => {

  const url = {
    auth: "https://cognito-identity.us-west-2.amazonaws.com/",
    jobsListRoute: "http://localhost:3000/jobs",
    root: "http://localhost:3000",
  };

  const selectors = {
    auth: {
      passwordInput: '[data-test="sign-in-password-input"]',
      signInButton: '[data-test="sign-in-sign-in-button"]',
      usernameInput: '[data-test="username-input"]',
    },
    candidateView: '.MuiBadge-anchorOriginTopRightRectangle',
    deleteButton: 'button[id="delete"]',
    deleteConfirmButton: '.MuiButton-label',
    deleteStep: '#step-remove',
    deleteStepConfirm: '#delete-confirm',
    editJobButton: '#edit-job',
    jobAddStepButton: 'button[id="addStep"]',
    jobAddStepInput: 'input[id="step"]',
    jobAddStepSubmitButton: 'button[id="addStepSubmit"]',
    jobDescriptionDiv: '.ql-editor',
    jobDescriptionInput: '.ql-editor',
    jobLocationField: 'input[id="location-search"]',
    jobStatusItem: 'li[id="selectedStatusJob"]',
    jobStatusMenu: 'button[id="handleMenu-status"]',
    jobTitleField: 'input[id="title"]',
    jobTypeItem: 'li[id="selectedTypeJob"]',
    jobTypeMenu: 'button[id="handleMenu-jobType"]',
    stepDrag: '#step-drag',
    submitButton: 'button[id="submit"]',
  };

  const timings = {
    // greater than the out of the way time
    // so that when the drop ends everything will
    // have to be out of the way
    maxDropTime: 0.55,
    minDropTime: 0.33,
    outOfTheWay: 0.2,
  };

  const keyCodes = {
    arrowDown: 40,
    arrowLeft: 37,
    arrowRight: 39,
    arrowUp: 38,
    end: 35,
    enter: 13,
    escape: 27,
    home: 36,
    pageDown: 34,
    pageUp: 33,
    space: 32,
    tab: 9,
  };

  beforeEach(function() {
    cy.fixture("credentials")
      .then((credentials) => {
        this.credentials = credentials;
      });
    cy.visit(url.root);
  });
    it("Allows a user to edit job", function()  {
    cy.server().route("POST", url.auth).as('root');

      // Step 1: Login as an organization
      cy.get(selectors.auth.usernameInput).type(this.credentials.userName);
      cy.get(selectors.auth.passwordInput).type(this.credentials.password);
      cy.get(selectors.auth.signInButton)
        .contains("Sign In")
        .click();
      cy.wait("@root", {timeout: 10000}).its('status').should('be', 200);
      // Step 2: Go to the list of jobs
      cy.visit(`${url.jobsListRoute}`);
      // Step 3: Go to the first job in the list
      cy.get(selectors.candidateView).should('have.class',  'MuiBadge-invisible').last().parent().parent().parent().parent().click();
      // Step 4: click edit job button
      cy.get(selectors.editJobButton).click();
      // Step 5: change type of job
      cy.get(selectors.jobTypeMenu, {timeout: 5000}).click();
      cy.get(selectors.jobTypeItem).click();
      // Step 5: status type of job
      cy.get(selectors.jobStatusMenu, {timeout: 5000}).click();
      cy.get(selectors.jobStatusItem).click();
      // Step 6: change title and location of job
      cy.get(selectors.jobTitleField).clear().type("test job");
      cy.get(selectors.jobLocationField).clear().type("Las Vegas, Nivata, USA");
      // Step 7: change description
      cy.get(selectors.jobDescriptionDiv).click({ force: true }).clear();
      cy.get(selectors.jobDescriptionDiv).type("Desc test job");
      // Step 8: add hiring step
      cy.get(selectors.jobAddStepButton, {timeout: 5000}).click();
      cy.get(selectors.jobAddStepInput).type("step");
      cy.get(selectors.jobAddStepSubmitButton, {timeout: 5000}).click();
      // Step 9: Move step up
      cy.get(selectors.stepDrag).focus()
        .trigger('keydown', { keyCode: keyCodes.space })
        .trigger('keydown', { keyCode: keyCodes.arrowUp, force: true })
        // finishing before the movement time is fine - but this looks nice
        .wait(timings.outOfTheWay * 1000)
        .trigger('keydown', { keyCode: keyCodes.space, force: true });

      // Step 10: delete them
      cy.get(selectors.deleteStep)
        .click();
      // Step 11: save job
      cy.get(selectors.submitButton, {timeout: 5000}).contains('Submit').click();
      cy.wait(2000)
      // Step 12: delete job
      cy.get(selectors.deleteButton, {timeout: 5000}).click();
      cy.get(selectors.deleteConfirmButton).contains('Confirm').click();
    });
  it("Allows a user to edit job with empty fields", function()  {
    cy.server().route("POST", url.auth).as('root');

    // Step 1: Login as an organization
    cy.get(selectors.auth.usernameInput).type(this.credentials.userName);
    cy.get(selectors.auth.passwordInput).type(this.credentials.password);
    cy.get(selectors.auth.signInButton)
      .contains("Sign In")
      .click();
    cy.wait("@root", {timeout: 10000}).its('status').should('be', 200);
    // Step 2: Go to the list of jobs
    cy.visit(`${url.jobsListRoute}`);
    // Step 3: Go to the first job in the list
    cy.get(selectors.candidateView).should('have.class',  'MuiBadge-invisible').first().parent().parent().parent().parent().click();
    // Step 4: click edit job button
    cy.get(selectors.editJobButton).click();
    // Step 5: change type of job
    cy.get(selectors.jobTypeMenu, {timeout: 5000}).click();
    cy.get(selectors.jobTypeItem).click();
    // Step 5: status type of job
    cy.get(selectors.jobStatusMenu, {timeout: 5000}).click();
    cy.get(selectors.jobStatusItem).click();
    // Step 6: change title and location of job
    cy.get(selectors.jobTitleField).clear()
    cy.get(selectors.jobLocationField).clear()
    // Step 7: change description
    cy.get(selectors.jobDescriptionDiv).click({ force: true }).clear();
    cy.get(selectors.jobDescriptionDiv).type("Desc test job");

    // Step 8: save job
    cy.get(selectors.submitButton, {timeout: 5000}).contains('Submit').click();
  });
  });


