import { parseUnits } from "ethers/lib/utils";
import React, { useContext, useState } from "react";
import { MainContext } from '../../context/MainContext'
import { ApproveModal, PickPoolModal, PickTokenModal } from "../Modal";

const RemoveLiquidity = () => {
    const { showApproveModal, setShowApproveModal,
        // reserveRemove,
        showPickPoolModal, setShowPickPoolModal, poolName,
    } = useContext(MainContext)
    const [tokenAAmount, setTokenAAmount] = useState<string>('')
    const [tokenBAmount, setTokenBAmount] = useState<string>('')

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {/* <div style={{ display: 'flex', flexDirection: 'row', width: 400, justifyContent: 'space-between' }}>
                <h3>Reserve {removeTokenA}: {reserveRemove.reserveA}</h3>
                <h3>Reserve {removeTokenB}: {reserveRemove.reserveB}</h3>
            </div> */}
            <div>
                <p>Your LP balance: { }</p>
                <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20, paddingLeft: 20, width: 500, height: 80, backgroundColor: '#F7F8FA', borderRadius: 20 }}>
                    <input value={tokenAAmount} type="number" style={{ backgroundColor: '#F7F8FA', border: 'none', height: 40, width: 350 }}
                        onChange={(e) => {

                        }} />
                    <button onClick={() => { setShowPickPoolModal(true) }}
                        style={{ display: 'flex', alignSelf: 'center', justifyContent: 'center', width: 100, height: 50, backgroundColor: '#F7F8FA', borderRadius: 20 }} >
                        <p>{poolName ? poolName : 'Pick Pool'}</p>
                    </button>
                </div>
                <PickPoolModal isOpen={showPickPoolModal} setOpenPickPoolModal={setShowPickPoolModal} />
                {showApproveModal && <ApproveModal isOpen={showApproveModal} setOpenApproveModal={setShowApproveModal} />}
                <div style={{ display: 'flex', justifyContent: 'center', paddingRight: 80, paddingLeft: 80 }} >
                    <button style={{ display: 'flex', borderRadius: 10, height: 50, width: 80, justifyContent: 'center' }}
                        onClick={() => { }}>
                        <p>Recall</p>
                    </button>
                </div>
            </div>
        </div>
    )
}
export default RemoveLiquidity