import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../context/MainContext";

interface FarmItemProps {
    setTokenDepositAmount: Function,
    depositToken: Function,
    setTokenWithdrawAmount: Function,
    withdrawToken: Function,
    tokenInPoolBalance: number,
    setClaimRewardAmount: Function,
    claimReward: Function,
    RdxPending: number,
    tokenName: string,
    tokenBal: number,
    approveToken: Function
}

const FarmItem = ({ setTokenDepositAmount, depositToken, setTokenWithdrawAmount, withdrawToken,
    tokenInPoolBalance, setClaimRewardAmount, claimReward, RdxPending, tokenName, tokenBal, approveToken }: FarmItemProps) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }} >
            <h1 style={{ justifyContent: 'center', color: 'blue' }} >Pool: {tokenName.toUpperCase()}</h1>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 40 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <p style={{ marginRight: 20 }} >Approve {tokenName.toUpperCase()}</p>
                    <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 25, width: 60 }} type="button" onClick={() => approveToken()}>
                        <p>Approve</p>
                    </button>
                </div>
                <p > Deposit {tokenName} | Current Balance: {`${tokenBal} ${tokenName.toLocaleUpperCase()}`} </p>
                <div style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '40%', display: 'flex' }}>
                    <input style={{ marginRight: 10 }} type='number' onChange={(e) => { setTokenDepositAmount(e.target.value) }} />
                    <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 25, width: 60 }} type="button" onClick={() => depositToken(tokenName)} >
                        <p>Deposit</p>
                    </button>
                </div>
                <p > Withdraw {tokenName}:</p>
                <div style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '40%', display: 'flex' }}>
                    <input style={{ marginRight: 10 }} type='number' onChange={(e) => { setTokenWithdrawAmount(e.target.value) }} />
                    <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 25, width: 60 }} type="button" onClick={() => withdrawToken(tokenName)} >
                        <p>Withdraw</p>
                    </button>
                </div>
                <h3>Your balance {tokenName} in Pool: {tokenInPoolBalance} {tokenName.toUpperCase()}</h3>

                <p > claim reward (make sure your balance is sufficient): </p>
                <div style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '40%', display: 'flex' }}>
                    <input style={{ marginRight: 10 }} type='number' onChange={(e) => { setClaimRewardAmount(e.target.value) }} />
                    <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 25, width: 60 }} type="button" onClick={() => claimReward(tokenName)} >
                        <p>Claim</p>
                    </button>
                </div>
                <h3>Your Pending Reddot token reward in pool {tokenName} : {RdxPending} RDX</h3>
            </div>
        </div>
    )
}

const Farm = () => {
    const { uniDepositBalance, rdlpDepositBalance, uniRdxPending, rdlpRdxPending,
        setUniDepositAmount, setRdlpDepositAmount, depositToken,
        setUniWithdrawAmount, setRdlpWithdrawAmount, withdrawToken,
        setClaimeRewardFromUniAmount, setClaimeRewardFromRdplAmount, claimReward,
        uniBal, rdlpBal, approveRDLPForFarm, approveUNI, } = useContext(MainContext)
    return (
        <div>
            <FarmItem setTokenDepositAmount={setUniDepositAmount} depositToken={depositToken}
                setTokenWithdrawAmount={setUniWithdrawAmount} withdrawToken={withdrawToken}
                tokenInPoolBalance={uniDepositBalance} setClaimRewardAmount={setClaimeRewardFromUniAmount}
                claimReward={claimReward} RdxPending={uniRdxPending} tokenName={'uni'}
                tokenBal={uniBal} approveToken={approveUNI} />

            <FarmItem setTokenDepositAmount={setRdlpDepositAmount} depositToken={depositToken}
                setTokenWithdrawAmount={setRdlpWithdrawAmount} withdrawToken={withdrawToken}
                tokenInPoolBalance={rdlpDepositBalance} setClaimRewardAmount={setClaimeRewardFromRdplAmount}
                claimReward={claimReward} RdxPending={rdlpRdxPending} tokenName={'rdlp'}
                tokenBal={rdlpBal} approveToken={approveRDLPForFarm} />
        </div>
    )
}

export default Farm