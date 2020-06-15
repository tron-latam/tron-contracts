/* global artifacts */
var OwnableMock = artifacts.require('./OwnableMock.sol')
var BaseCappedTokenMock = artifacts.require('./BaseCappedTokenMock.sol')
var TRC721Mock = artifacts.require('./TRC721Mock.sol')

module.exports = function (deployer) {
  deployer.deploy(OwnableMock)
  deployer.deploy(BaseCappedTokenMock)
  deployer.deploy(TRC721Mock)
}
