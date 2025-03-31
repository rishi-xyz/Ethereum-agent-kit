import { ethers } from "ethers";
import { provider, wallet } from "../ethereum/eth";
import { FunctionDeclaration, FunctionDeclarationsTool, SchemaType } from "@google/generative-ai";
import { getEthBalanceProps, sendEthProps } from "../types/functions";

/**
 * Declaration for the get balance tool
 * @param address - The address of the Ethereum to get balance for
 * @returns The declaration for the get balance tool
 */
const balanceDeclarations: FunctionDeclaration = {
    name: "EthBalance",
    description: "Get balance of a ethereum address",
    parameters: {
        type: SchemaType.OBJECT,
        properties: {
            address: {
                type: SchemaType.STRING,
                description: "The address of the Ethereum to get balance for"
            }
        },
        required: ["address"],
    }
};

/**
 * Balance Tool
 * @returns The tool to get the balance of a Ethereum address
 * @throws If the declaration is not valid
 */

export const balanceTool: FunctionDeclarationsTool = {
    functionDeclarations: [balanceDeclarations]
};

/**
 * Function to get the balance of a Ethereum address
 * @param getEthBalanceProps - The address of the Ethereum to get balance for
 * @returns The balance of the Ethereum address
 * @throws If the address is not a valid Ethereum address
 */

export async function getEthBalance({ address }: getEthBalanceProps): Promise<string> {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
}

/**
 * Declaration for the sendEth tool
 * @param to - The address to send ethereum
 * @param amount - The amount of ethereum to send
 * @returns The declaration for the sendEth tool
 */

const sendEthDeclaration: FunctionDeclaration = {
    name: "sendEth",
    description: "Send ethereum to a address",
    parameters: {
        type: SchemaType.OBJECT,
        properties: {
            to: {
                type: SchemaType.STRING,
                description: "The address to send ethereum"
            },
            amount: {
                type: SchemaType.STRING,
                description: "The amount of ethereum to send"
            }
        },
        required: ["to", "amount"],
    }
};

/**
 * SendEth Tool
 * @returns The tool to send ethereum to a address
 * @throws If the declaration is not valid
 */

export const sendEthTool: FunctionDeclarationsTool = {
    functionDeclarations: [sendEthDeclaration]
};

/**
 * Function to send ethereum to a address
 * @param sendEthProps - The address and amount of ethereum to send
 * @returns The hash of the transaction
 * @throws If the address is not a valid Ethereum address
 */

export async function sendEth({ to, amount }: sendEthProps) {
    const tx = await wallet.sendTransaction({
        to,
        value: ethers.parseEther(amount),
    });
    await tx.wait();
    return tx.hash;
}