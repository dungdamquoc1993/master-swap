import { ethers } from 'ethers'

import {
    MasterChef, UNIToken, RDXRewardToken,
    UniFactory, UniRouter, UniPairAB,
    CoinA, CoinB, CoinC, CoinD,

    RDXToken, PoolPair, WJKToken // drop
} from './constant'
const { ethereum } = window

export const getPairContract = async (pairName) => {
    if (!ethereum) {
        alert('please install metamask˝')
    }
    let pairContract
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const contractFactory = new ethers.Contract(UniFactory.contractAddress, UniFactory.contractABI, signer)
    if (pairName === 'ab') {
        const pairAddress = await contractFactory.getPair(CoinA.contractAddress, CoinB.contractAddress)
        pairContract = new ethers.Contract(pairAddress, UniPairAB.contractABI, signer)
    } else if (pairName === 'bc') {
        const pairAddress = await contractFactory.getPair(CoinC.contractAddress, CoinB.contractAddress)
        pairContract = new ethers.Contract(pairAddress, UniPairAB.contractABI, signer)
    } else if (pairName === 'cd') {
        const pairAddress = await contractFactory.getPair(CoinC.contractAddress, CoinD.contractAddress)
        pairContract = new ethers.Contract(pairAddress, UniPairAB.contractABI, signer)
    } else if (pairName === 'ac') {
        const pairAddress = await contractFactory.getPair(CoinC.contractAddress, CoinD.contractAddress)
        pairContract = new ethers.Contract(pairAddress, UniPairAB.contractABI, signer)
    } else if (pairName === 'ad') {
        const pairAddress = await contractFactory.getPair(CoinC.contractAddress, CoinD.contractAddress)
        pairContract = new ethers.Contract(pairAddress, UniPairAB.contractABI, signer)
    } else if (pairName === 'bd') {
        const pairAddress = await contractFactory.getPair(CoinC.contractAddress, CoinD.contractAddress)
        pairContract = new ethers.Contract(pairAddress, UniPairAB.contractABI, signer)
    }
    return pairContract
}

export const getContract = async (contractName) => {
    if (!ethereum) {
        alert('please install metamask˝')
    }
    let contract
    const provider = new ethers.providers.Web3Provider(ethereum)

    const signer = provider.getSigner()

    if (contractName === 'msc') {
        contract = new ethers.Contract(MasterChef.contractAddress, MasterChef.contractABI, signer)
    } else if (contractName === 'uni') {
        contract = new ethers.Contract(UNIToken.contractAddress, UNIToken.contractABI, signer)
    } else if (contractName === 'rdxrw') {
        contract = new ethers.Contract(RDXRewardToken.contractAddress, RDXRewardToken.contractABI, signer)
    } else if (contractName === 'a') {
        contract = new ethers.Contract(CoinA.contractAddress, CoinA.contractABI, signer)
    } else if (contractName === 'b') {
        contract = new ethers.Contract(CoinB.contractAddress, CoinB.contractABI, signer)
    } else if (contractName === 'c') {
        contract = new ethers.Contract(CoinC.contractAddress, CoinC.contractABI, signer)
    } else if (contractName === 'd') {
        contract = new ethers.Contract(CoinD.contractAddress, CoinD.contractABI, signer)
    } else if (contractName === 'ufac') {
        contract = new ethers.Contract(UniFactory.contractAddress, UniFactory.contractABI, signer)
    } else if (contractName === 'urou') {
        contract = new ethers.Contract(UniRouter.contractAddress, UniRouter.contractABI, signer)
    }

    else if (contractName === 'wjk') { // drop
        contract = new ethers.Contract(WJKToken.contractAddress, WJKToken.contractABI, signer)
    } else if (contractName === 'rdx') { // drop
        contract = new ethers.Contract(RDXToken.contractAddress, RDXToken.contractABI, signer)
    } else if (contractName === 'poo') { // drop
        contract = new ethers.Contract(PoolPair.contractAddress, PoolPair.contractABI, signer)
    }
    return contract

}