import React from "react";
import { IconButton } from "@mui/material";

import { ReactComponent as SnapshotIcon } from "../assets/icons/snapshot.svg";
import { ReactComponent as CodeIcon } from "../assets/icons/code.svg";
import { ReactComponent as OSIcon } from "../assets/icons/opensea.svg";

function Social() {
  return (
    <>
      <IconButton
        size="large"
        aria-label="snapshot"
        href="https://snapshot.org/#/3.spaceshot.eth"
        color="inherit"
        target="_blank"
        rel="noopener"
      >
        <SnapshotIcon width="24px" height="24px" />
      </IconButton>
      <IconButton
        size="large"
        aria-label="opensea"
        href="https://testnets.opensea.io/0xad795fdfec37188337e6e75cfda2eb9c1dff502d"
        color="inherit"
        target="_blank"
        rel="noopener"
      >
        <OSIcon width="24px" height="24px" />
      </IconButton>
      <IconButton
        size="large"
        aria-label="github"
        href="https://github.com/noahliechti/time-travellers"
        color="inherit"
        target="_blank"
        rel="noopener"
      >
        <CodeIcon width="24px" height="24px" />
      </IconButton>
    </>
  );
}

export default Social;
