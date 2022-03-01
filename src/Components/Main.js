import React from "react";
import { Button } from "@mui/material";

function Main({ account, network, getAccount }) {
  return (
    <div>
      <div>{account}</div>
      <div>
        {network.name}: {network.chainId}
      </div>

      <Button variant="contained" onClick={getAccount}>
        Log in with Metamask
      </Button>
    </div>
  );
}

export default Main;
