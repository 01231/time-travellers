import React, { useState } from "react";
import { Button, Typography, Card, CardMedia } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ReactComponent as WalletIcon } from "../assets/icons/wallet.svg";
import { ReactComponent as TwitterIcon } from "../assets/icons/twitter.svg";
import ThemeToggle from "./ThemeToggle";
import URLInput from "./URLInput";

import { BASE_URL, FUNCTIONS_PREFIX } from "../config/globals";

const tweetURLPattern =
  /^((?:http:\/\/)?|(?:https:\/\/)?)?(?:www\.)?twitter\.com\/(\w+)\/status\/(\d+)$/i;

const beautifyAddress = (address) =>
  `${address.substr(0, 6)}...${address.substr(-4)}`;

function Propose({ account, network, getAccount }) {
  const [state, setState] = useState({
    theme: "light",
    language: "en",
    tweetURL: "",
    invalidTweetURLMessage: "",
    formErrorMessage: "",
    imageData: "",
    nftMetadata: "",
  });
  const [formIsSubmitting, setFormIsSubmitting] = React.useState(false);

  const handleImageFetch = async () => {
    const { tweetURL, language, theme } = state;
    setFormIsSubmitting(true);

    setState({
      ...state,
      imageData: "",
    });

    // if (await isDuplicateTweet()) {
    //   setFormIsSubmitting(false);
    //   return;
    // }

    // if (await isImageCached(language, theme, tweetURL)) {
    //   setFormIsSubmitting(false);
    //   handleNext();
    //   return;
    // }

    fetch(`${BASE_URL}${FUNCTIONS_PREFIX}/image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ tweetURL, language, theme }),
    })
      .then(async (res) => {
        if (res.status === 200) return res.json();
        const errorMessage = (await res.json()).error;
        throw new Error(errorMessage);
      })
      .then(async (data) => {
        const { image, metadata } = data;
        setState({
          ...state,
          imageData: image,
          nftMetadata: metadata,
        });
        // await saveToCache(image, metadata, language, theme, tweetURL);
        setFormIsSubmitting(false);
        // handleNext();
      })
      .catch((err) => {
        setState({
          ...state,
          formErrorMessage: err.message,
        });
        setFormIsSubmitting(false);
      });
  };

  const handleClick = (e) => {
    if (e.target.name === "next") {
      handleImageFetch();
    }
  };

  const handleChange = (target) => {
    const { value, name } = target;

    if (name === "tweetURL") {
      const trimmedURL = value.split("?")[0];
      const invalidTweetURLMessage =
        value && !tweetURLPattern.test(trimmedURL)
          ? "This URL is not valid."
          : "";

      setState({
        ...state,
        [name]: trimmedURL,
        invalidTweetURLMessage: invalidTweetURLMessage,
      });
      return;
    }

    setState({
      ...state,
      [name]: value,
    });
  };

  // eslint-disable-next-line arrow-body-style
  const getTokenURI = () => {
    return fetch(`${BASE_URL}${FUNCTIONS_PREFIX}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        imageData: state.imageData,
        tweetURL: state.tweetURL,
        metadata: state.nftMetadata,
        chainId: network.chainId,
        address: account,
      }),
    })
      .then(async (res) => {
        if (res.status === 200) return res.json();
        const errorMessage = (await res.json()).error;
        throw new Error(errorMessage);
      })
      .then((data) => data.tokenURI)
      .catch((err) => {
        setState({
          ...state,
          formErrorMessage: err.message,
        });
        setFormIsSubmitting(false);
      });
  };

  const handleMint = async () => {
    setFormIsSubmitting(true);
    // const tokenURI = await getTokenURI();
    await getTokenURI();
    setFormIsSubmitting(false);
  };

  return (
    <>
      <Typography variant="h2">Propose</Typography>
      <div>
        {network.name}: {network.chainId}
      </div>
      <LoadingButton
        // loading={loading}
        // value="1"
        // name="wallet"
        // fullWidth
        loadingIndicator="connecting..."
        aria-label="connect to metamask"
        variant="contained"
        onClick={getAccount}
        endIcon={<WalletIcon />}
        sx={{ mt: 1 }}
      >
        {account ? beautifyAddress(account) : "Connect"}
      </LoadingButton>
      <ThemeToggle
        defaultTheme={state.theme}
        handleChange={handleChange}
        formIsSubmitting={formIsSubmitting}
      />
      <URLInput
        state={state}
        formIsSubmitting={formIsSubmitting}
        handleChange={handleChange}
      />
      <LoadingButton
        variant="contained"
        name="next"
        // sx={{ flexGrow: 1 }}
        // disabled={nextBtnDisabled}
        onClick={handleClick}
        // type={isForm ? "submit" : "button"}
        loading={formIsSubmitting}
        endIcon={<TwitterIcon width="24px" height="24px" />}
      >
        Clone Tweet
      </LoadingButton>
      {state.imageData && (
        <>
          <Card sx={{ width: 1, mt: 2 }}>
            <CardMedia
              component="img"
              image={`data:image/png;base64,${state.imageData}`}
              alt="screenshot of tweet"
            />
          </Card>
          <Button onClick={handleMint}>Upload to IPFS</Button>
        </>
      )}
    </>
  );
}

export default Propose;
