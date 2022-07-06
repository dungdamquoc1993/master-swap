import { ethers } from 'ethers'

import { MasterChef, UNIToken, RDXRewardToken, WJKToken, RDXToken, PoolPair } from './constant'
const { ethereum } = window

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
    } else if (contractName === 'wjk') {
        contract = new ethers.Contract(WJKToken.contractAddress, WJKToken.contractABI, signer)
    } else if (contractName === 'rdx') {
        contract = new ethers.Contract(RDXToken.contractAddress, RDXToken.contractABI, signer)
    } else if (contractName === 'poo') {
        contract = new ethers.Contract(PoolPair.contractAddress, PoolPair.contractABI, signer)
    }
    return contract

}