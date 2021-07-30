const DStorage = artifacts.require("DStorage");
const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

module.exports = async function(deployer) {
  // Deploy Token
  await deployer.deploy(Token);
  const token = await Token.deployed()

  // Deploy EthSwap
  await deployer.deploy(EthSwap, token.address);
  const ethSwap = await EthSwap.deployed()

  // Deploy DStorage
  await deployer.deploy(DStorage, ethSwap.address);

  // Transfer tokens
  // await token.transfer(ethSwap.address, '1000000000000000000000000')
  await token.transfer('0xab04B9661E1ae558dDc7097470529027ad9660B2', '500000000000000000000');
};
