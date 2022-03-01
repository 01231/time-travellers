import React from "react";

function Main({ account, network, getAccount }) {
  return (
    <div>
      <div>{account}</div>
      <div>
        {network.name}: {network.chainId}
      </div>
      <button
        type="button"
        className="btn-danger"
        onClick={(e) => getAccount(e)}
      >
        Log in with Metamask
      </button>
    </div>
  );
}

export default Main;
