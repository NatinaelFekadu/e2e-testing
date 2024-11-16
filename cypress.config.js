const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "hkphby",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
