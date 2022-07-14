const RDXRWabi = require('./RedDotRewardToken.json')
const UNIabi = require('./UniToken.json')
const MSCabi = require('./MasterChef.json')
const UniFactoryJson = require('./UniswapV2Factory.json')
const UniRouterJson = require('./UniswapV2Router02.json')
const UniPairJson = require('./UniswapV2Pair.json')
const ERC20Json = require('./ERC20.json')

const RDXabi = require('./RedDotToken.json') // drop
const POOabi = require('./PoolPair.json') // drop 
const WJKabi = require('./WojakToken.json') // drop

const MasterChef = {
    contractABI: MSCabi.abi,
    contractAddress: '0xd91619A74Ed9705Ff8F963cdD4f9802858Cfbf23'
}
const UNIToken = {
    contractABI: UNIabi.abi,
    contractAddress: '0xd0234367B856278C0a6c109697e2506F2afC1103'
}
const RDXRewardToken = {
    contractABI: RDXRWabi.abi,
    contractAddress: '0x8B6f5A7E549567162262fD5b13d5E4b6d8D0Ed02'
}

const UniFactory = {
    contractABI: UniFactoryJson.abi,
    contractAddress: '0x5558C5D2eba6f1eDebBc730c4E6F48ea25D48bbB'
}

const UniRouter = {
    contractABI: UniRouterJson.abi,
    contractAddress: '0x5E0E0aF77D0Ed166e774a851eCF2830ac6E3AF7f'
}
const UniPairAB = {
    contractABI: UniPairJson.abi,
    contractAddress: '0x72B3187D7AE6e20DbB998dE985606A5652AE7d34'
}
const CoinA = {
    contractABI: ERC20Json.abi,
    contractAddress: '0x9970b2BE1c71FB05F51220D703E79640DF18Fe74'
}
const CoinB = {
    contractABI: ERC20Json.abi,
    contractAddress: '0xe47d2812770A642Ef252053AB7f5d572b7FA4802'
}
const CoinC = {
    contractABI: ERC20Json.abi,
    contractAddress: '0x06D383b8c36bddf226FF5E8273A041Abde499B64'
}
const CoinD = {
    contractABI: ERC20Json.abi,
    contractAddress: '0x83461694D376b15099Eff993797F14A5b737Be2B'
}

const WJKToken = { // drop
    contractABI: WJKabi.abi,
    contractAddress: '0x5115E5b0A2CdDDe4f5b80f674855dff5b5BB3b66'
}
const RDXToken = { // drop
    contractABI: RDXabi.abi,
    contractAddress: '0xf502F5266A9ED86a58775499a9728f397a2e33C6'
}
const PoolPair = { // drop
    contractABI: POOabi.abi,
    contractAddress: '0xeEBB4792E21928081cD51B51450Ff205C7C41fb1'
}

const ROPSTEN_API = 'https://ropsten.infura.io/v3/8bf322110b8c4fbf87055c7fd3981adf'
const KOVAN_API = 'https://kovan.infura.io/v3/8bf322110b8c4fbf87055c7fd3981adf'

module.exports = {
    MasterChef, UNIToken, RDXRewardToken, 
    UniFactory, UniRouter, UniPairAB,
    CoinA, CoinB, CoinC, CoinD,
    ROPSTEN_API, KOVAN_API,

    RDXToken, PoolPair, WJKToken // drop
    
}

