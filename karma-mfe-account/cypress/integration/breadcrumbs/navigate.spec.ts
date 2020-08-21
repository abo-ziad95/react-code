/// <reference types="cypress" />
const url = {
  auth: "https://cognito-identity.us-west-2.amazonaws.com/",
  root: "http://localhost:3000/",
}

const application = {
  button: {
    view: 'button[id="application-view-button"]',
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

const navigate = {
  breadcrumbs: '.MuiBreadcrumbs-ol > :nth-child(1) > .MuiTypography-root',
  button: {
    dashboard: '.MuiList-root',
    profile: '.MuiList-root',
    settings: '.MuiList-root',
  }
}

describe("Navigate the application's breadcrumbs:", () => {

  // Step 1: Sign In
  it("Allows a user to sign in", () => {
    cy.server().route("POST", url.auth).as('root')
    cy.visit(url.root)
    cy.get(auth.input.username).type("testuser4");
    cy.get(auth.input.password).type("(TestUser123)");
    cy.get(auth.button.signIn).contains("Sign In").click()
    cy.wait("@root", { timeout: 5000 }).wait("@root", { timeout: 5000 })
      .its('status').should('be', 200);
  });

  // Step 2: Navigate to profile
  it("Allows a user to navigate to the Profile view", () => {
    cy.get(navigate.button.profile).contains("Profile").click()
  });

  // Step 3: Navigate to dashboard using breadcrumbs
  it("Allows a user to navigate to the Profile view", () => {
    cy.get(navigate.breadcrumbs).first().click()
  });

  // Step 4: Navigate to settings
  it("Allows a user to navigate to the Settings view", () => {
    cy.get(navigate.button.settings).contains("Settings").click()
  });

  // Step 5: Navigate to dashboard using breadcrumbs
  it("Allows a user to navigate to the Dashboard view", () => {
    cy.get(navigate.breadcrumbs).first().click()
  });
});