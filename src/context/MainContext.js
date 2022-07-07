import React, { useEffect, useState } from "react";
import { useWeb3React } from '@web3-react/core';
import { getContract } from "../utils/getContract";
import { MasterChef, WJKToken, RDXToken, PoolPair } from '../utils/constant'
import { parseUnits } from "ethers/lib/utils";

export const MainContext = React.createContext()

export const MainProvider = ({ children }) => {
    const { account } = useWeb3React();
    const [userAccount, setUserAccount] = useState('')
    const [rdxBal, setRdxBal] = useState(0)
    const [uniBal, setUniBal] = useState(0)
    const [wjkBal, setWjkBal] = useState(0)
    const [rdxrwBal, setRdxrwBal] = useState(0)
    const [rdlpBal, setRdlpBal] = useState(0)
    const [reserveRdx, setReserveRdx] = useState(0)
    const [reserveWjk, setReserveWjk] = useState(0)

    const getRDXBal = async () => {
        const contract = await getContract('rdx')
        if (contract != null) {
            try {
                const bal = parseInt((await contract.balanceOf(userAccount))) / 10 ** 12
                setRdxBal(Math.round(bal))
            } catch (error) {
                console.log('get RDX balance cause crash by system')
            }
        } else alert('get RDX contract failed')
    }
    const getWJKBal = async () => {
        const contract = await getContract('wjk')
        if (contract != null) {
            try {
                const bal = parseInt((await contract.balanceOf(userAccount))) / 10 ** 12
                setWjkBal(Math.round(bal))
            } catch (error) {
                console.log('get WJK balance cause crash by system')
            }
        } else alert('get WJK contract failed')
    }
    const getRDLPBal = async () => {
        const contract = await getContract('poo')
        if (contract != null) {
            try {
                const bal = parseInt((await contract.balanceOf(userAccount))) / 10 ** 12
                setRdlpBal(bal)
            } catch (error) {
                console.log('get RDLP Balance cause crash by system')
            }
        } else alert('get PoolPair contract failed')
    }
    const getUNIBal = async () => {
        const contract = await getContract('uni')
        if (contract != null) {
            try {
                const balance = await contract.balanceOf(userAccount)
                setUniBal(parseInt(balance.toString()) / 10 ** 12)
            } catch (error) {
                alert('get user UNI balance cause crash by system')
            }
        } else alert('get UNI contract failed')
    }
    const getRDXRWBal = async () => { 
        const contract = await getContract('rdxrw')
        if (contract != null && userAccount) {
            try {
                const balance = await contract.balanceOf(userAccount)
                setRdxrwBal(Math.round(parseInt(balance.toString()) / 10 ** 12))
            } catch (error) {
                alert('get user RDX balance cause crash by system')
            }
        } else alert('get RDX contract failed')
    }
    const updateTokenBal = async () => {
        await getRDXBal()
        await getWJKBal()
        await getRDLPBal()
        await getUNIBal()
        await getRDXRWBal()
        await getReserves()
        await getTokenDepositBalance()
        await getRDXPending()
    }

    const mintRDX = async () => {
        const contract = await getContract('rdx')
        if (contract != null) {
            try {
                const mint = await contract.mint()
                alert('mint RDX successs wait for 30 second to see balance update')
                await mint.wait()
                await getRDXBal()
            } catch (error) {
                alert('mint RDX cause crash by system')
            }
        } else alert('get RDX contract failed')
    }
    const mintWJK = async () => {
        const contract = await getContract('wjk')
        if (contract != null) {
            try {
                const mint = await contract.mint()
                alert('mint WJK success wait for 30 second to see balance update')
                await mint.wait()
                await getWJKBal()
            } catch (error) {
                alert('mint WJK cause crash by system')
            }
        } else alert('get WJK contract failed')
    }
    const mintUni = async () => {
        const uniContract = await getContract('uni')
        if (uniContract != null) {
            try {
                const mint = await uniContract.mint(userAccount, parseUnits('1000', 12))
                alert('mint success wait for 30 second to get uni token')
                await mint.wait()
                await getUNIBal()
            } catch (error) {
                alert('mint Uni casue crash by system')
            }
        } else {
            alert('get uni contract failed')
        }
    }

    const getRDXAllowance = async () => {
        const contract = await getContract('rdx')
        if (contract != null) {
            try {
                const bal = parseInt(await contract.allowance(userAccount, PoolPair.contractAddress)) / 10 ** 12
                return bal
            } catch (error) {
                alert('get RDX allowance cause crash by systems')
            }
        } alert('get RDX contract faied')
    }
    const getWJKAllowance = async () => {
        const contract = await getContract('wjk')
        if (contract != null) {
            try {
                const bal = parseInt(await contract.allowance(userAccount, PoolPair.contractAddress)) / 10 ** 12
                return bal
            } catch (error) {
                alert('get RDX allowance cause crash by systems')
            }
        } alert('get RDX contract faied')
    }
    const getReserves = async () => {
        const contract = await getContract('poo')
        if (contract != null) {
            try {
                const rdxReserve = parseInt((await contract.getReserves())[0]) / 10 ** 12
                const wjkReserve = parseInt((await contract.getReserves())[1]) / 10 ** 12
                setReserveRdx(rdxReserve)
                setReserveWjk(wjkReserve)
            } catch (error) {
                console.log('get reserves cause cash by system')
            }
        } else alert('get Poolpair contract failed')
    }

    const approveRDX = async () => {
        const rdxContract = await getContract('rdx')
        if (rdxContract != null) {
            try {
                const txApproveRdx = await rdxContract.approve(PoolPair.contractAddress, parseUnits(`1000000000000`, 12))
                alert('wait 30 seconds')
                await txApproveRdx.wait()
                alert('approve success')
            } catch (error) {
                alert('approve RDX cause cash by system')
            }
        } else alert('get rdxContract contract failed')
    }
    const approveWJK = async () => {
        const wjkContract = await getContract('wjk')
        if (wjkContract != null) {
            try {
                const txApproveWjk = await wjkContract.approve(PoolPair.contractAddress, parseUnits(`1000000000000`, 12))
                alert('wait 30 seconds')
                await txApproveWjk.wait()
                alert('approve success')
            } catch (error) {
                alert('approve RDX cause cash by system')
            }
        } else alert('get rdxContract contract failed')
    }
    const approveRDLP = async () => {
        const pooContract = await getContract('poo')
        if (pooContract != null) {
            try {
                const txApprovePoo = await pooContract.approve(PoolPair.contractAddress, parseUnits(`1000000000000`, 12))
                alert('wait 30 seconds')
                await txApprovePoo.wait()
                alert('approve success')
            } catch (error) {
                alert('approve RDLP cause cash by system')
            }
        } else alert('get pooContract contract failed')
    }
    const approveRDLPForFarm = async () => {
        const pooContract = await getContract('poo')
        if (pooContract != null) {
            try {
                const txApprovePoo = await pooContract.approve(MasterChef.contractAddress, parseUnits(`1000000000000`, 12))
                alert('wait 30 seconds')
                await txApprovePoo.wait()
                alert('approve success')
            } catch (error) {
                alert('approve RDLP cause cash by system')
            }
        } else alert('get pooContract contract failed')
    }
    const approveUNI = async () => {
        const uniContract = await getContract('uni')
        if (uniContract != null) {
            try {
                const txApprovePoo = await uniContract.approve(MasterChef.contractAddress, parseUnits(`1000000000000`, 12))
                alert('wait 30 seconds')
                await txApprovePoo.wait()
                alert('approve success')
            } catch (error) {
                alert('approve UNI cause cash by system')
            }
        } else alert('get pooContract contract failed')
    }

    const [formDataAddLQ, setFormDataAddLQ] = useState({ rdxExpect: 0, wjkExpect: 0, rdxMin: 0, wjkMin: 0 });
    const handleChangeAddLQ = (e, name) => {
        setFormDataAddLQ((prevState) => ({ ...prevState, [name]: e.target.value }));
    };
    const addLiquidity = async (rdxExpect, wjkExpect, rdxMin, wjkMin) => {
        const pooContract = await getContract('poo')
        const rdxContract = await getContract('rdx')
        const wjkContract = await getContract('wjk')
        if (pooContract != null && rdxContract != null && wjkContract != null) {
            try {
                let rdxAllowance = await getRDXAllowance()
                let wkjAllowance = await getWJKAllowance()
                rdxAllowance = typeof (rdxAllowance) === 'number' ? rdxAllowance : 0
                wkjAllowance = typeof (wkjAllowance) === 'number' ? wkjAllowance : 0
                if (rdxAllowance - rdxExpect >= 0 && wkjAllowance - wjkExpect >= 0) {
                    const tx = await pooContract.addLiquidity(
                        parseUnits(`${rdxExpect}`, 12), parseUnits(`${wjkExpect}`, 12),
                        parseUnits(`${rdxMin}`, 12), parseUnits(`${wjkMin}`, 12),
                        userAccount)
                    await tx.wait()
                    alert('add liquidity success')
                    await updateTokenBal()
                } else {
                    // debugger
                    let txApproveRdx, txApproveWjk, txAddLiquidity
                    if (rdxAllowance - rdxExpect < 0) {
                        txApproveRdx = await rdxContract.approve(PoolPair.contractAddress, parseUnits(`${rdxExpect}`, 12))
                    }
                    if (wkjAllowance - wjkExpect < 0) {
                        txApproveWjk = await wjkContract.approve(PoolPair.contractAddress, parseUnits(`${wjkExpect}`, 12))
                    }
                    txApproveRdx && await txApproveRdx.wait()
                    txApproveWjk && await txApproveWjk.wait()
                    rdxAllowance = await getRDXAllowance()
                    wkjAllowance = await getWJKAllowance()
                    rdxAllowance = typeof (rdxAllowance) === 'number' ? rdxAllowance : 0
                    wkjAllowance = typeof (wkjAllowance) === 'number' ? wkjAllowance : 0
                    if (rdxAllowance - rdxExpect >= 0 && wkjAllowance - wjkExpect >= 0) {
                        txAddLiquidity = await pooContract.addLiquidity(
                            parseUnits(`${rdxExpect}`, 12), parseUnits(`${wjkExpect}`, 12),
                            parseUnits(`${rdxMin}`, 12), parseUnits(`${wjkMin}`, 12),
                            userAccount)
                        alert('add liquidity success wait 30 seconds to see change')
                        await txAddLiquidity.wait()
                        await updateTokenBal()
                    }
                }
            } catch (error) {
                console.log(error)
                alert('add liquidity cause crash by system')
            }
        } else alert('get PoolPair contract failed')
    }
    const [formDataRemoveLQ, setFormDataRemoveLQ] = useState({ lpToBurn: 0, rdxMinBack: 0, wjkMinBack: 0 });
    const handleChangeRemoveLQ = (e, name) => {
        setFormDataRemoveLQ((prevState) => ({ ...prevState, [name]: e.target.value }));
    };
    const removeLiquidity = async (lpToBurn, rdxMinBack, wjkMinBack) => {
        const contract = await getContract('poo')
        if (contract != null) {
            try {
                let txApprovePoolPair, txRemoveLiquidity, rdlpAllowance
                rdlpAllowance = (await contract.allowance(userAccount, PoolPair.contractAddress)) / 10 ** 12
                if (rdlpAllowance - lpToBurn >= 0) {
                    txRemoveLiquidity = await contract.removeLiquidity(parseUnits(`${lpToBurn}`, 12),
                        parseUnits(`${rdxMinBack}`, 12), parseUnits(`${wjkMinBack}`, 12),
                        userAccount)
                    alert('remove liquidity success')
                    await txRemoveLiquidity.wait()
                    await updateTokenBal()
                } else {
                    if (rdlpAllowance - lpToBurn < 0) {
                        txApprovePoolPair = await contract.approve(PoolPair.contractAddress, parseUnits(`${lpToBurn}`, 12))
                        await txApprovePoolPair.wait()
                    }
                    rdlpAllowance = (await contract.allowance(userAccount, PoolPair.contractAddress)) / 10 ** 12
                    if (rdlpAllowance - lpToBurn >= 0) {
                        txRemoveLiquidity = await contract.removeLiquidity(parseUnits(`${lpToBurn}`, 12),
                            parseUnits(`${rdxMinBack}`, 12), parseUnits(`${wjkMinBack}`, 12),
                            userAccount)
                        alert('remove liquidity success wait 30 seconds to see change')
                        await txRemoveLiquidity.wait()
                        await updateTokenBal()
                    }
                }
            } catch (error) {
                alert('remove liquidity cause crash by system')
            }
        } else alert('get PoolPair contract failed')
    }

    const swap = async (leftEqualRDX, leftSwapValue) => {
        const rdxContract = await getContract('rdx')
        const wjkContract = await getContract('wjk')
        const pooContract = await getContract('poo')
        if (pooContract != null && rdxContract != null && wjkContract != null) {
            try {
                if (leftEqualRDX) {
                    let rdxAllowance = await getRDXAllowance()
                    if (leftSwapValue <= 0) return alert('please submit an valid amount to swap')
                    if (rdxAllowance && rdxAllowance - leftSwapValue >= 0) {
                        const swapTX = await pooContract.swap(RDXToken.contractAddress,
                            parseUnits(`${leftSwapValue}`, 12),
                            parseUnits('0', 12))
                        await swapTX.wait()
                        alert('swap success')
                        await updateTokenBal()
                    } else {
                        let tx = await rdxContract.approve(PoolPair.contractAddress, parseUnits(`${leftSwapValue}`, 12))
                        await tx.wait()
                        const swapTX = await pooContract.swap(RDXToken.contractAddress,
                            parseUnits(`${leftSwapValue}`, 12),
                            parseUnits('0', 12))
                        await swapTX.wait()
                        alert('swap success')
                        await updateTokenBal()
                    }
                } else {
                    let wjkAllowance = await getWJKAllowance()
                    if (leftSwapValue <= 0) return alert('please submit an valid amount to swap')
                    if (wjkAllowance && wjkAllowance - leftSwapValue >= 0) {
                        const swapTX = await pooContract.swap(WJKToken.contractAddress,
                            parseUnits(`${leftSwapValue}`, 12),
                            parseUnits('0', 12))
                        alert('swap success')
                        await swapTX.wait()
                        await updateTokenBal()
                    } else {
                        let tx = await wjkContract.approve(PoolPair.contractAddress, parseUnits(`${leftSwapValue}`, 12))
                        await tx.wait()
                        const swapTX = await pooContract.swap(WJKToken.contractAddress,
                            parseUnits(`${leftSwapValue}`, 12),
                            parseUnits('0', 12))
                        await swapTX.wait()
                        alert('swap success')
                        await updateTokenBal()
                    }
                }
            } catch (error) {
                alert('swap cause crash by system')
            }
        } else alert('get poolpair contract failed')

    }

    const poolNames = ['uni', 'rdlp']

    const [uniDepositBalance, setUniBalance] = useState(0)
    const [rdlpDepositBalance, setRdlpBalance] = useState(0)
    const getTokenDepositBalance = async () => {
        const contract = await getContract('msc')
        if (contract != null) {
            poolNames.forEach(async (name) => {
                try {
                    const balance = await contract.getUserAmountDeposit(name)
                    if (name === 'uni') {
                        setUniBalance(parseInt(balance.toString()) / 10 ** 12)
                    } else if (name === 'rdlp') {
                        setRdlpBalance(parseInt(balance.toString()) / 10 ** 12)
                    }
                } catch (error) {
                    alert('get token deposit balance cause crash from system')
                }
            })
        } else alert('get MSC contract failed in getUniDepositBal')
    }
    const [uniRdxPending, setUniRdxPending] = useState(0)
    const [rdlpRdxPending, setRdlpRDdxPending] = useState(0)
    const getRDXPending = async () => {
        const contract = await getContract('msc')
        if (contract != null) {
            try {
                poolNames.forEach(async (name) => {
                    if (name === 'uni') {
                        const RDXPending = await contract.pendingRedDot(name, userAccount)
                        setUniRdxPending(Math.round(parseInt(RDXPending.toString()) / 10 ** 12))
                    } else if (name === 'rdlp') {
                        const RDXPending = await contract.pendingRedDot(name, userAccount)
                        setRdlpRDdxPending(Math.round(parseInt(RDXPending.toString()) / 10 ** 12))
                    }
                })
            } catch (error) {
                alert('get pending Reddot from unicause crash from system')
            }
        } else alert('get MSC contract failed in getRDXPending')
    }
    const [uniDepositAmount, setUniDepositAmount] = useState(0)
    const [rdlpDepositAmount, setRdlpDepositAmount] = useState(0)
    const depositToken = async (tokenName) => {
        if (!userAccount) {
            alert('please connect your meta mask wallet before do this stuff')
            return
        }
        const mscContract = await getContract('msc')
        const uniContract = await getContract(tokenName === 'rdlp' ? 'poo' : tokenName)
        if (mscContract != null && uniContract != null) {
            let depositAmount = tokenName === 'uni' ? uniDepositAmount : rdlpDepositAmount
            try {
                const availableUniToDeposit = await uniContract.allowance(userAccount, MasterChef.contractAddress)
                if (parseInt((availableUniToDeposit / 10 ** 12).toString()) >= depositAmount) {
                    const tx = await mscContract.deposit(tokenName, parseUnits(depositAmount.toString(), 12))
                    tx?.wait();
                    alert('deposit success')
                    updateTokenBal()
                } else {
                    const approveSuccess = await uniContract.approve(MasterChef.contractAddress, parseUnits(depositAmount.toString(), 12))
                    await approveSuccess.wait()
                    if (approveSuccess) {
                        const tx = await mscContract.deposit(tokenName, parseUnits(depositAmount.toString(), 12))
                        alert('deposit success')
                        tx?.wait()
                        updateTokenBal()
                    }
                }
            } catch (error) {
                alert('deposit uni cause crash by system')
            }
        } else alert('get MSC or UNI contract failed in deposit')
    }
    const [uniWithdrawAmount, setUniWithdrawAmount] = useState(0)
    const [rdlpWithdrawAmount, setRdlpWithdrawAmount] = useState(0)
    const withdrawToken = async (tokenName) => {
        const mscContract = await getContract('msc')
        if (mscContract != null) {
            const availableAmount = await mscContract.getUserAmountDeposit(tokenName)
            let tokenWithdrawAmount = tokenName === 'uni' ? uniWithdrawAmount : rdlpWithdrawAmount
            if (tokenWithdrawAmount - (parseInt(availableAmount.toString()) / 10 ** 12) <= 0) {
                try {
                    const txWithdraw = await mscContract.withdraw(tokenName, parseUnits(tokenWithdrawAmount.toString(), 12))
                    await txWithdraw.wait()
                    alert(`withdraw success wait 45-60 seconds to receive ${tokenName}`)
                    updateTokenBal()
                } catch (error) {
                    alert('withdraw token cause crash by system')
                }
            } else {
                alert('withdraw insufficient amount')
            }
        } else alert('get MSC contract failed in withdraw')
    }
    const [claimeRewardFromUniAmount, setClaimeRewardFromUniAmount] = useState(0)
    const [claimeRewardFromRdplAmount, setClaimeRewardFromRdplAmount] = useState(0)
    const claimReward = async (tokenName) => {
        const mscContract = await getContract('msc')
        if (mscContract != null) {
            try {

                let claimeRewardAmount = tokenName === 'uni' ? claimeRewardFromUniAmount : claimeRewardFromRdplAmount
                const pendingRDX = await mscContract.pendingRedDot(tokenName, userAccount)
                let claimAmountInSol = parseUnits(claimeRewardAmount.toString(), 12)
                if (pendingRDX - claimAmountInSol >= 0) {
                    const txClaimReward = await mscContract.claimReward(tokenName, parseUnits(claimeRewardAmount.toString(), 12))
                    await txClaimReward.wait()
                    alert('claim reward success wait 45-60 secons to receive reward')
                    updateTokenBal()
                } else {
                    alert('insufficinent balalnce')
                }
            } catch (error) {
                alert('claim reward cause crash by system')
            }
        } else alert('get MSC contract failed in claim reward')
    }

    useEffect(() => {
        if (account) {
            setUserAccount(account)
            if (window.localStorage.getItem('userAccount') !== account) {
                window.localStorage.setItem('userAccount', account)
            }
        }
    }, [account])

    useEffect(() => {
        if (userAccount) {
            updateTokenBal()
        }
    }, [userAccount])


    return (
        <MainContext.Provider
            value={{
                userAccount,
                rdxBal, uniBal, wjkBal, rdxrwBal, rdlpBal,
                mintRDX, mintWJK, mintUni,
                reserveRdx, reserveWjk,
                formDataAddLQ, handleChangeAddLQ, formDataRemoveLQ, handleChangeRemoveLQ,
                addLiquidity, removeLiquidity, swap,
                approveRDX, approveWJK, approveRDLP, approveRDLPForFarm,approveUNI,

                uniDepositBalance, rdlpDepositBalance, uniRdxPending, rdlpRdxPending,
                setUniDepositAmount, setRdlpDepositAmount, depositToken,
                setUniWithdrawAmount, setRdlpWithdrawAmount, withdrawToken,
                setClaimeRewardFromUniAmount, setClaimeRewardFromRdplAmount, claimReward
            }}
        >
            {children}
        </MainContext.Provider>
    )
}