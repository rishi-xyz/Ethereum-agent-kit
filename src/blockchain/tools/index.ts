import { FunctionDeclarationsTool } from "@google/generative-ai";
import { balanceDeclarations, sendEthDeclaration } from "../declarations";

/**
 * Balance Tool
 * @returns The tool to get the balance of a Ethereum address
 * @throws If the declaration is not valid
 */

const balanceTool: FunctionDeclarationsTool = {
    functionDeclarations: [balanceDeclarations]
};

/**
 * SendEth Tool
 * @returns The tool to send ethereum to a address
 * @throws If the declaration is not valid
 */

const sendEthTool: FunctionDeclarationsTool = {
    functionDeclarations: [sendEthDeclaration]
};

export {
    balanceTool,
    sendEthTool,
};