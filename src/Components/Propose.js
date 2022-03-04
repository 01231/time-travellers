import React, { useState } from "react";
import {
  Button,
  Typography,
  Box,
  Stepper,
  StepLabel,
  Stack,
  Step,
  Paper,
  Card,
  CardMedia,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ReactComponent as WalletIcon } from "../assets/icons/wallet.svg";
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
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(1);
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
        handleNext();
      })
      .catch((err) => {
        setState({
          ...state,
          formErrorMessage: err.message,
        });
        setFormIsSubmitting(false);
      });
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
      .then((data) => {
        handleNext();
        return data.tokenURI;
      })
      .catch((err) => {
        setState({
          ...state,
          formErrorMessage: err.message,
        });
      });
  };

  const handleMint = async () => {
    setFormIsSubmitting(true);
    await getTokenURI();
    setFormIsSubmitting(false);
  };

  const steps = [
    {
      title: "Login",
      caption: "Connect to MetaMask",
      description: (
        <LoadingButton
          // loading={loading}
          // value="1"
          // name="wallet"
          fullWidth
          loadingIndicator="connecting..."
          aria-label="connect to metamask"
          variant="contained"
          onClick={getAccount}
          endIcon={<WalletIcon />}
          sx={{ mt: 1 }}
        >
          {account ? beautifyAddress(account) : "Connect"}
        </LoadingButton>
      ),
      nextBtnText: "Next",
      handleNext: handleNext,
    },
    {
      title: "Clone",
      caption: "Style and create the Tweet",
      description: (
        <URLInput
          state={state}
          formIsSubmitting={formIsSubmitting}
          handleChange={handleChange}
        />
      ),
      nextBtnText: "Clone",
      handleNext: handleImageFetch,
    },
    {
      title: "Propose",
      caption: "Submit you suggestion",
      description: (
        <Card sx={{ width: 1, mt: 2 }}>
          <CardMedia
            component="img"
            image={`data:image/png;base64,${state.imageData}`}
            alt="screenshot of tweet"
          />
        </Card>
      ),
      nextBtnText: "Propose",
      handleNext: handleMint,
    },
  ];

  return (
    <>
      <Typography variant="h2">Propose</Typography>
      <Box sx={{ maxWidth: 400 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((step, i) => (
            <Step key={step.title} sx={{ pl: i === 0 ? 0 : 1 }}>
              <StepLabel>{step.title}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mb: 2, mt: 2 }}>
          {activeStep !== steps.length ? (
            <>
              <Typography>{steps[activeStep].description}</Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  disabled={activeStep === 0 || formIsSubmitting}
                  variant="outlined"
                  onClick={handleBack}
                  sx={{ flexGrow: 1 }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={steps[activeStep].handleNext}
                  sx={{ flexGrow: 1 }}
                  disabled={
                    !account || network.chainId !== 4 || formIsSubmitting
                  }
                >
                  {steps[activeStep].nextBtnText}
                </Button>
              </Stack>
            </>
          ) : (
            <>
              <Typography>
                Your suggestion has been successfully submitted!
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleReset}
                sx={{ mt: 1, mr: 1 }}
              >
                Reset
              </Button>
            </>
          )}
        </Box>
      </Box>
    </>
  );
}

export default Propose;
