// import * as keyCodes from "./boardData/key-codes";
/// <reference types="cypress" />

describe("Candidates board", () => {
  const selectors = {
    auth:{
      passwordInput: '[data-test="sign-in-password-input"]',
      signInButton: '[data-test="sign-in-sign-in-button"]',
      usernameInput: '[data-test="username-input"]'
    },
    board: {
      board: 'div[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-6 MuiGrid-grid-md-3 MuiGrid-grid-lg-3 MuiGrid-grid-xl-3"]'
    },
    candidate: {
      denyCandidateButton: 'li[id="deny-candidate"]',
      handleMenuButton: 'button[id="handleMenu"]',
      id: '87eaf836-83a2-4c69-ad10-0603eac6a8d0',
      submitButton: 'button[id="submit"]',
      viewCandidatesBoardButton: 'button[id="view-candidates-board"]',
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
  };
  const url = {
    auth: "https://cognito-identity.us-west-2.amazonaws.com/",
    jobs: "http://localhost:3000/jobs",
    root: "http://localhost:3000/",
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

  it("Allows a user to interact with candidates board:", function()  {
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

    // Step 3: Go to the job with candidates
    cy.get(selectors.candidateView).not('.MuiBadge-invisible').last().parent().parent().parent().parent().click();

    // Step 4: Click "viewCandidatesButton"
    cy.get(selectors.candidate.viewCandidatesBoardButton).click();

    // Board test
    // Step 7: Check if first list has candidate with id: "selectors.candidate.id"
    cy.get(selectors.board.board)
      .eq(0)
      .children('div')
      .as('first-list')
      .children('div')
      .should('have.id', selectors.candidate.id);

    // Step 8: Check if second list does not have candidate with id: "selectors.candidate.id"
    cy.get(selectors.board.board)
      .eq(1)
      .children('div')
      .as('second-list')
      .children('div')
      .should('not.have.id', selectors.candidate.id);

    // Step 9: Move candidate from first list to the second list
    cy.get('@first-list')
      .find(`div[id="${selectors.candidate.id}"]`)
      .first()
      .should('have.id', selectors.candidate.id)
      .focus()
      .trigger('keydown', { keyCode: keyCodes.space })
      .trigger('keydown', { keyCode: keyCodes.arrowRight, force: true })
      // finishing before the movement time is fine - but this looks nice
      .wait(timings.outOfTheWay * 1000)
      .trigger('keydown', { keyCode: keyCodes.space, force: true });

    // Step 10: Check if candidate is no longer in the first list
    cy.get('@first-list').children('div').should('not.have.id', selectors.candidate.id);

    // Step 11: Check if candidate now in the second list
    cy.get('@second-list').children('div').should('have.id', selectors.candidate.id);

    // Step 12: Move candidate back to the first list
    cy.get('@second-list')
      .find(`div[id="${selectors.candidate.id}"]`)
      .first()
      .should('have.id', selectors.candidate.id)
      .focus()
      .trigger('keydown', { keyCode: keyCodes.space })
      .trigger('keydown', { keyCode: keyCodes.arrowLeft, force: true })
      // finishing before the movement time is fine - but this looks nice
      .wait(timings.outOfTheWay * 1000)
      .trigger('keydown', { keyCode: keyCodes.space, force: true });

    // Step 13: Check if candidate is no longer in the second list
    cy.get('@second-list').children('div').should('not.have.id', selectors.candidate.id);

    // Step 14: Check if candidate now in the first list
    cy.get('@first-list').children('div').should('have.id', selectors.candidate.id);

    // Step 15: Click "handleMenu" button
    cy.get('@first-list')
      .find(`div[id="${selectors.candidate.id}"]`)
      .first()
      .children('div')
      .children(selectors.candidate.handleMenuButton)
      .click();

    // Step 16: Click "Deny Candidate" button
    cy.get(selectors.candidate.denyCandidateButton).click();

    // Step 17: Click "Submit" Button
    cy.get(selectors.candidate.submitButton).click();

    // Step 13: Check if candidate is no longer in the second list
    cy.get('@second-list').children('div').should('not.have.id', selectors.candidate.id);

  });
});
