/// <reference types="cypress" />

describe("Create job", () => {

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
    createJobButton: 'button[id="create-job-btn"]',
    deleteStep: '#Interview-remove',
    jobAddStepButton: 'button[id="addStep"]',
    jobAddStepInput: 'input[id="step"]',
    jobAddStepSubmitButton: 'button[id="addStepSubmit"]',
    jobDescriptionDiv: '.ql-editor',
    jobDescriptionInput: '.ql-editor > p',
    jobLocationField: 'input[id="location-search"]',
    jobTitleField: 'input[id="title"]',
    jobTypeItem: 'li[id="selectedTypeJob"]',
    jobTypeMenu: 'button[id="handleMenu"]',
    submitButton: 'button[id="submitBtn"]',
    testStep: '#test-drag',
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
    it("Allows a user to create job", function()  {
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
      // Step 3: click create job button
      cy.get(selectors.createJobButton).click();
      // Step 4: change type of job
      cy.get(selectors.jobTypeMenu, {timeout: 5000}).click();
      cy.get(selectors.jobTypeItem).click();
      // Step 5: add title and location of job
      cy.get(selectors.jobTitleField).type("test job");
      cy.get(selectors.jobLocationField).type("Las Vegas, Nivata, USA");
      // Step 6: add description of job
      cy.get(selectors.jobDescriptionDiv).click();
      cy.get(selectors.jobDescriptionInput).type("Desc test job");
      // Step 7: add hiring step
      cy.get(selectors.jobAddStepButton, {timeout: 5000}).click();
      cy.get(selectors.jobAddStepInput).type("test");
      cy.get(selectors.jobAddStepSubmitButton, {timeout: 5000}).click();
      // Step 8: delete this hiring step
      cy.get(selectors.deleteStep)
        .click()
      // Step 9: Move step up
      cy.get(selectors.testStep).focus()
        .trigger('keydown', { keyCode: keyCodes.space })
        .trigger('keydown', { keyCode: keyCodes.arrowUp, force: true })
        // finishing before the movement time is fine - but this looks nice
        .wait(timings.outOfTheWay * 1000)
        .trigger('keydown', { keyCode: keyCodes.space, force: true });

      // Step 10: Move step up
      cy.get(selectors.testStep).focus()
        .trigger('keydown', { keyCode: keyCodes.space })
        .trigger('keydown', { keyCode: keyCodes.arrowUp, force: true })
        // finishing before the movement time is fine - but this looks nice
        .wait(timings.outOfTheWay * 1000)
        .trigger('keydown', { keyCode: keyCodes.space, force: true });

      // Step 11: save job
      cy.get(selectors.submitButton).contains('Submit').click();
    });

  it("Allows a user to create job with empty fields", function()  {
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
    // Step 3: click create job button
    cy.get(selectors.createJobButton).click();
    // Step 4: change type of job
    cy.get(selectors.jobTypeMenu, {timeout: 5000}).click();
    cy.get(selectors.jobTypeItem).click();
    // Step 5: add hiring step
    cy.get(selectors.jobAddStepButton, {timeout: 5000}).click();
    cy.get(selectors.jobAddStepSubmitButton, {timeout: 5000}).click();
    // Step 6: delete this hiring step
    cy.get(selectors.deleteStep)
      .click()
    // Step 7: save job
    cy.get(selectors.submitButton).contains('Submit').click();
  });


  });


