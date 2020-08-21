/// <reference types="cypress" />
const url = {
  auth: "https://cognito-identity.us-west-2.amazonaws.com/",
  root: "http://localhost:3000/",
}

const application = {
  button: {
    view: 'button[id="application-view-button"]',
    withdraw: 'button[id="application-withdraw-button"]',
  },
  list: {
    item: '#application-list-item'
  }
}

const auth = {
  button: {
    signIn: '[data-test="sign-in-sign-in-button"]',
  },
  input: {
    password: '[data-test="sign-in-password-input"]',
    username: '[data-test="username-input"]',
  }
}

const dialog = {
  button: {
    cancel: 'button[id="dialog-cancel-button"]',
    submit: 'button[id="dialog-submit-button"]'
  }
}

const drawer = {
  button: {
    dashboard: 'div[class="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-divider MuiListItem-button"]'
  }
}

// Step 1: Sign In
describe("Applications List", () => {

  it("Allows a user to sign in", () => {
    cy.server().route("POST", url.auth).as('root')
    cy.visit(url.root)
    cy.get(auth.input.username).type("testuser4");
    cy.get(auth.input.password).type("(TestUser123)");
    cy.get(auth.button.signIn).contains("Sign In").click()
    cy.wait("@root", { timeout: 5000 }).wait("@root", { timeout: 5000 })
      .its('status').should('be', 200);
  });

  // Step 2: View an application
  it("Allows a user to view an application", () => {
      cy.get(application.button.view)
      .first()
      .click()
  });

  // Step 3: Navigate back to Dashboard
  it("Allows a user to navigate back to dashboard", () => {
    cy.get(drawer.button.dashboard)
      .contains("Dashboard")
      .click()
  });


  // Step 4: Withdraw an application
  it("Allows a user to withdraw their application", () => {
    // Part 4a: Cancel application withdraw
    cy.get(application.button.withdraw)
      .first()
      .click()

    cy.get(dialog.button.cancel)
      .contains("Cancel")
      .click()

    // Part 4b: Confirm application withdraw
    cy.get(application.button.withdraw)
      .first()
      .click()

    cy.get(dialog.button.submit)
      .contains("Submit")
      .click()
  });
});