import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import Main from "./Components/Main";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
  const [fileURL, setFileURL] = useState(null);
  const [formInput, setFormInput] = useState({ name: "", description: "" });

  async function handleUrlChange(e) {
    // check e.target.files without target [0]
    // console.log(e.target.files)
    const file = e.target.files[0];
    // console.log(file)
    try {
      const added = await client.add(
        file
        /* , {
                progress: (prog) => console.log(`received ${prog}`)
            } */
      );
      // added is an object containing the path(hash), CID, and the size of the file
      // console.log(added)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileURL(url);
      // console.log(url)
    } catch (error) {
      console.log("Error uploading File:", error);
    }
  }

  async function UploadJson() {
    if (!formInput.name || !formInput.description || !fileURL) {
      return;
    }
    // upload to IPFS but this time with metadata
    // the metadata comes from a json, we need to stringify the data to upload it
    const data = JSON.stringify({
      name: formInput.name,
      description: formInput.description,
      image: fileURL,
    });
    // console.log(data)
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      // run a function that creates Sale and passes in the URL
      // mintNFT(url);
      console.log(url);
    } catch (error) {
      console.log("Error uploading File:", error);
    }
  }
  function changeFormInputDescription(e) {
    setFormInput({ ...formInput, description: e.target.value });
  }
  function changeFormInputName(e) {
    setFormInput({ ...formInput, name: e.target.value });
  }

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
    <Router className="App">
      <Routes>
        <Route
          path="/"
          element={
            <Main
              fileURL={fileURL}
              UploadJson={UploadJson}
              changeFormInputName={changeFormInputName}
              changeFormInputDescription={changeFormInputDescription}
              handleUrlChange={handleUrlChange}
              network={network}
              account={account}
              getAccount={getAccount}
            />
          }
        />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </Router>
  );
}

export default App;
