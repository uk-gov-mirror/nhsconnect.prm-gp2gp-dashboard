const { viewPorts } = require("../support/common");

describe("Home page", () => {
  viewPorts.map(viewPort => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("displays the home page with the search input", () => {
        cy.contains("h1", "GP2GP patient record transfers data");
        cy.contains("h2", "About");
        cy.contains("h2", "Search");
        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        );
        cy.contains("button", "Search");
        cy.checkAccessibility();
      });

      it("displays the feedback form", () => {
        cy.contains("Tell us what you think");
        cy.contains("Take our survey").click();
        cy.contains("Feedback form for GP registrations data platform");
      });

      it("displays the validation error when there is no input", () => {
        cy.contains("button", "Search").click();
        cy.contains("Please enter a valid ODS code, practice name or CCG name");
        cy.checkAccessibility();
      });
    });
  });
});
