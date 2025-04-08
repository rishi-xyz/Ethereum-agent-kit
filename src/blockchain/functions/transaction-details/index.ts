import { ethers } from "ethers";
import { getTransactionDetailsProps } from "../../../types/functions";
import { provider } from "../../../ethereum/eth";

/**
 * Function to get details about a transaction using its transaction hash
 * @param hash - The transaction hash 
 * @returns transaction details and transaction recipt details
 */

export async function getTransactionDetails({
    hash
}:getTransactionDetailsProps) {
    const tx = await provider.getTransaction(hash);
    const recipt = await provider.getTransactionReceipt(hash);
    return {
        Transaction:tx,
        Recipt:recipt
    }
}