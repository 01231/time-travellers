// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

//
contract TimeTravellersToken is ERC20, ReentrancyGuard {
    uint256 public constant PRICE = 10000000000000;
    uint256 public constant MAX_TOKEN_CAP = 10000 * 10**18;
    uint256 public currentSupply = 2000 * 10**18;
    mapping(address => uint256) private userToChange;

    constructor() ERC20("Time-Travellers-Token", "TTT") {
        _mint(msg.sender, 1000 * 10**18);
        _mint(0x24011E9598937bfBFb27FD4D8E9b8FDA42Fa239f, 1000 * 10**18);
    }

    function mint(address to, uint256 amount) external payable {
        require(msg.value >= amount * PRICE, "You didnt send enough ether");
        uint256 paid = amount * PRICE;
        userToChange[msg.sender] = msg.value - paid;
        uint256 newSupply = currentSupply += amount;
        require(newSupply <= MAX_TOKEN_CAP, "Exceeding max supply");
        _mint(to, amount);
    }

    function withdraw() external nonReentrant {
        require(userToChange[msg.sender] > 0, "You don't have any change");
        (bool success, ) = msg.sender.call{value: userToChange[msg.sender]}("");
        userToChange[msg.sender] = 0;
        require(success, "Transaction failed");
    }
}
