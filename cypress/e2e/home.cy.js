const customTimeout = 25000
describe("home", () => {
    beforeEach(() => {
        cy.viewport(1280, 720); // Set viewport to desktop size
    });

    it("user sign in and creating a deal", () => {
        // Set up intercept for the salesperson data request before the login
        cy.intercept("POST", "/getSalespersonData").as("loadSalesPersonData");
        cy.intercept("POST","/getSalesPersonTapToSignLogNew?search=&page=0&size=25&showDeleted=undefined&showHidden=false&selectedDealFilter=&selectedDealTypeFilter=&salesPersonFilter=&dateTypeFilter=Created%20Date&secondDealershipId=&sortby=-1&startDate=&endDate=").as("loadDeals")
        cy.intercept("GET", "/getDealTypes?dealershipId=natnael").as("loadDealTypes")
        cy.intercept("POST", "/getDealStatuses").as("loadDealStatuses")
        cy.intercept("POST", "/getDealershipNameOnDocWithGdrive").as("loadDealershipNameOnDocWithGdrive")
        cy.intercept("POST", "/getAllDealershipSalesPersonList").as("loadAllDealershipSalesPersonList")
        cy.intercept("POST", "/getProfile").as("loadProfile")
        cy.intercept("POST", "/getBuyerListSalesPersonIpad?search=&page=0&size=25").as("loadBuyerListSalesPersonIpad")
        cy.intercept("POST", "/getBuyerListSalesPersonIpad?search=&isTestDrive=true&page=0&size=25").as("loadBuyerListSalesPersonIpad2")
        cy.intercept("POST", "/getBuyerListSalesPersonIpad?search=&isTestDrive=true&page=0&size=customTimeout").as("loadBuyerListSalesPersonIpad3")
        cy.intercept("POST", "/getInventoryInfo").as("loadInventoryInfo")
        cy.intercept("POST", "/getVaultLienholders").as("loadVaultLienholders")
        cy.intercept("POST", "/getTaptosignSlide").as("loadTaptosignSlide")
        cy.intercept("POST", "/getDealershipSalesPersonList").as("loadDealershipSalesPersonList")
        cy.intercept("POST", "/getDealEmails?dealershipId=natnael").as("loadDealEmails")
        cy.intercept("GET", "/getFormLogs?dealershipId=natnael").as("loadForms")
        cy.intercept("POST", "/getDealershipFormListNew").as("loadDealershipFormListNew")
        cy.intercept("POST", "/uploadSelectedPdfFormNew?SelectedDealershipId=").as("uploadSelectedFormNew")
        cy.intercept("POST", "/getProfileById").as("loadProfileById")
        
        // Visit the root page
        cy.visit("http://taptosign.com");

        // Check for the login button, click it
        // cy.get("#loginButton").should("exist").click();

        // // Fill in the login form with actual credentials from environment variables
        // cy.get("#EmailAddress").type(Cypress.env("EMAIL"));
        // cy.get("#Password").type(Cypress.env("PASSWORD"));
        // cy.get("#manualLogin").click();

        // // Wait for and skip the 2FA step
        // cy.get("#2FA-popup").should("exist");
        // cy.get("#2FA-popup").rightclick();        // Trigger a right-click
        // cy.get("#skip-button").should("exist").click();

        // // Wait for the /getSalespersonData request to complete
        // cy.wait("@loadSalesPersonData", { timeout: customTimeout });
        // cy.wait("@loadDeals", { timeout: customTimeout });
        // cy.wait("@loadDealTypes", { timeout: customTimeout });
        // cy.wait("@loadDealStatuses", { timeout: customTimeout });
        // cy.wait("@loadDealershipNameOnDocWithGdrive", { timeout: customTimeout });
        // cy.wait("@loadAllDealershipSalesPersonList", { timeout: customTimeout });
        // // cy.wait("@loadProfile", { timeout: customTimeout });  
        // // cy.wait("@loadBuyerListSalesPersonIpad", { timeout: customTimeout });
        // // cy.wait("@loadBuyerListSalesPersonIpad2", { timeout: customTimeout });
        // // cy.wait("@loadBuyerListSalesPersonIpad3", { timeout: customTimeout });
        // // cy.wait("@loadInventoryInfo", { timeout: customTimeout });
        // // cy.wait("@loadVaultLienholders", { timeout: customTimeout });
        // // cy.wait("@loadTaptosignSlide", { timeout: customTimeout });
        // // cy.wait("@loadDealEmails");
        // // cy.wait("@loadDealershipSalesPersonList", { timeout: customTimeout });
        
        
        // // Verify redirection to the dashboard
        // cy.url().should("include", "/dashboard");
        
        // // Interact with the dashboard element
        // cy.get("#formsLibrary").should("exist").should("be.visible").click({force: true});
        // cy.wait("@loadForms", { timeout: customTimeout })
        // cy.wait("@loadDealershipFormListNew", { timeout: customTimeout })
        
        // // select a form and create a deal
        // cy.get("#formImage0").should("exist").click()
        // cy.get("#add-form-button").should("exist").click()
        // cy.wait("@uploadSelectedFormNew", { timeout: customTimeout })
        // .then((interception) => {
        //     const body = interception.response.body;

        //     // Parse the body if it's still in JSON string format
        //     const parsedBody = typeof body === "string" ? JSON.parse(body) : body;

        //     // Assert the response status
        //     expect(parsedBody.status).to.eq("200"); // Status is a string

        //     // Ensure the data and link exist
        //     expect(parsedBody.data).to.have.property("link");

        //     // Modify the link
        //     const link = parsedBody.data.link.replace("https://taptosign.com/", "localhost/");

        //     const regex = /authtoken=([^&]*)/; // Match 'authtoken' followed by '=' and capture everything until '&'
        //     const match = link.match(regex);
        
        //     // If the authtoken is found, match will contain the value
        //     const authToken = match ? match[1] : null;
        
        //     // Assert that the authtoken is present
        //     expect(authToken).to.not.be.null;

        //     cy.intercept("GET", `/getDealerCenterPdfData?authtoken=${authToken}*`).as("getDealerCenterPdfData");
        //     cy.intercept("GET", `/getRequiredForms?authtoken=${authToken}*`).as("getRequiredForms");
        //     cy.intercept("POST", `/getAllLabelForPrepareMode?authtoken=${authToken}*`).as("getAllLabelForPrepareMode");
        //     // cy.intercept("POST", `/getFormName?authtoken=${authToken}*`).as("getFormName");
        
        //     cy.intercept("POST", `/updateDealerCenterPDfData?authtoken=${authToken}*`).as("updateDealerCenterPdfData");
        
        //     // Log the extracted authtoken
        //     cy.log("Extracted authtoken:", authToken);

        //     // Navigate to the modified link
        //     cy.visit(link + "&prepareform=true");
        //     cy.wait("@loadSalesPersonData", { timeout: customTimeout });
        //     cy.wait("@loadProfileById", {timeout: customTimeout})

        // });
        // cy.wait("@getDealerCenterPdfData", {timeout: customTimeout});
        // cy.wait("@getRequiredForms", {timeout: customTimeout});
        // cy.wait("@getAllLabelForPrepareMode", {timeout: customTimeout});
        // // cy.wait("@getFormName", {timeout: customTimeout});
        // cy.get("#buyerNameFieldInput").type("Test Buyer");
        // cy.get("#menu0").should("exist").click({force: true});
        // cy.get("#BuyerSignature").should("exist").click({force: true});
        // cy.get("#thecanvas").should("exist").click({force: true})


        // cy.wait("@updateDealerCenterPdfData", {timeout: customTimeout});
        // cy.wait("@updateDealerCenterPdfData", {timeout: customTimeout});
        // cy.get("#esign_on_ipad_text").should("exist").click({force: true})
        // cy.visit("http://localhost/dashboard.html")
        // cy.wait("@loadSalesPersonData", { timeout: customTimeout });
        // cy.wait("@loadDeals", { timeout: customTimeout });
        // cy.wait("@loadDealTypes", { timeout: customTimeout });
        // cy.wait("@loadDealStatuses", { timeout: customTimeout });
        // cy.wait("@loadDealershipNameOnDocWithGdrive", { timeout: customTimeout });
        // cy.wait("@loadAllDealershipSalesPersonList", { timeout: customTimeout });

        // cy.get("#deal0").should("exist").click({force: true})

        // cy.wait("#esign_on_ipad_text").should("exist").click({force: true})


    });
});
