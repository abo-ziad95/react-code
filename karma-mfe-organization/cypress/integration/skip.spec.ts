/// <reference types="cypress" />

describe("Site Renders", () => {
  it("Site renders", () => {
    cy.server();
    cy.visit("http://localhost:3000");
  });
});
