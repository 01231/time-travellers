exports.TWITTER_BEARER_TOKEN =
  process.env.NODE_ENV === "development"
    ? process.env.TWITTER_BEARER_TOKEN_DEV
    : process.env.TWITTER_BEARER_TOKEN;

exports.CHROME_EXECUTABLE_PATH =
  process.env.NODE_ENV === "development" // TODO: same on windows?
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : null;

exports.TWEET_SETTINGS = {
  TWEET_WIDTH: 1000,
  TWEET_PADDING: 25,
  TWEET_HIDE_THREAD: true,
  TWEET_HIDE_CARD: false,
};
