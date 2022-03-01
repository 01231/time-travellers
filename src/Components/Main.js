import React from "react";
// eslint-disable-next-line
const Main = ({ account, network, FirstLoadGettingAccount }) => {
  return (
    <div>
      <div>{account}</div>
      <div>
        {network.name}: {network.chainId}
      </div>
      <button
        type="button"
        className="btn-danger"
        onClick={(e) => FirstLoadGettingAccount(e)}
      >
        Log in with Metamask
      </button>
    </div>
  );
};

export default Main;
