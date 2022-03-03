// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

//
contract TimeTravellersToken is ERC20, ReentrancyGuard {
    mapping(address => uint256) private userToChange;

    constructor() ERC20("Time-Travellers-Token", "TTT") {
        _mint(0x2b4F0b671c96d4E4Bbe8Ca084a037902C0c8929c, 9000 * 10**18);
        _mint(0x24011E9598937bfBFb27FD4D8E9b8FDA42Fa239f, 1000 * 10**18);
    }
}
