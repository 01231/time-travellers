import React, { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ethers } from "ethers";
import Main from "./Components/Main";
import theme from "./config/theme";

function App() {
  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState({});

  // const provider = new ethers.providers.Web3Provider(window.ethereum);

  async function getAccount() {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } else {
      // eslint-disable-next-line
      window.alert("Install Metamask!");
    }
  }

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    async function gettingNetworkNameChainId() {
      const getNetWork = await provider.getNetwork();
      setNetwork(getNetWork);
    }

    getAccount();
    gettingNetworkNameChainId();
  }, []);

  function handleChainChanged() {
    // We reload the page, because it is recommend by metamask
    window.location.reload();
  }

  useEffect(() => {
    window.ethereum.on("chainChanged", handleChainChanged);
    return () => {
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  // For now, 'eth_accounts' will continue to always return an array
  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      window.location.reload();
    }
  }
  // on account change
  useEffect(() => {
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router className="App">
        <Routes>
          <Route
            path="/"
            element={
              <Main
                network={network}
                account={account}
                getAccount={getAccount}
              />
            }
          />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
