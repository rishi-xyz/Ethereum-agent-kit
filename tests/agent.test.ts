import GeminiAgent from "../src/agent/agent";

describe("createAgent", () => {
    it("should throw an error if API key is missing", () => {
        expect(() => new GeminiAgent("gemini-2.0-flash", "test-history.json")).toThrow("GEMINI_API_KEY is not set");
    });

    it("should create an agent with valid API key", () => {
        const agent = new GeminiAgent("gemini-2.0-flash", "test-history.json");
        expect(agent).toBeDefined();
    });
});