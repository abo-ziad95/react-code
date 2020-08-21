/// <reference types="cypress" />

describe("Candidate Stepper", () => {
  const url = {
    auth: "https://cognito-identity.us-west-2.amazonaws.com/",
    jobs: "http://localhost:3000/jobs",
    root: "http://localhost:3000/",
  };

  const selectors = {
    auth:{
      passwordInput: '[data-test="sign-in-password-input"]',
      signInButton: '[data-test="sign-in-sign-in-button"]',
      usernameInput: '[data-test="username-input"]'
    },
    candidateItem: '#list-0',
    candidateView: '.MuiBadge-anchorOriginTopRightRectangle',
    job: {
      firstJobListButton: 'div[id="job-21935"]',
    },
    organization: {
      firstOrganizationListButton: 'div[id="organization-4cfacf5a-996b-40bf-a318-1970f5e81cb0"]',
      viewJobsButton: 'button[id="view-jobs"]',
    },
    stepper: {
      checkIcon: 'svg[class="MuiSvgIcon-root MuiSvgIcon-colorPrimary"]',
      errorIcon: 'svg[class="MuiSvgIcon-root MuiSvgIcon-colorError"]'
    }
  };
  beforeEach(function() {
    cy.fixture("credentials")
      .then((credentials) => {
        this.credentials = credentials;
      });
    cy.visit(url.root);
  });

  it("Allows a user change candidate's status via stepper:", function()  {
    cy.server().route("POST", url.auth).as('root');

    // Step 1: Login as an organization
    cy.get(selectors.auth.usernameInput).type(this.credentials.userName);
    cy.get(selectors.auth.passwordInput).type(this.credentials.password);
    cy.get(selectors.auth.signInButton)
      .contains("Sign In")
      .click();
    cy.wait("@root", {timeout: 10000}).its('status').should('be', 200);

    // Step 2: Go to the list of jobs
    cy.visit(url.jobs);
    // Step 3: Go to the list of candidates
    cy.get(selectors.candidateView).not('.MuiBadge-invisible').last().click();
    cy.get(selectors.candidateItem).click();

    cy.get('div[id="stepper"]')
      .children('div')
      .as('steps')
      .eq(0)
      .click();

    // Step 9: Check that candidate's status belongs to the first step
    cy.get('@steps')
      .eq(0)
      .children('button')
      .children('span')
      .children('span')
      .children(selectors.stepper.checkIcon);

    // Step 10: Click to the second step
    cy.get('@steps')
      .eq(1)
      .click();

    // Step 11: Check that candidate's status belongs to the second step
    cy.get('@steps')
      .eq(1)
      .children('button')
      .children('span')
      .children('span')
      .children('div')
      .children('input').should('have.value', 'active');

    // Step 12: Click to the last step
    cy.get('@steps')
      .eq(4)
      .click();

    // Step 13: Check that candidate's status belongs to the last step
    cy.get('@steps')
      .eq(4)
      .children('button')
      .children('span')
      .children('span')
      .children(selectors.stepper.errorIcon);

    // Step 14: Click to the first step
    cy.get('@steps')
      .eq(0)
      .click();

    // Step 15: Check that candidate's status belongs to the first step
    cy.get('@steps')
      .eq(0)
      .children('button')
      .children('span')
      .children('span')
      .children(selectors.stepper.checkIcon);
  });
});
