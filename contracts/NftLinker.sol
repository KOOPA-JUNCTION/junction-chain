// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import '../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '../node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import { IAxelarExecutable } from '../node_modules/@axelar-network/axelar-cgp-solidity/contracts/interfaces/IAxelarExecutable.sol';

contract NftLinker is ERC721, IERC721Receiver, IAxelarExecutable {
    mapping (uint256 => bytes) public original;
    mapping(string => string) public linkers;
    string chainName;

    function addLinker(string memory chain, string memory linker) external {
        linkers[chain] = linker;
    }

    constructor(string memory chainName_, address gateway) ERC721("Junction NFT Linker", "JCL") IAxelarExecutable(gateway) {
        chainName = chainName_;
    }

    function sendNFT(address operator, uint256 tokenId, string memory destinationChain, string memory destinationAddress) external {
        if(operator == address(this)) {
            require(ownerOf(tokenId) == _msgSender(), "NOT_YOUR_NFT");
            _sendMintedToken(tokenId, destinationChain, destinationAddress);
        } else {
            IERC721(operator).transferFrom(_msgSender(), address(this), tokenId);
            _sendNativeToken(operator, tokenId, destinationChain, destinationAddress);
        }
    }
    function onERC721Received(
        address operator, 
        address /*from*/, 
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        require(IERC721(operator).ownerOf(tokenId) == address(this), "DID_NOT_RECEIVE!");
        string memory destinationChain;
        string memory destinationAddress;
        (destinationChain, destinationAddress) = abi.decode(data, (string, string));
        if(operator == address(this)) {
            _sendMintedToken(tokenId, destinationChain, destinationAddress);
        } else {
            _sendNativeToken(operator, tokenId, destinationChain, destinationAddress);
        }
        return this.onERC721Received.selector;
    }

    function _sendMintedToken(uint256 tokenId, string memory destinationChain, string memory destinationAddress) internal {
        _burn(tokenId);
        string memory originalChain;
        address operator;
        uint256 originalTokenId;
        (originalChain, operator, tokenId) = abi.decode(original[tokenId], (string, address, uint256));
        bytes memory payload = abi.encode(originalChain, operator, originalTokenId, destinationAddress);
        gateway.callContract(destinationChain, linkers[destinationChain], payload);
    }
    
    function _sendNativeToken(address operator, uint256 tokenId, string memory destinationChain, string memory destinationAddress) internal {
        bytes memory  payload = abi.encode(chainName, operator, tokenId, destinationAddress);
        gateway.callContract(destinationChain, linkers[destinationChain], payload);
    }

    function _execute(string memory sourceChain, string memory sourceAddress, bytes calldata payload) internal override {
        require(keccak256(bytes(sourceAddress)) == keccak256(bytes(linkers[sourceChain])), "NOT_A_LINKER");
        string memory originalChain;
        address operator;
        uint256 tokenId;
        address destinationAddress;
        (originalChain, operator, tokenId, destinationAddress) = abi.decode(payload, (string,address,uint256,address));
        if(keccak256(bytes(originalChain)) == keccak256(bytes(chainName))) {
            IERC721(operator).transferFrom(address(this), destinationAddress, tokenId);
        } else {
            bytes memory originalData = abi.encode(originalChain, operator, tokenId);
            uint256 newTokenId = uint256(keccak256(originalData));
            original[newTokenId] = originalData;
            _safeMint(destinationAddress, newTokenId);
        }
    }
}