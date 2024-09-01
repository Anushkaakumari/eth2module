// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract RentalToken {
    address payable public owner;
    string public tokenName = "RentalToken";
    string public tokenAbbrv = "RNT";
    uint256 public totalSupply;
    uint256 public propertyCount;

    struct Property {
        uint256 id;
        address payable landlord;
        string location;
        uint256 rentAmount;
        bool isAvailable;
    }

    mapping(address => uint256) public balances;
    mapping(uint256 => Property) public properties;
    mapping(address => uint256) public rentedProperties;

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    constructor() payable {
        owner = payable(msg.sender);
    }

    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    function getTokenName() public view returns (string memory) {
        return tokenName;
    }

    function getTokenAbbrv() public view returns (string memory) {
        return tokenAbbrv;
    }

    function getTotalSupply() public view returns (uint256) {
        return totalSupply;
    }

    function listProperty(string memory _location, uint256 _rentAmount) public {
        properties[propertyCount] = Property(propertyCount, payable(msg.sender), _location, _rentAmount, true);
        propertyCount++;
    }

    function rentProperty(uint256 _propertyId) public {
        Property storage property = properties[_propertyId];
        require(property.isAvailable, "Property is not available for rent");
        require(balances[msg.sender] >= property.rentAmount, "Insufficient balance");

        balances[msg.sender] -= property.rentAmount;
        balances[property.landlord] += property.rentAmount;
        rentedProperties[msg.sender] = _propertyId;
        property.isAvailable = false;
    }

    function rechargeAccount(uint256 _amount) public payable {
        balances[msg.sender] += _amount;
        totalSupply += _amount;
    }
}
