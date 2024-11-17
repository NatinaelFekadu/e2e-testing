const customTimeout = 30000
let AuthToken = ""
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
        cy.intercept("POST", "/checkDownloadPdfCopy").as("checkDownloadPdfCopy")
        
        // Visit the root page
        cy.visit("http://taptosign.com");

        // Check for the login button, click it
        // get login button by text
        cy.get("a").contains("Login").should("exist").click({force: true});
        // cy.get("#loginButton").should("exist").click({force: true});

        // // Fill in the login form with actual credentials from environment variables
        cy.get("#EmailAddress").type(Cypress.env("EMAIL"));
        cy.get("#Password").type(Cypress.env("PASSWORD"));
        cy.get("a").contains("Sign In").click({force: true});

        // Wait for and skip the 2FA step
        // target element by its class name
        cy.get(".modal").should("exist").rightclick({force: true});
                // Trigger a right-click
        cy.get("a").contains("Skip").should("exist").click({force: true});

        // // Wait for the /getSalespersonData request to complete
        cy.wait("@loadSalesPersonData", { timeout: customTimeout });
        cy.wait("@loadDeals", { timeout: customTimeout });
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
        cy.url().should("include", "/dashboard");
        
        // // Interact with the dashboard element
        cy.get(".btnSelectFormsblack").contains("Forms Library").should("exist").should("be.visible").click({force: true});
        cy.wait("@loadDealershipFormListNew", { timeout: customTimeout })
        
        // // select a form and create a deal
        //target an element with class name which has space separted class names
        cy.get(".thumb-view-addForm").first().should("exist").click({force: true})
        // cy.get("#formImage0").should("exist").click({force: true})
        cy.get("#add-form-button").should("exist").click({force: true})
        cy.wait("@uploadSelectedFormNew", { timeout: customTimeout }).then((res) => {
            expect(res.response.statusCode).to.eq(200)
            const body = res.response.body;
            const parsedBody = typeof body === "string" ? JSON.parse(body) : body;
            const link = parsedBody.data.link
            const regex = /authtoken=([^&]*)/; // Match 'authtoken' followed by '=' and capture everything until '&'
            const match = link.match(regex);
            const authToken = match ? match[1] : null;
        
            // Assert that the authtoken is present
            expect(authToken).to.not.be.null;

            AuthToken = authToken;

            cy.intercept("GET", `/getDealerCenterPdfData?authtoken=${authToken}*`).as("getDealerCenterPdfData");
            cy.intercept("GET", `/getRequiredForms?authtoken=${authToken}*`).as("getRequiredForms");
            cy.intercept("POST", `/getAllLabelForPrepareMode?authtoken=${authToken}*`).as("getAllLabelForPrepareMode");
            // cy.intercept("POST", `/getFormName?authtoken=${authToken}*`).as("getFormName");
        
            cy.intercept("POST", `/updateDealerCenterPDfData?authtoken=${authToken}*`).as("updateDealerCenterPdfData");
            // cy.wait("@getDealerCenterPdfData", {timeout: customTimeout});
            cy.wait("@getRequiredForms", {timeout: customTimeout});
            cy.wait("@getAllLabelForPrepareMode", {timeout: customTimeout});
        })
        
        cy.wait("@checkDownloadPdfCopy", {timeout: customTimeout});
        cy.get("#buyerNameFieldInput").type("nathy");
        cy.wait("@checkDownloadPdfCopy", {timeout: customTimeout});
        // cy.get("#buyerEmailFieldInput").type("test@gmail.com", {force: true});+
        cy.wait("@checkDownloadPdfCopy", {timeout: customTimeout});
        cy.get(".buyerlistitem").first().should("exist").click({force: true});
        cy.wait("@updateDealerCenterPdfData", {timeout: customTimeout});
        // cy.get("a").contains("✍️").should("exist").click({force: true})
        // cy.get("#BuyerSignature").should("exist").click({force: true});
        // cy.get("#thecanvas").should("exist").click({force: true})
        cy.wait(5000)
        cy.get("#esign_on_ipad_text").should("exist").click({force: true})
        // cy.intercept("POST", `/resendDealerCenterNotification?authtoken=${AuthToken}*`).as("sendNotification");
        // cy.wait("@sendNotification", {timeout: customTimeout}).then((res) => {
        //     expect(res.response.statusCode).to.eq(200)
        // })
        cy.visit("http://taptosign.com/dashboard.html")
        cy.wait("@loadSalesPersonData", { timeout: customTimeout });
        cy.wait("@loadDeals", { timeout: customTimeout });
        cy.wait(5000)
        cy.get(".table-button-name").first().contains("Sign In-Person").should("exist").click({force: true})
        cy.wait(10000)
        cy.get("#BuyerSignatureDiv-0")
            .should('exist')
        
        cy.visit("http://taptosign.com/dashboard.html")
        cy.wait("@loadSalesPersonData", { timeout: customTimeout });
        cy.wait("@loadDeals", { timeout: customTimeout });

        cy.get(".btnSelectFormsblack").contains("Forms Library").should("exist").should("be.visible").click({force: true});
        cy.wait("@loadDealershipFormListNew", { timeout: customTimeout })
        
        // // select a form and create a deal
        //target an element with class name which has space separted class names
        cy.get(".thumb-view-addForm").first().should("exist").click({force: true})
        // cy.get("#formImage0").should("exist").click({force: true})
        cy.get("#add-form-button").should("exist").click({force: true})
        cy.wait("@uploadSelectedFormNew", { timeout: customTimeout }).then((res) => {
            expect(res.response.statusCode).to.eq(200)
            const body = res.response.body;
            const parsedBody = typeof body === "string" ? JSON.parse(body) : body;
            const link = parsedBody.data.link
            const regex = /authtoken=([^&]*)/; // Match 'authtoken' followed by '=' and capture everything until '&'
            const match = link.match(regex);
            const authToken = match ? match[1] : null;
        
            // Assert that the authtoken is present
            expect(authToken).to.not.be.null;

            AuthToken = authToken;

            cy.intercept("GET", `/getDealerCenterPdfData?authtoken=${authToken}*`).as("getDealerCenterPdfData");
            cy.intercept("GET", `/getRequiredForms?authtoken=${authToken}*`).as("getRequiredForms");
            cy.intercept("POST", `/getAllLabelForPrepareMode?authtoken=${authToken}*`).as("getAllLabelForPrepareMode");
            // cy.intercept("POST", `/getFormName?authtoken=${authToken}*`).as("getFormName");
        
            cy.intercept("POST", `/updateDealerCenterPDfData?authtoken=${authToken}*`).as("updateDealerCenterPdfData");
            // cy.wait("@getDealerCenterPdfData", {timeout: customTimeout});
            cy.wait("@getRequiredForms", {timeout: customTimeout});
            cy.wait("@getAllLabelForPrepareMode", {timeout: customTimeout});
        })
        
        cy.wait("@checkDownloadPdfCopy", {timeout: customTimeout});
        cy.get("#buyerNameFieldInput").type("nathy");
        cy.wait("@checkDownloadPdfCopy", {timeout: customTimeout});
        // cy.get("#buyerEmailFieldInput").type("test@gmail.com", {force: true});+
        cy.wait("@checkDownloadPdfCopy", {timeout: customTimeout});
        cy.get(".buyerlistitem").first().should("exist").click({force: true});
        cy.wait("@updateDealerCenterPdfData", {timeout: customTimeout});
        
        cy.wait(5000)
        cy.get("#E-mail-esign-0").should("exist").click({force: true})
        cy.get(".button-wrapper").contains("Send").should("exist").click({force: true})
        cy.visit("http://taptosign.com/dashboard.html")
        cy.wait("@loadSalesPersonData", { timeout: customTimeout });
        cy.wait("@loadDeals", { timeout: customTimeout });

        cy.get(".table-button-name").first().contains("Waiting on nathy").should("exist")
        



        
        


    });
});
