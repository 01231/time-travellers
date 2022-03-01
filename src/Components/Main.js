import React from "react";

function Main({
  fileURL,
  account,
  network,
  getAccount,
  UploadJson,
  handleUrlChange,
  changeFormInputName,
  changeFormInputDescription,
}) {
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

      {/*  <div
        className="row d-flex justify-content-around"
        style={{ paddingTop: "300px", height: "65vh" }}
      >
        <div
          className="col-md-3 "
          style={{
            backgroundColor: "rgba(5, 10, 2, .4)",
            borderRadius: "3%",
            color: "black",
          }}
        >
          <h1>Fill in the Form </h1>
          <h4>(You must fill out every input field)</h4>
          <div>
            Name:
            <input
              style={{ width: "100%" }}
              placeholder="Name max 14 letters"
              type="text"
              maxLength="14"
              onChange={(e) => changeFormInputName(e)}
            />
            <br />
            Description:
            <textarea
              style={{ width: "100%", backgroundColor: "rgb(161, 170, 169)" }}
              placeholder="Description max 70 letters"
              type="text"
              maxLength="70"
              onChange={(e) => changeFormInputDescription(e)}
            />
            <br />
            Choose the File to upload
            <input
              style={{ width: "100%", backgroundColor: "rgb(161, 170, 169)" }}
              type="file"
              name="Asset"
              onChange={(e) => handleUrlChange(e)}
            />
            <button
              style={{ width: "100%", backgroundColor: "rgb(206, 235, 183)" }}
              onClick={UploadJson}
              type="button"
            >
              {" "}
              Upload image and meta to IPFS
            </button>
          </div>
        </div>

        {fileURL && (
          <div
            className="card col-md-2 tokenCard "
            style={{ marginLeft: "5px", height: "43vh" }}
          >
            <img
              className=" card-img-top imageId"
              src={fileURL}
              alt="Your upload "
            />
            <div className="card-body">
              <div className="card-title" id="nftName">
                "Name of tweet"
              </div>
              <div className="card-text" id="nftDescription">
                "Description of Tweet"
              </div>
              <div id="nftPrice">"Some other data?"</div>
            </div>
          </div>
        )}

        <br />
      </div> */}
    </div>
  );
}

export default Main;
