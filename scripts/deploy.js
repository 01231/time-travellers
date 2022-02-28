const hre = require("hardhat");
const {
  storeContractAddress,
  verifyContract,
  printEtherscanLink,
} = require("./helper-functions");

const { ethers, network } = hre;

async function main() {
  const { chainId } = network.config;
  const contractName = "TimeTravellersNFT";
  const args = ["ipfs://"];

  const TTN = await ethers.getContractFactory(contractName);
  const ttn = await TTN.deploy(...args);

  await ttn.deployed();
  await storeContractAddress(ttn, contractName);
  await verifyContract(ttn, args);

  console.log("Deployer:", (await ethers.getSigners())[0].address);
  console.log(`${contractName} deployed to:`, ttn.address);

  printEtherscanLink(ttn.address, chainId);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
