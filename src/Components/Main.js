import React from "react";
import { Button, Container } from "@mui/material";
import ThemeToggle from "./ThemeToggle";
import URLInput from "./URLInput";

const tweetURLPattern =
  /^((?:http:\/\/)?|(?:https:\/\/)?)?(?:www\.)?twitter\.com\/(\w+)\/status\/(\d+)$/i;

function Main({ account, network, getAccount }) {
  const [state, setState] = React.useState({
    theme: "light",
    // language: "en",
    tweetURL: "",
    invalidTweetURLMessage: "",
    formErrorMessage: "",
  });

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

  return (
    <Container maxWidth="lg">
      <div>{account}</div>
      <div>
        {network.name}: {network.chainId}
      </div>

      <Button variant="contained" onClick={getAccount}>
        Log in with Metamask
      </Button>
      <ThemeToggle defaultTheme={state.theme} handleChange={handleChange} />
      <URLInput
        state={state}
        // formIsSubmitting={formIsSubmitting}
        handleChange={handleChange}
      />
    </Container>
  );
}

export default Main;
