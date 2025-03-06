// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Blockchain {
    struct Block {
        string data;
        string signature;
        string publicKey;
        bool isVerified;
    }

    mapping(address => Block[]) public blocks;

    function addBlock(string memory data, string memory signature, string memory publicKey) public {
        blocks[msg.sender].push(Block(data, signature, publicKey, true));
    }

    function getBlocks() public view returns (Block[] memory) {
        return blocks[msg.sender];
    }

    function updateBlock(uint index, string memory newData) public {
        Block storage blockToUpdate = blocks[msg.sender][index];
        blockToUpdate.data = newData;
    }
}