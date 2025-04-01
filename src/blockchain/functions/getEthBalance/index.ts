import { ethers } from "ethers";
import { provider } from "../../../ethereum/eth";
import { getEthBalanceProps } from "../../../types/functions";

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