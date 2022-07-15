import { parseUnits } from "ethers/lib/utils";
import React, { useContext, useState } from "react";
import { MainContext } from '../../context/MainContext'
import { ApproveModal, PickTokenModal } from "../Modal";

const AddLiquidity = () => {
    const { showApproveModal, setShowApproveModal, addLiquidity, addLiquidityTokenA,
        addLiquidityTokenB, addLiquidityShowModal, setAddLiquidityShowModal, reserveAdd, coinBals
    } = useContext(MainContext)
    const [isTokenA, setIsTokenA] = useState(true)
    const [tokenAAmount, setTokenAAmount] = useState<string>('')
    const [tokenBAmount, setTokenBAmount] = useState<string>('')
    const getPairName = (name0: string, name1: string) => {
        let pairName
        if (name0 === 'a') {
            if (name1 === 'b') {
                pairName = 'ab'
            } else if (name1 === 'c') {
                pairName = 'ac'
            } else if (name1 === 'd') {
                pairName = 'ad'
            }
        } else if (name0 === 'b') {
            if (name1 === 'a') {
                pairName = 'ab'
            } else if (name1 === 'c') {
                pairName = 'bc'
            } else if (name1 === 'd') {
                pairName = 'bd'
            }
        } else if (name0 === 'c') {
            if (name1 === 'a') {
                pairName = 'ac'
            } else if (name1 === 'b') {
                pairName = 'bc'
            } else if (name1 === 'd') {
                pairName = 'cd'
            }
        } else if (name0 === 'd') {
            if (name1 === 'a') {
                pairName = 'ad'
            } else if (name1 === 'b') {
                pairName = 'bd'
            } else if (name1 === 'c') {
                pairName = 'cd'
            }
        }
        return pairName
    }
    const handleAddLiquidity = async () => {
        if (addLiquidityTokenA === addLiquidityTokenB || !addLiquidityTokenA || !addLiquidityTokenB || !tokenAAmount || !tokenBAmount) {
            return alert('require a pair token, name and amount')
        }
        const coinAName = addLiquidityTokenA === 'CoinA' ? 'a' : addLiquidityTokenA === 'CoinB' ? 'b' :
            addLiquidityTokenA === 'CoinC' ? 'c' : addLiquidityTokenA === 'CoinD' ? 'd' : addLiquidityTokenA === 'UNI' ? 'uni' : ''
        const coinBName = addLiquidityTokenB === 'CoinA' ? 'a' : addLiquidityTokenB === 'CoinB' ? 'b' :
            addLiquidityTokenB === 'CoinC' ? 'c' : addLiquidityTokenB === 'CoinD' ? 'd' : addLiquidityTokenB === 'UNI' ? 'uni' : ''
        const amountADesired = parseUnits(tokenAAmount, 12)
        const amountBDesired = parseUnits(tokenBAmount, 12)
        const pairName = getPairName(coinAName, coinBName)
        addLiquidity(pairName, coinAName, coinBName, amountADesired, amountBDesired)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'row', width: 400, justifyContent: 'space-between' }}>
                <h3>Reserve {addLiquidityTokenA}: {reserveAdd.reserveA}</h3>
                <h3>Reserve {addLiquidityTokenB}: {reserveAdd.reserveB}</h3>
            </div>
            <div>
                <p>Your {addLiquidityTokenA} balance: {addLiquidityTokenA === 'CoinA' ? coinBals.coinABal : addLiquidityTokenA === 'CoinB' ? coinBals.coinBBal :
                    addLiquidityTokenA === 'CoinC' ? coinBals.coinCBal : addLiquidityTokenA === 'CoinD' ? coinBals.coinDBal : addLiquidityTokenA === 'UNI' ? coinBals.uniBal : ''}</p>
                <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20, paddingLeft: 20, width: 500, height: 80, backgroundColor: '#F7F8FA', borderRadius: 20 }}>
                    <input value={tokenAAmount} type="number" style={{ backgroundColor: '#F7F8FA', border: 'none', height: 40, width: 350 }}
                        onChange={(e) => {
                            if (reserveAdd.reserveA && reserveAdd.reserveB) {
                                setTokenAAmount(e.target.value)
                                const bAmount = Math.floor(((parseFloat(e.target.value) * reserveAdd.reserveB) / reserveAdd.reserveA) * 1000) / 1000
                                setTokenBAmount(bAmount.toString())
                            } else {
                                setTokenAAmount(e.target.value)
                            }
                        }} />
                    <button onClick={() => {
                        setIsTokenA(true)
                        setAddLiquidityShowModal(true)
                    }}
                        style={{ display: 'flex', alignSelf: 'center', justifyContent: 'center', width: 100, height: 50, backgroundColor: '#F7F8FA', borderRadius: 20 }} >
                        <p>{addLiquidityTokenA ? addLiquidityTokenA : 'Pick Token'}</p>
                    </button>
                </div>
                <p>Your {addLiquidityTokenB} balance: {addLiquidityTokenB === 'CoinA' ? coinBals.coinABal : addLiquidityTokenB === 'CoinB' ? coinBals.coinBBal :
                    addLiquidityTokenB === 'CoinC' ? coinBals.coinCBal : addLiquidityTokenB === 'CoinD' ? coinBals.coinDBal : addLiquidityTokenB === 'UNI' ? coinBals.uniBal : ''}</p>
                <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20, paddingLeft: 20, width: 500, height: 80, backgroundColor: '#F7F8FA', borderRadius: 20 }}>
                    <input value={tokenBAmount} type="number" style={{ backgroundColor: '#F7F8FA', border: 'none', height: 40, width: 350 }}
                        onChange={(e) => {
                            if (reserveAdd.reserveA && reserveAdd.reserveB) {
                                setTokenBAmount(e.target.value)
                                const aAmount = Math.floor(((parseFloat(e.target.value) * reserveAdd.reserveA) / reserveAdd.reserveB) * 1000) / 1000
                                setTokenAAmount(aAmount.toString())
                            } else {
                                setTokenBAmount(e.target.value)
                            }
                        }} />
                    <button onClick={() => {
                        setIsTokenA(false)
                        setAddLiquidityShowModal(true)
                    }}
                        style={{ display: 'flex', alignSelf: 'center', justifyContent: 'center', width: 100, height: 50, backgroundColor: '#F7F8FA', borderRadius: 20 }} >
                        <p>{addLiquidityTokenB ? addLiquidityTokenB : 'Pick Token'}</p>
                    </button>
                </div>
                {addLiquidityShowModal && <PickTokenModal isOpen={addLiquidityShowModal} setOpenPickTokenModal={setAddLiquidityShowModal}
                    modalName={'add_liquidity'} tokenA={isTokenA} />}
                {showApproveModal && <ApproveModal isOpen={showApproveModal} setOpenApproveModal={setShowApproveModal} />}
                <div style={{ display: 'flex', justifyContent: 'center', paddingRight: 80, paddingLeft: 80 }} >
                    <button style={{ display: 'flex', borderRadius: 10, height: 50, width: 80, justifyContent: 'center' }}
                        onClick={handleAddLiquidity}>
                        <p>Add LQ</p>
                    </button>
                </div>
            </div>
        </div>
    )
}
export default AddLiquidity