require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

const { POLYGON_SCAN, REPORT_GAS, PRIMARY_PRIVATE_KEY, COINMARKETCAP_API_KEY } =
  process.env;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  accounts.forEach((account) => console.log(account));
});

module.exports = {
  solidity: "0.8.6",
  defaultNetwork: "localhost",
  networks: {
    hardhat: {
      // TODO: forking?
    },
    localhost: {
      chainId: 31337,
    },
    rinkeby: {
      chainId: 4,
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIMARY_PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: REPORT_GAS || false,
    currency: "ETH",
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
  etherscan: {
    apiKey: POLYGON_SCAN,
  },
};
