// jest config to run test in node.js environment
module.exports = {
    testEnvironment: "node",
    clearMocks: true, //resetting call history every test
    verbose: true, // showing test output detailed in terminal
    setupFiles: ["dotenv/config"]
}