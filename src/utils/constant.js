const RDXRWabi = require('./RedDotRewardToken.json')
const UNIabi = require('./UniToken.json')
const MSCabi = require('./MasterChef.json')

const RDXabi = require('./RedDotToken.json')
const POOabi = require('./PoolPair.json')
const WJKabi = require('./WojakToken.json')

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

const WJKToken = {
    contractABI: WJKabi.abi,
    contractAddress: '0x5115E5b0A2CdDDe4f5b80f674855dff5b5BB3b66'
}
const RDXToken = {
    contractABI: RDXabi.abi,
    contractAddress: '0xf502F5266A9ED86a58775499a9728f397a2e33C6'
}
const PoolPair = {
    contractABI: POOabi.abi,
    contractAddress: '0xeEBB4792E21928081cD51B51450Ff205C7C41fb1'
}

const INFURA_API = 'https://ropsten.infura.io/v3/8bf322110b8c4fbf87055c7fd3981adf'
const KOVAN_API = 'https://kovan.infura.io/v3/8bf322110b8c4fbf87055c7fd3981adf'

module.exports = {
    MasterChef, UNIToken, RDXRewardToken, WJKToken, RDXToken, PoolPair, INFURA_API, KOVAN_API
}
