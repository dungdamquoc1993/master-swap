import React, { useContext, useMemo, useState } from "react";
import { MainContext } from '../../context/MainContext'
import { ApproveModal, PickTokenModal } from "../Modal";

const AddLiquidity = () => {
    const { showApproveModal, setShowApproveModal, addLiquidity, addLiquidityTokenA,
        addLiquidityTokenB, addLiquidityShowModal, setAddLiquidityShowModal, } = useContext(MainContext)
    const [isTokenA, setIsTokenA] = useState(true)
    const [tokenAAmount, setTokenAAmount] = useState<string>('')
    const [tokenBAmount, setTokenBAmount] = useState<string>('')

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div>
                <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20, paddingLeft: 20, width: 500, height: 80, backgroundColor: '#F7F8FA', borderRadius: 20 }}>
                    <input value={tokenAAmount} type="number" style={{ backgroundColor: '#F7F8FA', border: 'none', height: 40, width: 350 }}
                        onChange={(e) => {
                            setTokenAAmount(e.target.value)
                            setTokenBAmount((parseInt(e.target.value) * 2).toString())
                        }} />
                    <button onClick={() => {
                        setIsTokenA(true)
                        setAddLiquidityShowModal(true)
                    }}
                        style={{ display: 'flex', alignSelf: 'center', justifyContent: 'center', width: 100, height: 50, backgroundColor: '#F7F8FA', borderRadius: 20 }} >
                        <p>{addLiquidityTokenA ? addLiquidityTokenA : 'Pick Token'}</p>
                    </button>
                </div>
                <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20, paddingLeft: 20, width: 500, height: 80, backgroundColor: '#F7F8FA', borderRadius: 20 }}>
                    <input value={tokenBAmount} type="number" style={{ backgroundColor: '#F7F8FA', border: 'none', height: 40, width: 350 }}
                        onChange={(e) => {
                            setTokenBAmount(e.target.value)
                            setTokenAAmount((parseInt(e.target.value) * 2).toString())
                        }} />                    <button onClick={() => {
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
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 80, paddingLeft: 80 }} >
                    <button style={{ display: 'flex', borderRadius: 10, height: 50, width: 80, justifyContent: 'center' }}>
                        <p>Revert</p>
                    </button>
                    <button style={{ display: 'flex', borderRadius: 10, height: 50, width: 80, justifyContent: 'center' }}
                        onClick={() => { }}>
                        <p>Add LQ</p>
                    </button>
                </div>
            </div>
        </div>
    )
}
export default AddLiquidity