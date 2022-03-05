import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Box,
  Stepper,
  StepLabel,
  Stack,
  Step,
  Card,
  CardMedia,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ReactComponent as WalletIcon } from "../assets/icons/wallet.svg";
import URLInput from "./URLInput";

import {
  BASE_URL,
  FUNCTIONS_PREFIX,
  REACT_APP_PINATA_API_KEY,
  REACT_APP_PINATA_API_SECRET,
} from "../config/globals";

const standardErrorMessage = "Something went wrong. Pleas try again later!";
const tweetURLPattern =
  /^((?:http:\/\/)?|(?:https:\/\/)?)?(?:www\.)?twitter\.com\/(\w+)\/status\/(\d+)$/i;

const getTweetId = (tweetURL) => {
  const splitTweetURL = tweetURL.split("/");
  const lastItem = splitTweetURL[splitTweetURL.length - 1];
  const splitLastItem = lastItem.split("?");
  return splitLastItem[0];
};

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

  useEffect(() => {
    if (account && network.chainId !== 4 && !state.formErrorMessage) {
      setState({
        ...state,
        formErrorMessage: "Please use the Rinkeby Test network to proceed.",
      });
    }
    if (account && network.chainId === 4 && activeStep === 0) {
      setState({
        ...state,
        formErrorMessage: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, activeStep, network.chainId]);

  // eslint-disable-next-line arrow-body-style
  const isDuplicateTweet = (tweetId) => {
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.pinata.cloud/data/pinList?status=pinned&metadata[keyvalues]={"tweetId":{"value":"${tweetId}","op":"eq"}}`,
        {
          method: "GET",
          headers: {
            pinata_api_key: REACT_APP_PINATA_API_KEY,
            pinata_secret_api_key: REACT_APP_PINATA_API_SECRET,
          },
        }
      )
        .then(async (res) => res.json())
        .then((json) => {
          if (json.error) {
            reject(new Error(standardErrorMessage));
          }
          if (json.rows.length > 0) {
            setState({
              ...state,
              formErrorMessage:
                "This Tweet was already suggested. Try another one!",
            });
            setFormIsSubmitting(false);
            resolve(true);
          }
          resolve(false);
        });
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    // setState({
    //   ...state,
    //   formErrorMessage: "",
    // });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(1);
  };

  const handleImageFetch = async () => {
    const { tweetURL, language, theme } = state;
    const tweetId = getTweetId(tweetURL);

    setFormIsSubmitting(true);

    setState({
      ...state,
      imageData: "",
    });

    try {
      if (await isDuplicateTweet(tweetId)) {
        return;
      }
    } catch (err) {
      setState({
        ...state,
        formErrorMessage: standardErrorMessage,
      });
      setFormIsSubmitting(false);
      return;
    }

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

  const getTokenURI = async () => {
    const { tweetURL } = state;
    const tweetId = getTweetId(tweetURL);

    try {
      if (await isDuplicateTweet(tweetId)) {
        return;
      }
    } catch (err) {
      setState({
        ...state,
        formErrorMessage: standardErrorMessage,
      });
      return;
    }

    await fetch(`${BASE_URL}${FUNCTIONS_PREFIX}/token`, {
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
      .then(() => {
        handleNext();
      })
      .catch((err) => {
        setState({
          ...state,
          formErrorMessage: err.message,
        });
      });
  };

  const handleSuggest = async () => {
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
      handleNext: handleSuggest,
    },
  ];

  return (
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
                  ((!state.tweetURL || state.invalidTweetURLMessage) &&
                    activeStep === 1) ||
                  !account ||
                  network.chainId !== 4 ||
                  formIsSubmitting
                }
              >
                {steps[activeStep].nextBtnText}
              </Button>
            </Stack>
            <Box sx={{ mt: 1 }}>
              <Typography color="error" variant="caption">
                {state.formErrorMessage}
              </Typography>
            </Box>
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
              suggest another
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}

export default Propose;
