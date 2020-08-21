/// <reference types="cypress" />
const url = {
  auth: "https://cognito-identity.us-west-2.amazonaws.com/",
  root: "http://localhost:3000/",
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

const form = {
  button: {
    submit: '[data-test="qualifications-submit"]'
  },
  chip: {
    delete: {
      certifications: ':nth-child(1) > .MuiGrid-container > .MuiGrid-root > :nth-child(1) > #chip-delete-icon',
      languages: ':nth-child(2) > .MuiGrid-container > .MuiGrid-root > :nth-child(1) > #chip-delete-icon',
      skills: ':nth-child(3) > .MuiGrid-container > .MuiGrid-root > :nth-child(1) > #chip-delete-icon',
    }
  },
  input: {
    certifications: '[data-test=certifications-input]',
    languages: '[data-test=languages-input]',
    skills: '[data-test=skills-input]',
  }
}

const navigate = {
  button: {
    profile: 'div[class="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-divider MuiListItem-button"]',
  }
}

describe("Fill out a form and create or update a profile:", () => {

  // Step 1: Sign In
  it("Allows a user to sign in", () => {
    cy.server().route("POST", url.auth).as('root')
    cy.visit(url.root)
    cy.get(auth.input.username).type("testuser4");
    cy.get(auth.input.password).type("(TestUser123)");
    cy.get(auth.button.signIn).contains("Sign In").click()
    cy.wait("@root", { timeout: 5000 }).wait("@root", { timeout: 5000 }).its('status').should('be', 200);
  });

  // Step 2: Navigate to profile
  it("Allows a user to navigate to the profile view", () => {
    cy.get(navigate.button.profile)
      .contains("Profile")
      .click()
    cy.wait(500)
  });

  // Step 3: Input data into Qualifications form
  it("Allows a user to select a form field and select a value", () => {

    // Creates random string
    const randomString = () => {
      return Math.random().toString(36).substring(2, 5)
        + Math.random().toString(36).substring(2, 5);
    }

    // Input values into form field
    cy.get(form.input.certifications).click().type(randomString())

    // Input values into form field
    cy.get(form.input.languages).click().type(randomString())

    // Input values into form field
    cy.get(form.input.skills).click().type(randomString())

    // Click on submit button
    cy.get(form.button.submit).contains('Submit').click().wait(500)
  });
});

// Step 4: Delete an item from Qualifications Form
describe("Remove a value from a form field:", () => {

  it("Allows a user to remove a value from the form field", () => {
    // Delete a chip from the certifications form field
    cy.get(form.chip.delete.certifications).click()

    // Delete a chip from the langauges form field
    cy.get(form.chip.delete.languages).click()

    // Delete a chip from the skills form field
    cy.get(form.chip.delete.skills).click()

    cy.get(form.button.submit).contains('Submit').click()
  });
});