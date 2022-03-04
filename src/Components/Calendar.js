import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import NFT from "../config/contracts/TimeTravellersNFT.json";
import nftAddress from "../config/contracts/map.json";

function Calendar({ provider }) {
  const [allTweets, setAllTweets] = useState([]);
  async function fetchAllTweets() {
    const NFTContract = new ethers.Contract(
      nftAddress[4].TimeTravellersNFT,
      NFT.abi,
      provider
    );
    /* for gas estimation in cant to optimize our contract - 
    const gasCost = await NFTContract.estimateGas.getAllMintedTokens();
    console.log(gasCost); */
    const result = await NFTContract.getAllMintedTokens();
    setAllTweets(result);
  }
  // Only runs once, first load
  useEffect(() => {
    fetchAllTweets();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // for testing purposes, feel free to remove them
  // -----
  async function getName() {
    const NFTContract = new ethers.Contract(
      nftAddress[4].TimeTravellersNFT,
      NFT.abi,
      provider
    );
    const result = await NFTContract.name();
    console.log(result);
  }
  async function mintToken() {
    const signer = provider.getSigner();
    const NFTContract = new ethers.Contract(
      nftAddress[4].TimeTravellersNFT,
      NFT.abi,
      signer
    );
    await NFTContract.mintTweet(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "https://twitter.com/BinanceUS/status/1499457941510004745"
    );
  }
  // -----
  return (
    <div>
      <button type="button" onClick={(e) => fetchAllTweets(e)}>
        fetch All tweets
      </button>
      <button type="button" onClick={(e) => mintToken(e)}>
        mint Token
      </button>
      <button type="button" onClick={(e) => getName(e)}>
        get Name
      </button>
      <br />
      Calendar
      <div>
        {allTweets.map((index) => (
          <div key={index.tokenID}> {index.tokenURI}</div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
