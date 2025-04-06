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

/**
 * Declaration for the deployERC20 tool
 * @param abi - The ABI (Application Binary Interface) of the ERC20 smart contract.
 *              It defines the structure of the contract's functions, events, and interactions.
 * @param bytecode - The compiled bytecode of the ERC20 smart contract, required for deployment.
 * @param tokenName - The name of the ERC20 token (e.g., "Test Token").
 * @param tokenSymbol - The symbol of the ERC20 token (e.g., "TST").
 *
 * @returns The declaration for deploying an ERC20 contract.
 */

const deployERC20Declaration: FunctionDeclaration = {
    name: "createERC20",
    description: "Funtionality to Create or Deploy simple or complex ERC20 token or contract on the Ethereum blockchain using abi or application binary code and bytecode",
    parameters: {
        type: SchemaType.OBJECT,
        properties: {
            abi: {
                type: SchemaType.STRING,
                description: "ABI of the smart contract in JSON stringified format"
            },
            bytecode: {
                type: SchemaType.STRING,
                description: "The compiled bytecode of the ERC20 contract"
            },
            tokenName: {
                type: SchemaType.STRING,
                description: "The name of the ERC20 token"
            },
            tokenSymbol: {
                type: SchemaType.STRING,
                description: "The symbol of the ERC20 token"
            },
            decimals: {
                type: SchemaType.NUMBER,
                description: "determines how many decimal places a token can be divided into default is 18"
            },
            initialsupply: {
                type: SchemaType.STRING,
                description: "amount of token to mint initially default is 1000000"
            },
        },
        required: ["abi", "bytecode", "tokenName", "tokenSymbol", "decimals", "initialsupply"]
    }
};

export {
    balanceDeclarations,
    sendEthDeclaration,
    deployERC20Declaration
};

/**
 * type: SchemaType.ARRAY,
                description: "The ABI (Application Binary Interface) defining the contract's structure",
                items: {
                    type: SchemaType.OBJECT,
                    description: "An ABI item (function, constructor, event, etc.)",
                    properties: {
                        type: {
                            type: SchemaType.STRING,
                            description: "The ABI entry type (e.g., function, constructor, fallback, event, receive)"
                        },
                        name: {
                            type: SchemaType.STRING,
                            description: "Name of the function or event (if applicable)"
                        },
                        inputs: {
                            type: SchemaType.ARRAY,
                            description: "Input parameters (if applicable)",
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    name: {
                                        type: SchemaType.STRING,
                                        description: "Parameter name"
                                    },
                                    type: {
                                        type: SchemaType.STRING,
                                        description: "Solidity data type"
                                    }
                                },
                                required: ["type"]
                            }
                        },
                        outputs: {
                            type: SchemaType.ARRAY,
                            description: "Output parameters (for functions)",
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    name: {
                                        type: SchemaType.STRING,
                                        description: "Output name (optional)"
                                    },
                                    type: {
                                        type: SchemaType.STRING,
                                        description: "Solidity return type"
                                    }
                                },
                                required: ["type"]
                            }
                        },
                        stateMutability: {
                            type: SchemaType.STRING,
                            description: "State mutability (e.g., view, pure, payable, nonpayable)"
                        },
                        anonymous: {
                            type: SchemaType.BOOLEAN,
                            description: "Whether the event is anonymous (for events only)"
                        }
                    },
                    required: ["type"]
                }
 */