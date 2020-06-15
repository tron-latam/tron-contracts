pragma solidity ^0.5.0;

import "../tokens/TRC721/TRC721.sol";

/**
 * @title ERC721Mock
 * This mock just provides a public safeMint, mint, and burn functions for testing purposes
 */
contract TRC721Mock is TRC721 {
    function safeMint(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }

    function safeMint(address to, uint256 tokenId, bytes memory _data) public {
        _safeMint(to, tokenId, _data);
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function burn(address owner, uint256 tokenId) public {
        _burn(owner, tokenId);
    }
}