import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal'
import { MainContext } from '../context/MainContext'
import { UniRouter } from '../utils/constant';
import { getContract } from '../utils/getContract';
import { getCreate2Address } from "@ethersproject/address";
import { UniFactory, UNIToken, CoinA, CoinB, CoinC, CoinD } from "../utils/constant"
import { keccak256, solidityPack } from 'ethers/lib/utils';

interface PickTokenModalInterFace {
    isOpen: boolean;
    setOpenPickTokenModal: Function;
    modalName: string,
    tokenA: boolean
}

export const PickTokenModal = ({ isOpen, setOpenPickTokenModal, modalName, tokenA }: PickTokenModalInterFace) => {
    const { setAddLiquidityTokenA, setAddLiquidityTokenB, setSwapTokenA, setSwapTokenB } = useContext(MainContext)
    const coinNames = ['a', 'b', 'c', 'd', 'uni']
    const handlePressCoin = (name: string) => {
        if (modalName === 'swap') {
            if (tokenA) {
                setSwapTokenA(name === 'a' ? 'CoinA' : name === 'b' ? 'CoinB' : name === 'c' ? 'CoinC' :
                    name === 'd' ? 'CoinD' : name === 'uni' ? 'UNI' : '')
            } else {
                setSwapTokenB(name === 'a' ? 'CoinA' : name === 'b' ? 'CoinB' : name === 'c' ? 'CoinC' :
                    name === 'd' ? 'CoinD' : name === 'uni' ? 'UNI' : '')
            }
        } else if (modalName === 'add_liquidity') {
            if (tokenA) {
                setAddLiquidityTokenA(name === 'a' ? 'CoinA' : name === 'b' ? 'CoinB' : name === 'c' ? 'CoinC' :
                    name === 'd' ? 'CoinD' : name === 'uni' ? 'UNI' : '')
            } else {
                setAddLiquidityTokenB(name === 'a' ? 'CoinA' : name === 'b' ? 'CoinB' : name === 'c' ? 'CoinC' :
                    name === 'd' ? 'CoinD' : name === 'uni' ? 'UNI' : '')
            }
        }
        setOpenPickTokenModal(false)
    }
    const coinButtons = coinNames.map((name) => {
        return (
            <button style={{ marginRight: 20, marginBottom: 20, height: 40, width: 60, borderRadius: 10 }}
                onClick={() => handlePressCoin(name)}>
                <p>{name === 'a' ? 'CoinA' : name === 'b' ? 'CoinB' : name === 'c' ? 'CoinC' :
                    name === 'd' ? 'CoinD' : name === 'uni' ? 'UNI' : ''}</p>
            </button>
        )
    })
    return (
        <div style={{}}>
            <Modal isOpen={isOpen} onRequestClose={() => setOpenPickTokenModal(false)}
                style={{
                    overlay: {
                        height: window.innerHeight, width: window.innerWidth, position: 'fixed', justifyContent: 'center', alignItems: 'center'
                    },
                    content: {
                        height: window.innerHeight * 0.4, width: window.innerWidth * 0.25, borderRadius: 30,
                        position: 'absolute',
                        top: window.innerHeight * 0.2,
                        left: window.innerWidth * 0.36,
                    }
                }}>
                {coinButtons}
            </Modal>
        </div>
    )

}

interface ApproveModalInterFace {
    isOpen: boolean;
    setOpenApproveModal: Function;
}

