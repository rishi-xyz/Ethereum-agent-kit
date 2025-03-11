import { ethers } from "ethers";
import { provider, wallet } from "../ethereum/eth";
import { FunctionDeclaration, FunctionDeclarationsTool, SchemaType, Tool } from "@google/generative-ai";

/**
 * Send Eth to Another Address
 * Requires to:string [Address to send Ethereum] amount:string [Amount] 
*/

type sendEthProps = {
    to: string,
    amount: string,
}

export async function sendEth({ to, amount }: sendEthProps) {
    const tx = await wallet.sendTransaction({
        to,
        value: ethers.parseEther(amount),
    });
    console.log(`Transaction Hash: ${tx.hash}`);
    await tx.wait();
    return tx.hash;
}

/**
 * Read Data from a Smart Contract
 * Requires
 *  contractAddress: string [Address of Smart Address]
    abi: any [Application Binary Interface]
    functionName: string [Name of the function]
    args: any[] [Arugments if any]
*/

type ContractProps = {
    contractAddress: string,
    abi: any,
    functionName: string,
    args: any[],
}

export async function readContract({ contractAddress, abi, functionName, args }: ContractProps) {
    const contract = new ethers.Contract(contractAddress, abi, provider);
    return await contract[functionName](...args);
}

/**
 * Write Smart Contract
 * Requires
 *  contractAddress: string [Address of Smart Address]
    abi: any [Application Binary Interface]
    functionName: string [Name of the function]
    args: any[] [Arugments if any]
*/

export async function writeContract({ contractAddress, abi, functionName, args }: ContractProps) {
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    const tx = await contract[functionName](...args);
    console.log(`Transaction Hash: ${tx.hash}`);
    await tx.wait();
    return tx.hash;
}

//Eth balance declaration
const balanceDeclarations:FunctionDeclaration = {
    name:"EthBalance",
    description:"Get balance of a ethereum address",
    parameters:{
        type:SchemaType.OBJECT,
        properties:{
            address:{
                type:SchemaType.STRING,
                description:"The address of the Ethereum to get balance for"
            }
        },
        required:["address"],
    }
}

// Ethereum balance tool decalaration
export const balanceTool:FunctionDeclarationsTool = {
    functionDeclarations:[balanceDeclarations]
};

/**
 * Get ETH Balance of an Address
 * Requires address:string [Ethereum address to get the balance] 
*/

type getEthBalanceProps = {
    address: string,
}

export async function getEthBalance({ address }: getEthBalanceProps): Promise<string> {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
}

//weather tool
const wheatherdecalration: FunctionDeclaration = {
    name: "getWeather",
    description: "Get weather information for a given city",
    parameters: {
        type: SchemaType.OBJECT,
        properties: {
            city: { type: SchemaType.STRING, description: "The city to get weather for" },
        },
        required: ["city"],
    },
}


export const weatherTool: FunctionDeclarationsTool = {
    functionDeclarations: [wheatherdecalration]
};



//calculator tool
export const calculatorTool = {
    name: "calculator",
    description: "Perform basic arithmetic operations",
    parameters: {
        type: "object",
        properties: {
            a: { type: "number", description: "First number" },
            b: { type: "number", description: "Second number" },
            operation: { type: "string", enum: ["add", "subtract", "multiply", "divide"], description: "Operation type" },
        },
        required: ["a", "b", "operation"],
    },
    function: async ({ a, b, operation }: { a: number; b: number; operation: string }) => {
        switch (operation) {
            case "add": return { result: a + b };
            case "subtract": return { result: a - b };
            case "multiply": return { result: a * b };
            case "divide": return { result: b !== 0 ? a / b : "Error: Division by zero" };
            default: return { error: "Invalid operation" };
        }
    },
};
