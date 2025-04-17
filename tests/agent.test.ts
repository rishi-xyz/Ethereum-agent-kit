import { EthereumAgent } from "../src";

describe("createAgent", () => {
    it("should throw an error if API key is missing", () => {
        expect(() => new EthereumAgent({
            model: "gemini-2.0-flash",
            history_file: "test-history.json"
        })).toThrow("GEMINI_API_KEY is not set");
    });

    it("should create an agent with valid API key", () => {
        const agent = new EthereumAgent({
            model: "gemini-2.0-flash",
            history_file: "test-history.json"
        });
        expect(agent).toBeDefined();
    });
});