const customTimeout = 30000;

describe("home", () => {
    before(() => {
        // Ensure viewport is set for all tests
        cy.viewport(1280, 720);
    });

    beforeEach(() => {
        // Reuse session for all tests
        cy.session("login", () => {
            cy.visit("http://taptosign.com");

            // Intercept necessary routes
            cy.intercept("POST", "/getSalespersonData").as("loadSalesPersonData");

            // Log in the user
            cy.get("a").contains("Login").should("exist").click({ force: true });
            cy.get("#EmailAddress").type(Cypress.env("EMAIL"));
            cy.get("#Password").type(Cypress.env("PASSWORD"));
            cy.get("a").contains("Sign In").click({ force: true });

            // Skip the 2FA step
            cy.get(".modal").should("exist").rightclick({ force: true });
            cy.get("a").contains("Skip").should("exist").click({ force: true });

            // Wait for and confirm redirection to the dashboard
            cy.wait("@loadSalesPersonData", { timeout: customTimeout });
            cy.url().should("include", "/dashboard");
        });
    });

    it("create a deal from forms library", () => {
        cy.visit("http://taptosign.com/dashboard.html");

        // Intercept necessary routes
        cy.intercept("POST", "/getSalespersonData").as("loadSalesPersonData");
        cy.intercept("POST","/getSalesPersonTapToSignLogNew?search=&page=0&size=25&showDeleted=undefined&showHidden=false&selectedDealFilter=&selectedDealTypeFilter=&salesPersonFilter=&dateTypeFilter=Created%20Date&secondDealershipId=&sortby=-1&startDate=&endDate=").as("loadDeals")
        
        // Wait for data to load
        // cy.wait("@loadSalesPersonData", { timeout: customTimeout });
        cy.wait("@loadDeals", { timeout: customTimeout });

        // Perform actions on the dashboard
        cy.get(".btnSelectFormsblack")
            .contains("Forms Library")
            .should("exist")
            .should("be.visible")
            .click({ force: true });
        cy.wait(5000);
        cy.get(".thumb-view-addForm").first().should("exist").click({ force: true });
        cy.get("#add-form-button").should("exist").click({ force: true });
        cy.intercept("POST", "/uploadSelectedPdfFormNew?SelectedDealershipId=").as("uploadSelectedFormNew")
        cy.url().should("include", "/taptosignlight.html");

        cy.visit("http://taptosign.com/dashboard.html");
        cy.wait("@loadSalesPersonData", { timeout: customTimeout });
        cy.wait("@loadDeals", { timeout: customTimeout });
        cy.get(".table-button-name").first().contains("Still Preparing").should("exist")
    });

    it("send esign link to device", () => {
        cy.visit("http://taptosign.com/dashboard.html");
        
        // Intercept necessary routes
        cy.intercept("POST", "/getSalespersonData").as("loadSalesPersonData");
        cy.intercept("POST","/getSalesPersonTapToSignLogNew?search=&page=0&size=25&showDeleted=undefined&showHidden=false&selectedDealFilter=&selectedDealTypeFilter=&salesPersonFilter=&dateTypeFilter=Created%20Date&secondDealershipId=&sortby=-1&startDate=&endDate=").as("loadDeals")
        
        cy.wait("@loadDeals", { timeout: customTimeout });
        cy.get("td").contains("Edit Deal").first().should("exist").click({ force: true });

        // Perform actions to create a deal
        
        cy.url().then((pageUrl) => {
            // Extract the authtoken using URLSearchParams
            const urlParams = new URLSearchParams(pageUrl.split("?")[1]); // Get the query string part
            const authToken = urlParams.get("authtoken");
    
            // Assert that authtoken is present
            expect(authToken).to.not.be.null;
            cy.intercept("GET", `/getDealerCenterPdfData?authtoken=${authToken}*`).as("getDealerCenterPdfData");
            cy.intercept("GET", `/getRequiredForms?authtoken=${authToken}*`).as("getRequiredForms");
            cy.intercept("POST", `/getAllLabelForPrepareMode?authtoken=${authToken}*`).as("getAllLabelForPrepareMode");
            // cy.intercept("POST", /getFormName?authtoken=${authToken}*).as("getFormName");
        
            cy.intercept("POST", `/updateDealerCenterPDfData?authtoken=${authToken}*`).as("updateDealerCenterPdfData");
            cy.intercept("POST", "/checkDownloadPdfCopy").as("checkDownloadPdfCopy")
            cy.wait("@getRequiredForms", {timeout: customTimeout});
            cy.wait("@getAllLabelForPrepareMode", {timeout: customTimeout});

            cy.wait("@checkDownloadPdfCopy", { timeout: customTimeout });
            cy.get("#buyerNameFieldInput").type("nathy");
            cy.wait("@checkDownloadPdfCopy", { timeout: customTimeout });
            cy.get(".buyerlistitem").first().should("exist").click({ force: true });
            cy.wait("@updateDealerCenterPdfData", {timeout: customTimeout});
    
            cy.wait(5000)
            cy.get("#esign_on_ipad_text").should("exist").click({force: true})
    })
    cy.visit("http://taptosign.com/dashboard.html");
    cy.wait("@loadSalesPersonData", { timeout: customTimeout });
    cy.wait("@loadDeals", { timeout: customTimeout });

    cy.get(".table-button-name").first().contains("Sign In-Person").should("exist").click({ force: true });
    cy.wait(5000);
    cy.get("#BuyerSignatureDiv-0").should("exist");
  })
    it("create a new deal and send esign link to email", () => {

        cy.visit("http://taptosign.com/dashboard.html");

        // Intercept necessary routes
        cy.intercept("POST", "/getSalespersonData").as("loadSalesPersonData");
        cy.intercept("POST","/getSalesPersonTapToSignLogNew?search=&page=0&size=25&showDeleted=undefined&showHidden=false&selectedDealFilter=&selectedDealTypeFilter=&salesPersonFilter=&dateTypeFilter=Created%20Date&secondDealershipId=&sortby=-1&startDate=&endDate=").as("loadDeals")
        
        // Wait for data to load
        // cy.wait("@loadSalesPersonData", { timeout: customTimeout });
        cy.wait("@loadDeals", { timeout: customTimeout });

        // Perform actions on the dashboard
        cy.get(".btnSelectFormsblack")
            .contains("Forms Library")
            .should("exist")
            .should("be.visible")
            .click({ force: true });
        cy.wait(5000);
        cy.get(".thumb-view-addForm").first().should("exist").click({ force: true });
        cy.get("#add-form-button").should("exist").click({ force: true });
        cy.visit("http://taptosign.com/dashboard.html");
        cy.wait("@loadDeals", { timeout: customTimeout });
        cy.wait(5000)
        cy.get("td").contains("Edit Deal").first().should("exist").click({ force: true });

        cy.url().then((pageUrl) => {
            // Extract the authtoken using URLSearchParams
            const urlParams = new URLSearchParams(pageUrl.split("?")[1]); // Get the query string part
            const authToken = urlParams.get("authtoken");
    
            // Assert that authtoken is present
            expect(authToken).to.not.be.null;
            cy.intercept("GET", `/getDealerCenterPdfData?authtoken=${authToken}*`).as("getDealerCenterPdfData");
            cy.intercept("GET", `/getRequiredForms?authtoken=${authToken}*`).as("getRequiredForms");
            cy.intercept("POST", `/getAllLabelForPrepareMode?authtoken=${authToken}*`).as("getAllLabelForPrepareMode");
            // cy.intercept("POST", /getFormName?authtoken=${authToken}*).as("getFormName");
        
            cy.intercept("POST", `/updateDealerCenterPDfData?authtoken=${authToken}*`).as("updateDealerCenterPdfData");
            cy.intercept("POST", "/checkDownloadPdfCopy").as("checkDownloadPdfCopy")
            cy.wait("@getRequiredForms", {timeout: customTimeout});
            cy.wait("@getAllLabelForPrepareMode", {timeout: customTimeout});

            cy.wait("@checkDownloadPdfCopy", { timeout: customTimeout });
            cy.get("#buyerNameFieldInput").type("nathy");
            cy.wait("@checkDownloadPdfCopy", { timeout: customTimeout });
            cy.get(".buyerlistitem").first().should("exist").click({ force: true });
            cy.wait("@updateDealerCenterPdfData", {timeout: customTimeout});
    
            cy.wait(5000)
            cy.get("#E-mail-esign-0").should("exist").click({force: true})
            cy.get(".button-wrapper").contains("Send").should("exist").click({force: true})
        })
        

        // Perform actions to create a deal
        

       
        cy.visit("http://taptosign.com/dashboard.html")
        cy.wait("@loadSalesPersonData", { timeout: customTimeout });
        cy.wait("@loadDeals", { timeout: customTimeout });

        cy.get(".table-button-name").first().contains("Waiting on nathy").should("exist").click({ force: true });
        cy.wait(5000);
        cy.get("#BuyerSignatureDiv-0").should("exist");
    
    })
});
