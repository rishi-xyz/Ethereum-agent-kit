/**
 * Type for the getEthBalance function
 * @param address - The address of the Ethereum to get balance for
 * @returns The balance of the Ethereum address
 * @throws If the address is not a valid Ethereum address
 */
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