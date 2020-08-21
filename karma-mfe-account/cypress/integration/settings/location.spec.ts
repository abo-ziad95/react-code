/// <reference types="cypress" />
const url = {
  auth: "https://cognito-identity.us-west-2.amazonaws.com/",
  root: "http://localhost:3000/",
}

const address = {
  icon: 'button[id="address-icon"]',
  input: 'input[id="add-address-field"]',
  menu: {
    default: '#address-menu-icon-default',
    delete: '#address-menu-icon-delete'
  },
  suggestion: {
    item: '.suggestion-item > span'
  },
}

const alerts = {
  button: {
    close: '.MuiDialogActions-root > .MuiButtonBase-root > .MuiButton-label',
  },
  dialog: {
    body: '.MuiDialogContent-root > .MuiTypography-root'
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
  button: {
    settings: 'div[class="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-divider MuiListItem-button"]',
  }
}


describe("Settings:", () => {

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

  // Step 2: Navigate to Settings
  it("Allows a user to navigate to the settings view", () => {
    cy.get(navigate.button.settings)
      .contains("Settings").click()
  });

  // Step 3: Add a new address
  it("Allows a user to enter an address and populate their address list", () => {
    cy.get(address.input).click().type('2471 West Horizon Ridge Parkway, Henderson, NV, USA').get(address.suggestion.item).first().click()

    cy.get(address.input).click().type('3370 Saint Rose Parkway, Henderson, NV, USA').get(address.suggestion.item).first().click()
  });

  // Step 4: Change an address to primary
  it("Allows a user to change an address to primary", () => {
    cy.get(address.icon).eq(1).click().wait(250).get(address.menu.default).contains("Make Default").click()
  });


  // Step 5: Delete the addresses
  it("Allows a user to remove an address from their address list", () => {
    cy.get(address.icon).first().click().get(address.menu.delete).contains("Delete Address").click()

    cy.get(address.icon).first().click().get(address.menu.delete).contains("Delete Address").click()
  });

  // Negative tests
  // Step 6: Add a new address entering no value
  it("Allows a user to enter an address with no value provided", () => {
    cy.get(address.input).click().type('$*($%#').type('{enter}')
    cy.get(alerts.dialog.body).contains("ZERO_RESULTS").get(alerts.button.close).contains("Close").click()
  });
})