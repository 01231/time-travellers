import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.min.css";
// eslint-disable-next-line
import Main from "./Components/Main.js";

function App() {
  const [account, setAccount] = useState("");
  //const provider = new ethers.providers.Web3Provider(window.ethereum);

  // side loaded
  async function FirstLoadGettingAccount() {
    // eslint-disable-next-line
    if (typeof window.ethereum !== undefined) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } else {
      // eslint-disable-next-line
      window.alert("Install Metamask!");
    }
  }

  function handleChainChanged() {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
  }
  // on chain change

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

  // network
  const [network, setNetwork] = useState({
    chanId: "",
    name: "",
  });

  useEffect(() => {
    const providerTwo = new ethers.providers.Web3Provider(window.ethereum);

    async function gettingNetworkNameChainId() {
      const getNetWork = await providerTwo.getNetwork();
      setNetwork(getNetWork);
    }

    FirstLoadGettingAccount();
    gettingNetworkNameChainId();
  }, []);

  return (
    <Router className="App">
      <Routes>
        <Route path="/" element={<div>home</div>} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
      {/* eslint-disable-next-line */}
      <Main
        network={network}
        FirstLoadGettingAccount={FirstLoadGettingAccount}
      />
    </Router>
  );
}

export default App;
