import { FunctionDeclarationsTool } from "@google/generative-ai";
import { balanceDeclarations, deployERC20Declaration, getTransactionDetailsDeclaration, sendEthDeclaration } from "../declarations";

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

/**
 * deployERC20 Tool
 * @returns The tool to deploy ERC-20 tokens to Ethereum Blockchain
 * @throws If the declaration is not valid
 */

const deployERC20Tool: FunctionDeclarationsTool = {
    functionDeclarations: [deployERC20Declaration]
}

/**
 * getTransactionDetails Tool
 * @returns The tool to get details of the transaction using it's transaction hash
 * @throws If declaration is not valid
 */

const getTransactionDetailsTool: FunctionDeclarationsTool = {
    functionDeclarations: [getTransactionDetailsDeclaration]
}

export {
    balanceTool,
    sendEthTool,
    deployERC20Tool,
    getTransactionDetailsTool,
};