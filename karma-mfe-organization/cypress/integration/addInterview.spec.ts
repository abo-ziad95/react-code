/// <reference types="cypress" />

const setDate = require("./setDate");

describe("Add interview", () => {
  const url = {
    auth: "https://cognito-identity.us-west-2.amazonaws.com/",
    root: "http://localhost:3000",
    route: "http://localhost:3000/jobs"
  };

  const selectors = {
    addInterviewBtn: "#addBtn",
    auth: {
      passwordInput: '[data-test="sign-in-password-input"]',
      signInButton: '[data-test="sign-in-sign-in-button"]',
      usernameInput: '[data-test="username-input"]'
    },
    candidateItem: "#list-0",
    candidateView: ".MuiBadge-anchorOriginTopRightRectangle",
    confirmDateInterview:'#interviewsList > span[class="MuiTypography-root MuiListItemText-primary MuiTypography-body1"]',
    interviewDate: "#interviewDate",
    submitButton: "#submit",
  };
  beforeEach(function() {
    cy.fixture("credentials")
      .then((credentials) => {
        this.credentials = credentials;
      });
    cy.visit(url.root);
  });

  it("Allows a user to show candidates and add interview", function()  {
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

    // Step 3: Go to job with candidates
    cy.get(selectors.candidateView, {timeout: 5000})
      .not(".MuiBadge-invisible").first()
      .click();

    // Step 4: Go to candidate view
    cy.get(selectors.candidateItem, {timeout: 5000}).click();
    // Step 5: open popup with interview date
    cy.get(selectors.addInterviewBtn).click();
    // Step 6: add date with random dates
    const randomNumber = Math.floor(Math.random() * 20) + 9;
    const date = Cypress.moment().format(`YYYY-MM-${randomNumber}Thh:${randomNumber}`);
    cy.wait(1000)
    cy.get(selectors.interviewDate)
      .click()
      .then(input => {
        setDate(input[0], date);
      })
      .click();
    // Step 7: click submit button
    cy.get(selectors.submitButton)
      .contains("Submit")
      .click();
    // Step 8: check date after add interview
    const confirmDate = Cypress.moment(date).format("MMMM DD, YYYY @ HH:mm A");
    cy.wait(1000)
    cy.get(selectors.confirmDateInterview, {timeout: 10000}).contains(confirmDate)
  });
  it("Allows a user to show candidates and add interview with empty field", function()  {
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

    // Step 3: Go to job with candidates
    cy.get(selectors.candidateView, {timeout: 5000})
      .not(".MuiBadge-invisible").first()
      .click();

    // Step 4: Go to candidate view
    cy.get(selectors.candidateItem, {timeout: 5000}).click();
    // Step 5: open popup with interview date
    cy.get(selectors.addInterviewBtn).click();
    // Step 6: add date
    cy.get(selectors.interviewDate)
      .click()
      .then(input => {
        setDate(input[0], "");
      })
      .click();
    // Step 7: click submit button
    cy.get(selectors.submitButton)
      .contains("Submit")
      .click();
  });


});
