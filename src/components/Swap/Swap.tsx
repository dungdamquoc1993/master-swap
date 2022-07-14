import React, { useContext, useMemo, useState } from "react";
import { MainContext } from '../../context/MainContext'
import { PickTokenModal } from "../Modal";


const Swap = () => {
    const { swapTokenA, swapTokenB, swapShowModal, setSwapModal } = useContext(MainContext)
    const [isTokenA, setIsTokenA] = useState(true)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div>
                <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingRight: 20, paddingLeft: 20, width: 500, height: 80, backgroundColor: '#F7F8FA', borderRadius: 20 }}>
                    <p style={{ alignSelf: 'center' }} >Amount In</p>
                    <button onClick={() => {
                        setIsTokenA(true)
                        setSwapModal(true)
                    }}
                        style={{ display: 'flex', alignSelf: 'center', justifyContent: 'center', width: 100, height: 50, backgroundColor: '#F7F8FA', borderRadius: 20 }} >
                        <p>{swapTokenA ? swapTokenA : 'Pick Token'}</p>
                    </button>
                </div>
                <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingRight: 20, paddingLeft: 20, width: 500, height: 80, backgroundColor: '#F7F8FA', borderRadius: 20 }}>
                    <p style={{ alignSelf: 'center' }} >Amount Out</p>
                    <button onClick={() => {
                        setIsTokenA(false)
                        setSwapModal(true)
                    }}
                        style={{ display: 'flex', alignSelf: 'center', justifyContent: 'center', width: 100, height: 50, backgroundColor: '#F7F8FA', borderRadius: 20 }} >
                        <p>{swapTokenB ? swapTokenB : 'Pick Token'}</p>
                    </button>
                </div>
                <PickTokenModal isOpen={swapShowModal} setOpenPickTokenModal={setSwapModal} modalName={'swap'} tokenA={isTokenA} />
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 80, paddingLeft: 80 }} >
                    <button style={{ display: 'flex', borderRadius: 10, height: 50, width: 80, justifyContent: 'center' }}>
                        <p>Revert</p>
                    </button>
                    <button style={{ display: 'flex', borderRadius: 10, height: 50, width: 80, justifyContent: 'center' }}>
                        <p>Swap</p>
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Swap