import React, { useRef, useEffect, useState } from "react";
import {
  Button,
  Container,
  Typography,
  Link,
  Card,
  CardMedia,
  Box,
  Grid,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import GLOBE from "vanta/dist/vanta.globe.min";
import ThemeToggle from "./ThemeToggle";
import URLInput from "./URLInput";
import Calendar from "./Calendar";
import Header from "./Header";

import { BASE_URL, FUNCTIONS_PREFIX } from "../config/globals";
import { ReactComponent as WalletIcon } from "../assets/icons/wallet.svg";
import { ReactComponent as TwitterIcon } from "../assets/icons/twitter.svg";

const tweetURLPattern =
  /^((?:http:\/\/)?|(?:https:\/\/)?)?(?:www\.)?twitter\.com\/(\w+)\/status\/(\d+)$/i;

const beautifyAddress = (address) =>
  `${address.substr(0, 6)}...${address.substr(-4)}`;

function Main({ account, network, getAccount }) {
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
  const [vantaEffect, setVantaEffect] = useState(0);

  const myRef = useRef(null);
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        GLOBE({
          el: myRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          // minHeight: 2.0,
          // minWidth: 320.0,
          scale: 1.0,
          // scaleMobile: 1.0,
          color: 0xca3e6d,
          size: 0.9,
          backgroundColor: 0x131318,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

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
      <Box
        sx={{
          minHeight: "100%",
          top: 0,
          left: 0,
          right: 0,
          zIndex: -1,
          position: "absolute",
        }}
        ref={myRef}
      />
      <Header />
      <Grid container>
        <Grid item xs={12} sx={{ height: "100vh" }}>
          <Typography variant="h1">Time Travellers DAO</Typography>
          <Typography variant="subtitle1" component="p">
            Preserving history!
          </Typography>
        </Grid>
        <Grid id="time-machine" item xs={12}>
          <Typography variant="h2">Time Machine</Typography>
          <Calendar sx={{ pt: 100 }} />
        </Grid>
        <Grid id="vote" item xs={12}>
          <Typography variant="h2">Vote</Typography>
          {/* TODO: make link dynamic */}
          <Link href="https://snapshot.org/#/3.spaceshot.eth/proposal/0xd0d72b5fcc26c406db68a41f10517fb3d16dbe8c903d811add57e6b099ed364e">
            Snapshot
          </Link>
        </Grid>
        <Grid id="propose" item xs={12}>
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
        </Grid>
        <Grid id="faq" item xs={12}>
          <Typography variant="h2">FAQ</Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Main;
