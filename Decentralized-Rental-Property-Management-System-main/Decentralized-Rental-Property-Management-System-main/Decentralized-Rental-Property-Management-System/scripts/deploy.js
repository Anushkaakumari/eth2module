// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const RentalToken = await hre.ethers.getContractFactory("RentalToken");
  const rentalToken = await RentalToken.deploy();
  await rentalToken.deployed();

  console.log(`Contract deployed with address : ${rentalToken.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


