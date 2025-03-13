import { processQuery } from "../src/agent/agent";
import { uploadContractFile } from "../src/blockchain/blockchain";

// Mock `uploadContractFile`
jest.mock("../src/blockchain/blockchain", () => ({
    uploadContractFile: jest.fn()
}));

describe("Agent - File Upload", () => {
    it("should process file upload requests correctly", async () => {
        const mockFilePath = "/fake/path/contract.abi";
        const mockFileContents = `{ "abi": "test-abi" }`;

        // Mock AI calling the upload function
        (uploadContractFile as jest.Mock).mockResolvedValue(mockFileContents);

        const response = await processQuery(`Upload contract file at ${mockFilePath}`);

        expect(response).toContain("File successfully uploaded");
        expect(response).toContain(mockFileContents);
    });
});
