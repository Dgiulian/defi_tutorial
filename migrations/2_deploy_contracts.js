const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");
const TokenFarm = artifacts.require("TokenFarm");


module.exports = async function (deployer, network, accounts) {
  // Deploy the mock DaiToken
  await deployer.deploy(DaiToken);
  // Read the deployed address
  const daiToken = await DaiToken.deployed()

  // Deploy the mock DappToken
  await deployer.deploy(DappToken);
  // Read the deployed address
  const dappToken = await DappToken.deployed()


  // Deploy the token farm with the corresponding arguments
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  // Transfer all dapp tokens (1 million)
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000');

  // Transfer 100 mock DAI tokens to investor
  await daiToken.transfer(accounts[1], '100000000000000000000')
};