export const ApproveModal = ({ isOpen, setOpenApproveModal }: ApproveModalInterFace) => {

    const { approveCoin, coinAApprove, coinBApprove, setCoinAAprove, setCoinBApprove, } = useContext(MainContext)
    const handleApproveCoinA = async () => {
        const success = await approveCoin(coinAApprove, UniRouter.contractAddress)
        success && setCoinAAprove('')
    }
    const handleApproveCoinB = async () => {
        const success = await approveCoin(coinBApprove, UniRouter.contractAddress)
        success && setCoinBApprove('')
    }
    return (
        <Modal isOpen={isOpen} onRequestClose={() => setOpenApproveModal(false)}
            style={{
                overlay: {
                    height: window.innerHeight, width: window.innerWidth, position: 'fixed', justifyContent: 'center', alignItems: 'center'
                },
                content: {
                    height: window.innerHeight * 0.4, width: window.innerWidth * 0.25, borderRadius: 30,
                    position: 'absolute',
                    top: window.innerHeight * 0.2,
                    left: window.innerWidth * 0.36,
                }
            }}>
            {coinAApprove && <div>
                <p>Approve Us to access Your {coinAApprove === 'a' ? 'CoinA' : coinAApprove === 'b' ? 'CoinB' : coinAApprove === 'c' ? 'CoinC' :
                    coinAApprove === 'd' ? 'CoinD' : coinAApprove === 'uni' ? 'Uni' : ''}</p>
                <button onClick={handleApproveCoinA}>
                    <p>Approve</p>
                </button>
            </div>}
            {coinBApprove && <div>
                <p>Approve Us to access Your {coinBApprove === 'a' ? 'CoinA' : coinBApprove === 'b' ? 'CoinB' : coinBApprove === 'c' ? 'CoinC' :
                    coinBApprove === 'd' ? 'CoinD' : coinBApprove === 'uni' ? 'Uni' : ''}</p>
                <button onClick={handleApproveCoinB}>
                    <p>Approve</p>
                </button>
            </div>}
        </Modal>
    )
}


interface PickPoolModalInterface {
    isOpen: boolean;
    setOpenPickPoolModal: Function
}

