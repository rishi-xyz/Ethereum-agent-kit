/**
 * Type for the getEthBalance function
 * @param address - The address of the Ethereum to get balance for
 * @returns The balance of the Ethereum address
 * @throws If the address is not a valid Ethereum address
 */

import { InterfaceAbi } from "ethers";

export type getEthBalanceProps = {
    address: string,
};

/**
 * Type for the sendEth function
 * @param to - The address of the Ethereum to send the balance to
 * @param amount - The amount of Ethereum to send
 * @returns The transaction hash of the Ethereum transaction
 * @throws If the transaction fails
 */

export type sendEthProps = {
    to: string,
    amount: string,
};

/**
 * Type for the deployERC20 dunctions
 * @param abi - The path for application binary interface of contract
 * @param bytecode - The path for bytecode of the contract
 * @param tokenName - Name of the ERC-20 token
 * @param tokenSymbol - The symbol of the ERC-20 token
 * @param decimals - optional decimals determines how many decimal places a token can be divided into
 * @param initialsupply - optional amount of token to mint initially
 */

export type deployERC20Props = {
    abi: string,
    bytecode: string,
    tokenName: string,
    tokenSymbol: string,
    decimals?: number,
    initialsupply?: string,
};