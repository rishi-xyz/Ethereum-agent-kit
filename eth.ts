import { ethers } from "ethers";
import { config } from "./config";

const provider = new ethers.JsonRpcProvider(config.rpcUrl);
const wallet = new ethers.Wallet(config.privateKey, provider);

export { provider, wallet };