export const PickPoolModal = ({ isOpen, setOpenPickPoolModal }: PickPoolModalInterface) => {
    const { poolName, setPoolName, setShowPickPoolModal } = useContext(MainContext)
    const listTokenSupport = ['a', 'b', 'c', 'd', 'uni']
    interface pairInfo {
        name: string,
        address: string
    }
    const [pairs, setPairs] = useState<pairInfo[]>([])
    const getParis = async () => {
        const factoryContract = await getContract('ufac')
        if (factoryContract) {
            try {
                let pairs: pairInfo[] = []
                for (let i = 0; i < listTokenSupport.length; i++) {
                    for (let j = 0; j < listTokenSupport.length; j++) {
                        if (listTokenSupport[i] === listTokenSupport[j]) continue
                        if (listTokenSupport[i] === 'a') {
                            if (listTokenSupport[j] === 'b') {
                                const pairAddress = await factoryContract.getPair(CoinA.contractAddress, CoinB.contractAddress)
                                pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'ab', address: pairAddress })
                            } else if (listTokenSupport[j] === 'c') {
                                const pairAddress = await factoryContract.getPair(CoinA.contractAddress, CoinC.contractAddress)
                                pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'ac', address: pairAddress })
                            } else if (listTokenSupport[j] === 'd') {
                                const pairAddress = await factoryContract.getPair(CoinA.contractAddress, CoinD.contractAddress)
                                pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'ad', address: pairAddress })
                            } else if (listTokenSupport[j] === 'uni') {
                                const pairAddress = await factoryContract.getPair(CoinA.contractAddress, UNIToken.contractAddress)
                                pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'auni', address: pairAddress })
                            }
                        } else if (listTokenSupport[i] === 'b') {
                            if (listTokenSupport[j] === 'a') {
                                const pairAddress = await factoryContract.getPair(CoinA.contractAddress, CoinB.contractAddress)
                                pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'ab', address: pairAddress })
                            } else if (listTokenSupport[j] === 'c') {
                                const pairAddress = await factoryContract.getPair(CoinB.contractAddress, CoinC.contractAddress)
                                pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'bc', address: pairAddress })
                            } else if (listTokenSupport[j] === 'd') {
                                const pairAddress = await factoryContract.getPair(CoinB.contractAddress, CoinD.contractAddress)
                                pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'bd', address: pairAddress })
                            } else if (listTokenSupport[j] === 'uni') {
                                const pairAddress = await factoryContract.getPair(CoinB.contractAddress, UNIToken.contractAddress)
                                pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'buni', address: pairAddress })
                            }
                        } else if (listTokenSupport[i] === 'c') {
                            if (listTokenSupport[j] === 'a') {
                                const pairAddress = await factoryContract.getPair(CoinA.contractAddress, CoinC.contractAddress)
                                pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'ac', address: pairAddress })
                            } else if (listTokenSupport[j] === 'b') {
                                const pairAddress = await factoryContract.getPair(CoinC.contractAddress, CoinB.contractAddress)
                                pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'bc', address: pairAddress })
                            } else if (listTokenSupport[j] === 'd') {
                                const pairAddress = await factoryContract.getPair(CoinC.contractAddress, CoinD.contractAddress)
                                pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'cd', address: pairAddress })
                            } else if (listTokenSupport[j] === 'uni') {
                                const pairAddress = await factoryContract.getPair(CoinC.contractAddress, UNIToken.contractAddress)
                                pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'cuni', address: pairAddress })
                            } else if (listTokenSupport[i] === 'd') {
                                if (listTokenSupport[j] === 'a') {
                                    const pairAddress = await factoryContract.getPair(CoinA.contractAddress, CoinD.contractAddress)
                                    pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'ad', address: pairAddress })
                                } else if (listTokenSupport[j] === 'b') {
                                    const pairAddress = await factoryContract.getPair(CoinD.contractAddress, CoinB.contractAddress)
                                    pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'bd', address: pairAddress })
                                } else if (listTokenSupport[j] === 'c') {
                                    const pairAddress = await factoryContract.getPair(CoinD.contractAddress, CoinC.contractAddress)
                                    pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'cd', address: pairAddress })
                                } else if (listTokenSupport[j] === 'uni') {
                                    const pairAddress = await factoryContract.getPair(CoinD.contractAddress, UNIToken.contractAddress)
                                    pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'duni', address: pairAddress })
                                }
                            } else if (listTokenSupport[i] === 'uni') {
                                if (listTokenSupport[j] === 'a') {
                                    const pairAddress = await factoryContract.getPair(CoinA.contractAddress, UNIToken.contractAddress)
                                    pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'auni', address: pairAddress })
                                } else if (listTokenSupport[j] === 'b') {
                                    const pairAddress = await factoryContract.getPair(UNIToken.contractAddress, CoinB.contractAddress)
                                    pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'buni', address: pairAddress })
                                } else if (listTokenSupport[j] === 'c') {
                                    const pairAddress = await factoryContract.getPair(UNIToken.contractAddress, CoinC.contractAddress)
                                    pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'cuni', address: pairAddress })
                                } else if (listTokenSupport[j] === 'd') {
                                    const pairAddress = await factoryContract.getPair(UNIToken.contractAddress, CoinD.contractAddress)
                                    pairAddress !== "0x0000000000000000000000000000000000000000" && pairs.push({ name: 'duni', address: pairAddress })
                                }
                            }
                        }
                    }
                }
                pairs = pairs.filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t.address === value.address && t.name === value.name
                    ))
                )
                setPairs(pairs)
            } catch (error) {
                console.log(error)
            }
        }
    }
    const handlePressPool = async (pair: pairInfo) => {
        setPoolName(pair.name)
        setShowPickPoolModal(false)
    }
    const coinButtons = pairs.map((pair) => {
        return (
            <button style={{ marginRight: 20, marginBottom: 20, height: 40, width: 60, borderRadius: 10 }}
                onClick={() => handlePressPool(pair)}>
                <p>{pair.name}</p>
            </button>
        )
    })
    useEffect(() => {
        getParis()
    })

    return (
        <div style={{}}>
            <Modal isOpen={isOpen} onRequestClose={() => setOpenPickPoolModal(false)}
                style={{
                    overlay: {
                        height: window.innerHeight, width: window.innerWidth, position: 'fixed', justifyContent: 'center', alignItems: 'center'
                    },
                    content: {
                        height: window.innerHeight * 0.4, width: window.innerWidth * 0.25, borderRadius: 30,
                        position: 'absolute',
                        top: window.innerHeight * 0.2,
                        left: window.innerWidth * 0.36,
                    }
                }}>
                {coinButtons}
            </Modal>
        </div>
    )

}

export const ApproveLPModal = ({ isOpen, setOpenApproveModal }: ApproveModalInterFace) => {

}    // const pairAddress = getCreate2Address(UniFactory.contractAddress,
//     keccak256(solidityPack(['address', 'address'], [addressA, addressB])),
//     "0x88cdbda28fb67c22f3abb406a6cfeddf13861118f569057f9da8e0dac1ac2f0b")