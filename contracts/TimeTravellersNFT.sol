// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract TimeTravellersNFT is ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;

    //string public baseURI;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");

    Counters.Counter private _tokenCounter;

    event TokenCreated(
        uint256 indexed currentId,
        string tokenURI,
        address indexed minter
    );

    constructor()
        //string memory _newBaseURI
        ERC721("Time-Travellers-NFT", "TTN")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        _grantRole(URI_SETTER_ROLE, msg.sender);
        //baseURI = _newBaseURI;
    }

    struct Tweet {
        uint16 _tokenID; // +1/day = 179 years worth of ID's
        string _tokenURI;
        address owner;
    }

    //Tweet[] public arrayOffAllTweets;
    mapping(uint16 => Tweet) public IdToTweet;

    function getAllMintedTokensURI() external view returns (Tweet[] memory) {
        uint16 currentId = uint16(_tokenCounter.current());
        Tweet[] memory returnArray = new Tweet[](currentId);
        for (uint16 i = 1; i <= currentId; i++) {
            returnArray[i] = IdToTweet[i];
        }
        return returnArray;
    }

    function mintTweet(address _account, string memory _tokenURI)
        external
        onlyRole(MINTER_ROLE)
        returns (uint256)
    {
        _tokenCounter.increment();
        uint16 currentId = uint16(_tokenCounter.current());
        _safeMint(_account, currentId); // checks if id is already minted
        _setTokenURI(currentId, _tokenURI);
        //arrayOffAllTweets.push(Tweet(currentId, _tokenURI, _account));
        IdToTweet[currentId] = Tweet(currentId, _tokenURI, _account);
        emit TokenCreated(currentId, _tokenURI, _account);
        return currentId;
    }

    /*function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI)
        external
        onlyRole(URI_SETTER_ROLE)
        returns (string memory)
    {
        return baseURI = _newBaseURI;
    }
    */

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
