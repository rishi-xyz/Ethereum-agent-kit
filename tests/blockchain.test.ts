import { getEthBalance, sendEth } from "../src/blockchain/blockchain";
import { ethers } from "ethers";

// Mock ethers
jest.mock("ethers", () => {
    const actualEthers = jest.requireActual("ethers");
    return {
        ...actualEthers,
        formatEther: jest.fn().mockReturnValue("1.0"),
        parseEther: jest.fn().mockReturnValue("1000000000000000"),
    };
});

// Mock provider and wallet
jest.mock("../src/ethereum/eth", () => ({
    provider: {
        getBalance: jest.fn().mockResolvedValue("1000000000000000000"),
    },
    wallet: {
        sendTransaction: jest.fn().mockResolvedValue({
            wait: jest.fn().mockResolvedValue({ hash: "0x123" }),
            hash: "0x123",
        }),
    },
}));

describe("getEthBalance", () => {
    it("should return the balance of the address", async () => {
        const balance = await getEthBalance({ address: "0x52dfB13AA4B3cbE4E40f9B49f411bd38592E7FE4" });
        expect(balance).toBe("1.0");
    }, 10000);

    it("should throw an error if the address is not valid", async () => {
        const invalidAddress = "invalid-address";
        await expect(getEthBalance({ address: invalidAddress })).rejects.toThrow();
    }, 10000);
});

describe("sendEth", () => {
    it("should send ethereum to the address", async () => {
        const result = await sendEth({
            to: "0x52dfB13AA4B3cbE4E40f9B49f411bd38592E7FE4",
            amount: "0.001"
        });
        expect(result).toBe("0x123");
    }, 10000);

    it("should throw an error if the address is not valid", async () => {
        const invalidAddress = "invalid-address";
        await expect(sendEth({
            to: invalidAddress,
            amount: "0.001"
        })).rejects.toThrow();
    }, 10000);

    it("should throw an error if the amount is not valid", async () => {
        const invalidAmount = "invalid-amount";
        await expect(sendEth({
            to: "0x52dfB13AA4B3cbE4E40f9B49f411bd38592E7FE4",
            amount: invalidAmount
        })).rejects.toThrow();
    }, 10000);

    it("should throw an error if gas fee is not enough", async () => {
        // Mock the transaction to fail due to insufficient gas
        const mockWallet = require("../src/ethereum/eth").wallet;
        mockWallet.sendTransaction.mockRejectedValueOnce(new Error("insufficient funds for gas"));
        
        await expect(sendEth({
            to: "0x52dfB13AA4B3cbE4E40f9B49f411bd38592E7FE4",
            amount: "0.001"
        })).rejects.toThrow("insufficient funds for gas");
    }, 10000);
});