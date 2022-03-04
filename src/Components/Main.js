import React from "react";
import { Button, Container, Card, CardMedia } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ThemeToggle from "./ThemeToggle";
import URLInput from "./URLInput";
import Calendar from "./Calendar";

import { BASE_URL, FUNCTIONS_PREFIX } from "../config/globals";

const tweetURLPattern =
  /^((?:http:\/\/)?|(?:https:\/\/)?)?(?:www\.)?twitter\.com\/(\w+)\/status\/(\d+)$/i;

function Main({ account, network, getAccount, provider }) {
  const [state, setState] = React.useState({
    theme: "light",
    language: "en",
    tweetURL: "",
    invalidTweetURLMessage: "",
    formErrorMessage: "",
    imageData: "",
    nftMetadata: "",
  });
  const [formIsSubmitting, setFormIsSubmitting] = React.useState(false);

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
    <Container maxWidth="lg">
      <div>{account}</div>
      <div>
        {network.name}: {network.chainId}
      </div>

      <Button variant="contained" onClick={getAccount}>
        Log in with Metamask
      </Button>
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
      <Calendar provider={provider} />
    </Container>
  );
}

export default Main;
