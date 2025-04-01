import { FunctionDeclaration, SchemaType } from "@google/generative-ai";

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

export {
    balanceDeclarations,
    sendEthDeclaration,
};