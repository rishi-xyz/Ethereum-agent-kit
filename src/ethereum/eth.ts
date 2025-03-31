import { ethers } from "ethers";
import { config } from "../config/config";

/**
 * Provider for the Ethereum blockchain
 */

const provider = new ethers.JsonRpcProvider(config.rpcUrl);

/**
 * Wallet for the Ethereum blockchain
 */

const wallet = new ethers.Wallet(config.privateKey, provider);

export { provider, wallet };
