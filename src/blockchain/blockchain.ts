import { ethers } from "ethers";
import { provider, wallet } from "../ethereum/eth";
import { FunctionDeclaration, FunctionDeclarationsTool, SchemaType, Tool } from "@google/generative-ai";

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
}

export const balanceTool: FunctionDeclarationsTool = {
    functionDeclarations: [balanceDeclarations]
};

type getEthBalanceProps = {
    address: string,
}

export async function getEthBalance({ address }: getEthBalanceProps): Promise<string> {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
}

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
}

export const sendEthTool: FunctionDeclarationsTool = {
    functionDeclarations: [sendEthDeclaration]
}

type sendEthProps = {
    to: string,
    amount: string,
}

export async function sendEth({ to, amount }: sendEthProps) {
    const tx = await wallet.sendTransaction({
        to,
        value: ethers.parseEther(amount),
    });
    await tx.wait();
    return tx.hash;
}