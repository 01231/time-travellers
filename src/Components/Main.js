import React from "react";
// eslint-disable-next-line
const Main = ({ account, chainId, FirstLoadGettingAccount }) => {
  return (
    <div>
      <div>Main</div>
      <div>{account}</div>
      <div>{chainId}</div>
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
