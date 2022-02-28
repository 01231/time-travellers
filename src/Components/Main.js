import React from "react";

const Main = (props) => {
  return (
    <div>
      <div>Main</div>
      <div>{props.account}</div>
      <div>{props.chainId}</div>
      <button
        className="btn-danger"
        onClick={(e) => props.FirstLoadGettingAccount(e)}
      >
        Log in with Metamask
      </button>
    </div>
  );
};

export default Main;
