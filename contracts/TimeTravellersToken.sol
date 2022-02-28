// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";

//
contract Token is ERC20, ReentrancyGuard{
    
    uint constant PRICE = 10000000000000;
    uint constant MAXTOKENCAP = 10000 * 10 ** 18;
    uint currentSupply = 2000 * 10 ** 18;
    mapping(address => uint) userToChange;

    constructor() ERC20("Time-Travellers", "TTT"){
        _mint(msg.sender, 1000 * 10 ** 18);
        _mint(0x24011E9598937bfBFb27FD4D8E9b8FDA42Fa239f, 1000 * 10 ** 18 );
    }

    function mint(address to, uint256 amount) payable external  {
        require(msg.value >= amount * PRICE, "You didnt send enough ether");
        uint paid = amount * PRICE;
        userToChange[msg.sender] = msg.value - paid;   
        uint newSupply = currentSupply += amount;
        require(newSupply <= MAXTOKENCAP, "Exceeding max supply");
        _mint(to, amount);
    }

    function withdraw() external nonReentrant {
        require(userToChange[msg.sender] > 0, "You don't have any change");
        (bool success,) = msg.sender.call{value: userToChange[msg.sender]}("");
        userToChange[msg.sender] = 0;
        require(success, "Transaction failed");
    }
}

