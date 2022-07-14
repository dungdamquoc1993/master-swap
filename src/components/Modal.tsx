import React, { useContext } from 'react';
import Modal from 'react-modal'
import { MainContext } from '../context/MainContext'
import { UniRouter } from '../utils/constant';

interface PickTokenModal {
    isOpen: boolean;
    setOpenPickTokenModal: Function;
    modalName: string,
    tokenA: boolean
}

export const PickTokenModal = ({ isOpen, setOpenPickTokenModal, modalName, tokenA }: PickTokenModal) => {
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

interface ApproveModal {
    isOpen: boolean;
    setOpenApproveModal: Function;
}

export const ApproveModal = ({ isOpen, setOpenApproveModal }: ApproveModal) => {

    const { approveCoin, coinAApprove, coinBApprove, setCoinAAprove, setCoinBApprove, } = useContext(MainContext)

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
                <p>{coinAApprove === 'a' ? 'CoinA' : coinAApprove === 'b' ? 'CoinB' : coinAApprove === 'c' ? 'CoinC' :
                    coinAApprove === 'd' ? 'CoinD' : coinAApprove === 'uni' ? 'Uni' : ''}</p>
                <button onClick={async () => {
                    const success = await approveCoin(coinAApprove, UniRouter.contractAddress)
                    success && setCoinAAprove('')
                }}>
                    <p>Approve</p>
                </button>
            </div>}
            {coinBApprove && <div>
                <p>{coinBApprove === 'a' ? 'CoinA' : coinBApprove === 'b' ? 'CoinB' : coinBApprove === 'c' ? 'CoinC' :
                    coinBApprove === 'd' ? 'CoinD' : coinBApprove === 'uni' ? 'Uni' : ''}</p>
                <button onClick={async () => {
                    const success = await approveCoin(coinBApprove, UniRouter.contractAddress)
                    success && setCoinBApprove('')
                }}>
                    <p>Approve</p>
                </button>
            </div>}
        </Modal>
    )
}