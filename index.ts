import Web3 from "web3";
import { abi } from "./assets.ts";

const rpcUrl = process.env.METAMASK_RPC_URL;

if (!rpcUrl) {
  throw new Error("Please set the METAMASK_RPC_URL environment variable");
}

function log(args: any) {
  console.log("🤖", args);
}

const web3 = new Web3(rpcUrl);
const account = "0x90e63c3d53E0Ea496845b7a03ec7548B70014A91";
const omgToken = "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07";

async function getBalance(address: string): Promise<string> {
  return web3.eth
    .getBalance(address)
    .then((balance) => web3.utils.fromWei(balance, "ether"));
}

async function readSmartContractData(token: string) {
  const contract = new web3.eth.Contract(abi, token);
  const [name, symbol, balance] = await Promise.all([
    contract.methods.name().call(),
    contract.methods.symbol().call(),
    contract.methods.balanceOf(account).call(),
  ]);
  log(`token name: ${name}`);
  log(`token symbol: ${symbol}`);
  log(`token balance for address: ${balance}`);
}

async function run() {
  const [balance] = await Promise.all([
    getBalance(account),
    readSmartContractData(omgToken),
  ]);
  log(`${balance} wei`);
}

try {
  run();
} catch (err) {
  console.error("error executing code", err);
}
