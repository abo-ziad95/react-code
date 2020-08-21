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
    submit: '[data-test="criteria-submit"]'
  },
  chip: {
    delete: {
      datePosted: '[data-test=date-posted-input]',
      education: '[data-test=education-input]',
      experience: '[data-test=experience-input]',
      industries: '[data-test=industries-input] > .MuiSelect-root > .makeStyles-chips-606 > :nth-child(1) > #chip-delete-icon',
      jobTypes: '[data-test=job-type-input] > .MuiSelect-root > .makeStyles-chips-606 > :nth-child(1) > #chip-delete-icon',
      keywords: '[data-test=keywords-input]',
      salaryRange: '[data-test=salary-range-input]',
    },
  },
  input: {
    datePosted: '[data-test=date-posted-input]',
    education: '[data-test=education-input]',
    experience: '[data-test=experience-input]',
    industries: '[data-test=industries-input]',
    jobTypes: '[data-test=job-type-input]',
    keywords: '[data-test=keywords-input]',
    salaryRange: '[data-test=salary-range-input]',
  }
}

const navigate = {
  button: {
    profile: 'div[class="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-divider MuiListItem-button"]',
  }
}


// Creates a random number
const randomNumber = (num) => {
  return Math.floor((Math.random() * num))
}

describe("Search Criteria Form:", () => {
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

  // Step 3: Fill out Search Criteria Form with proper values
  it("Allows a user to select a form field and select a value", () => {

    // Select a value from the industry form field
    cy.get(form.input.industries).click()
      .get('li[role="option"]').eq(randomNumber(4)).click()
      .get('li[role="option"]').eq(randomNumber(4)).click()
      .get('li[role="option"]').eq(randomNumber(4)).click()
      .type('{esc}')

    // Select values from job type form field
    cy.get(form.input.jobTypes).click()
      .get('li[role="option"]').eq(randomNumber(4)).click()
      .get('li[role="option"]').eq(randomNumber(4)).click()
      .get('li[role="option"]').eq(randomNumber(4)).click()
      .type('{esc}')

    // Select a value from the education form field
    cy.get(form.input.education).click()
      .get('li[role="option"]').eq(randomNumber(6)).click()

    // Select a value from the experience form field
    cy.get(form.input.experience).click()
      .get('li[role="option"]').eq(randomNumber(3)).click()

    // Select a value from the salary range form field
    cy.get(form.input.salaryRange).click()
      .get('li[role="option"]').eq(randomNumber(6)).click()

    // Select a value from the date posted form field
    cy.get(form.input.datePosted).click()
      .get('li[role="option"]').eq(randomNumber(4)).click()

    cy.get(form.button.submit).contains('Submit').click()
      .wait(500)
  });

  // Step 4: Delete an item from Search Criteria Form
  it("Allows a user to remove a value from the form field", () => {
    // Delete a chip from the industry form field
    cy.get(form.chip.delete.industries).click()

    // Delete a chip from the job type form field
    cy.get(form.chip.delete.jobTypes).click()

    cy.get(form.button.submit).contains('Submit').click()
  });

  // Step 5: Fill out Search Criteria Form
  it("Allows a user to select a form field and select a value", () => {

    // Select a value from the industry form field
    cy.get(form.input.industries).click()
      .get('li[role="option"]').eq(randomNumber(4)).click()
      .get('li[role="option"]').eq(randomNumber(4)).click()
      .get('li[role="option"]').eq(randomNumber(4)).click()
      .type('{esc}')

    // Select values from job type form field
    cy.get(form.input.jobTypes).click()
      .get('li[role="option"]').eq(randomNumber(4)).click()
      .get('li[role="option"]').eq(randomNumber(4)).click()
      .get('li[role="option"]').eq(randomNumber(4)).click()
      .type('{esc}')

    // Select a value from the education form field
    cy.get(form.input.education).click()
      .get('li[role="option"]').eq(randomNumber(6)).click()

    // Select a value from the experience form field
    cy.get(form.input.experience).click()
      .get('li[role="option"]').eq(randomNumber(3)).click()

    // Select a value from the salary range form field
    cy.get(form.input.salaryRange).click()
      .get('li[role="option"]').eq(randomNumber(6)).click()

    // Select a value from the date posted form field
    cy.get(form.input.datePosted).click()
      .get('li[role="option"]').eq(randomNumber(4)).click()

    cy.get(form.button.submit).contains('Submit').click()
      .wait(500)
  });
});