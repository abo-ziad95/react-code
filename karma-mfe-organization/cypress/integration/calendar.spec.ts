/// <reference types="cypress" />

describe("Calendar click prev and next buttons", () => {
  const url = {
    auth: "https://cognito-identity.us-west-2.amazonaws.com/",
    root: "http://localhost:3000",
    route: "http://localhost:3000/interviews",
  };

  const selectors = {
    auth: {
      passwordInput: '[data-test="sign-in-password-input"]',
      signInButton: '[data-test="sign-in-sign-in-button"]',
      usernameInput: '[data-test="username-input"]',
    },
    daysInCalendar: 'button[class="react-calendar__tile"]',
    nextMonth: 'button[class="react-calendar__navigation__arrow react-calendar__navigation__next-button"]',
    prevMonth: 'button[class="react-calendar__navigation__arrow react-calendar__navigation__prev-button"]',
  };

  beforeEach(function() {
    cy.fixture("credentials")
      .then((credentials) => {
        this.credentials = credentials;
      });
    cy.visit(url.root);
  });

  it("Allows a user to click buttons", function()  {
    cy.server().route("POST", url.auth).as('root');

    // Step 1: Login as an organization
    cy.get(selectors.auth.usernameInput).type(this.credentials.userName);
    cy.get(selectors.auth.passwordInput).type(this.credentials.password);
    cy.get(selectors.auth.signInButton)
      .contains("Sign In")
      .click();
    cy.wait("@root", {timeout: 10000}).its('status').should('be', 200);
    // Step 2: Go to the calendar
    cy.visit(`${url.route}`);
    cy.wait(2000);
    cy.get(selectors.prevMonth, {timeout: 2000}).click();
    cy.get(selectors.nextMonth).click();
  });
});


