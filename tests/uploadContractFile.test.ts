import { uploadContractFile } from "../src/blockchain/blockchain";
import fs from "fs/promises";

// Mock the file system
jest.mock("fs/promises");

describe("uploadContractFile", () => {
    const mockFilePath = "/fake/path/contract.abi";
    const mockFileContents = `{ "abi": "test-abi" }`;

    it("should successfully read the file contents", async () => {
        // Mock `fs.readFile` to return the fake file contents
        (fs.readFile as jest.Mock).mockResolvedValue(mockFileContents);

        const result = await uploadContractFile({ filePath: mockFilePath });

        expect(result).toBe(mockFileContents);
        expect(fs.readFile).toHaveBeenCalledWith(expect.stringContaining(mockFilePath), "utf-8");
    });

    it("should throw an error if the file does not exist", async () => {
        // Mock `fs.readFile` to throw an error
        (fs.readFile as jest.Mock).mockRejectedValue(new Error("File not found"));

        await expect(uploadContractFile({ filePath: mockFilePath })).rejects.toThrow("Failed to read file: File not found");
    });
});
