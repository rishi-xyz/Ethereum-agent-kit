import { EthereumAgent } from "../agent/agent"

const abi2 = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            { "internalType": "string", "name": "", "type": "string" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            { "internalType": "string", "name": "", "type": "string" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            { "internalType": "uint8", "name": "", "type": "uint8" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "name": "balanceOf",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const bytecode = "0x608060405234801561001057600080fd5b5060405161010038038061010083398101604081905261002f91610035565b600080fd5b600080fdfea26469706673582212205a97ae6d162d51b3f5634dc45e8e0a3a96fef65314549c1f5c43a74a10cf91ce64736f6c634300080a0033";

async function testdeployERC20() {
    const agent = new EthereumAgent("gemini-2.0-flash");
    const agentRes = await agent.processQuery(`Create ERC-20 Token with token name as TestEthereumAgent symbol as TSTEG where abi is ${JSON.stringify(abi2)} and bytecode is ${bytecode}`)
    console.log(agentRes)
}

testdeployERC20();