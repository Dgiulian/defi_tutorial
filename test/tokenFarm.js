const { assert } = require('chai');

const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");
const TokenFarm = artifacts.require("TokenFarm");

require('chai').use(require('chai-as-promised')).should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether')
}
contract('TokenFarm', ([owner, investor]) => {
    let daiToken;
    let dappToken;
    let tokenFarm;
    before(async () => {

        // Instance contracts
        daiToken = await DaiToken.new();
        dappToken = await DappToken.new();
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);
        // Transfer all Dapp tokens to farm (1 million)
        await dappToken.transfer(tokenFarm.address, tokens('1000000'));

        // Send tokens to investors. Tell who's making the transfer
        await daiToken.transfer(investor, tokens('100'), { from: owner })

    })
    describe('Mock DAI deployment', async () => {

        it('Has a name', async () => {
            const name = await daiToken.name();
            assert.equal(name, 'Mock DAI Token');
        })
    })
    describe('Dapp Token deployment', async () => {
        it('has a name', async () => {
            const name = await dappToken.name();
            assert(name, 'DApp Token');
        })
    })
    describe('Token Farm deployment', async () => {
        it('has a name', async () => {
            const name = await tokenFarm.name();
            assert(name, 'Dapp Token Farm');
        });
        it('Should have the Dapp tokens', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address);
            assert.equal(balance.toString(), tokens('1000000'));
        })
    })

    describe('Farming Tokens', async () => {
        it('rewards investors for staking mDai tokens', async () => {
            let result;
            // Check investor balance before staking
            result = await daiToken.balanceOf(investor);

            assert.equal(result.toString(), tokens('100'), 'Investor Mock Dail balance correct before staking');

            // Stake Mock DAI Tokens
            await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor });
            await tokenFarm.stakeTokens(tokens('100'), { from: investor });

            // Check staking result
            const investorDaiBalance = await daiToken.balanceOf(investor);
            assert.equal(investorDaiBalance.toString(), tokens('0'), 'investor Mock DAI wallet balance incorrect after staking');

            const farmDaiBalance = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(farmDaiBalance.toString(), tokens('100'), 'Token farm mock dai balance incorrect after staking');

            const investorDappBalance = await tokenFarm.stakingBalance(investor);
            assert.equal(investorDappBalance.toString(), tokens('100'), 'investor staking balance incorrect after staking');

            const investorIsStaking = await tokenFarm.isStaking(investor);
            assert.equal(investor.toString(), 'true', 'Investor is staking status is incorrect');

        })
    })
})