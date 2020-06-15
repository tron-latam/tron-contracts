const chai = require('chai');
chai.use(require('chai-bignumber')());
const wait = require('../helpers/wait')

const { expect } = chai;

const TRC721Mock = artifacts.require('TRC721Mock.sol');

async function expectRevert(txId) {
  wait(3);
  const { ret } = await tronWeb.trx.getTransaction(txId);
  expect(ret[0].contractRet).to.equal('REVERT');
}

async function expectEvent(contract, eventName, eventResult) {
  const watcher = await contract[eventName]().watch((err, res) => {
    if (err) throw err
    if (res) {
      const { result } = res;
      expect(result).to.deep.include(eventResult);
      watcher.stop();
    }
  });
}

contract('ERC721', function (accounts) {
  const [ creator, owner, other, ...otherAccounts ] = accounts;
  let token;
  let tronWebContract;

  beforeEach(async function () {
    token = await TRC721Mock.deployed();
    tronWebContract = await tronWeb.contract().at(token.address)
  });

  describe('internal functions', function () {
    const tokenId = '1234';

    describe('_mint(address, uint256)', function () {

      context('with minted token', async function () {
        beforeEach(async function () {
          await token.mint(owner, tokenId);
        });

        it('emits a Transfer event', async function() {
          await expectEvent(tronWebContract, 'Transfer', {
            tokenId,
            to: tronWeb.address.toHex(owner),
            from: '410000000000000000000000000000000000000000'
          });
        });

        it('creates the token', async function () {
          expect(await token.balanceOf(owner)).to.be.bignumber.equal('1');
          expect(await token.ownerOf(tokenId)).to.equal(tronWeb.address.toHex(owner));
        });

        it('reverts when adding a token id that already exists', async function () {
          const res = await token.mint(owner, 1234);
          await expectRevert(await token.mint(owner, tokenId));
        });
      });
    }); 

    describe('_burn(address, uint256)', function () {
      it('reverts when burning a non-existent token id', async function () {
        await expectRevert(
          await token.burn(owner, 0000)
        );
      });

      context('with minted token', function () {
        beforeEach(async function () {
          await token.mint(owner, tokenId);
        });

        it('reverts when the account is not the owner', async function () {
          await expectRevert(
            await token.burn(other, tokenId)
          );
        });

        context('with burnt token', function () {
          beforeEach(async function () {
            await token.burn(owner, tokenId);
          });

          it('emits a Transfer event', async function () {
            await expectEvent(tronWebContract, 'Transfer', {
              tokenId
            });
          });

          it('deletes the token', async function () {
            expect(await token.balanceOf(tronWeb.address.toHex(owner))).to.be.bignumber.equal('0');
          });

          it('reverts when burning a token id that has been deleted', async function () {
            await expectRevert(
              await token.burn(owner, tokenId)
            );
          });
        });
      });
    });
  });
});