import React, { useEffect, useState } from "react";
import { useWeb3React } from '@web3-react/core';
import { getContract, getPairContract } from "../utils/getContract";
import { MasterChef, WJKToken, RDXToken, PoolPair, UniRouter, CoinB, CoinA, CoinC, CoinD, UNIToken } from '../utils/constant'
import { parseUnits } from "ethers/lib/utils";

export const MainContext = React.createContext()

export const MainProvider = ({ children }) => {
    const { account } = useWeb3React();
    const [userAccount, setUserAccount] = useState('')
    const [coinBals, setCoinBals] = useState({
        rdxrwBal: 0, uniBal: 0, coinABal: 0, coinBBal: 0,
        coinCBal: 0, coinDBal: 0, lpabBal: 0, lpbcBal: 0, lpcdBal: 0,
    });

    const mintCoin = async (coinName) => {
        const coinContract = await getContract(coinName)
        if (coinContract != null) {
            try {
                const txMint = await coinContract.mint(userAccount, parseUnits('1000', 12))
                alert('mint success wait for 30 second to get token')
                await txMint.wait()
                await getCoinBal(coinName)
            } catch (error) {
                alert('mint coin cause crash by system')
            }
        } else alert('get coin contract failed')
    }
    const getCoinBal = async (coinName) => {
        let coinContract
        if (['ab', 'bc', 'cd'].includes(coinName)) {
            coinContract = await getPairContract(coinName)
        } else {
            coinContract = await getContract(coinName)
        }
        if (coinContract != null && userAccount) {
            try {
                const balance = await coinContract.balanceOf(userAccount)
                const balUpddate = coinName === 'rdxrw' ? 'rdxrwBal' : coinName === 'a' ? 'coinABal' : coinName === 'b' ? 'coinBBal' :
                    coinName === 'c' ? 'coinCBal' : coinName === 'd' ? 'coinDBal' : coinName === 'uni' ? 'uniBal' :
                        coinName === 'ab' ? 'lpabBal' : coinName === 'bc' ? 'lpbcBal' : coinName === ' cd' ? 'lpcdBal' : ''
                setCoinBals((prevState) => ({ ...prevState, [balUpddate]: Math.round(parseInt(balance.toString()) / 10 ** 12) }));
            } catch (error) {
                alert('get user Coin balance cause crash by system')
            }
        } else alert('get RDX coinContract failed')
    }
    const updateTokenBal = async () => {
        await getTokenDepositBalance()
        await getRDXPending()
        await getCoinBal('rdxrw')
        await getCoinBal('uni')
        await getCoinBal('a')
        await getCoinBal('b')
        await getCoinBal('c')
        await getCoinBal('d')
    }

    const getCoinAllowance = async (coinName, spender) => {
        const coinContract = await getContract(coinName)
        if (coinContract != null) {
            try {
                return parseInt(await coinContract.allowance(userAccount, spender)) / 10 ** 12
            } catch (error) {
                alert('approve coin cause crash by system')
            }
        } else alert('get coin contract failed')
    }
    const approveCoin = async (coinName, spender) => {
        const coinContract = await getContract(coinName)
        if (coinContract != null) {
            try {
                const txApprove = await coinContract.approve(spender, parseUnits('1000000000', 12))
                alert('approve success wait for 30 second to get token')
                await txApprove.wait()
                return true
            } catch (error) {
                alert('approve coin cause crash by system')
                return false
            }
        } else {
            alert('get coin contract failed')
            return false
        }
    }
    const reserveSwap = useState({ tokenA: 0, tokenB: 0 })
    const reserveAdd = useState({ tokenA: 0, tokenB: 0 })
    const reserveRemove = useState({ tokenA: 0, tokenB: 0 })

    const getReserveInPair = async (page, pairName) => {
        const pairContract = await getPairContract(pairName)
        if (pairContract != null) {
            try {
                const reserve0 = parseInt((await pairContract.getReserves())[0]) / 10 ** 12
                const reserve1 = parseInt((await pairContract.getReerves())[1]) / 10 ** 12
                // const [token1, token2] = tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA];
                if (page === 'swap') {

                } else if (page === 'add') {

                } else if (page === 'remove') {

                }
            } catch (error) {

            }
        } else {
            alert('get pair contract cause crash pair might be not initialize yet')
        }
    }

    const [addLiquidityTokenA, setAddLiquidityTokenA] = useState('')
    const [addLiquidityTokenB, setAddLiquidityTokenB] = useState('')
    const [addLiquidityShowModal, setAddLiquidityShowModal] = useState('')
    const [showApproveModal, setShowApproveModal] = useState(false)
    const [coinAApprove, setCoinAAprove] = useState('')
    const [coinBApprove, setCoinBApprove] = useState('')
    const addLiquidity = async (coinAName, coinBName, amountADesired, amountBDesired) => {
        const deadline = new Date().getTime() + 60 * 60 * 24 * 1000
        const routerContract = await getContract('urou')
        const facContract = await getContract('ufac')
        const coinAContract = await getContract(coinAName)
        const coinBContract = await getContract(coinBName)
        const tokenAAddress = coinAName === 'a' ? CoinA.contractAddress : coinAName === 'b' ? CoinB.contractAddress :
            coinAName === 'c' ? CoinC.contractAddress : coinAName === 'd' ? CoinD.contractAddress : coinAName === 'uni' ?
                UNIToken.contractAddress : null
        const tokenBAddress = coinBName === 'a' ? CoinA.contractAddress : coinBName === 'b' ? CoinB.contractAddress :
            coinBName === 'c' ? CoinC.contractAddress : coinBName === 'd' ? CoinD.contractAddress : coinBName === 'uni' ?
                UNIToken.contractAddress : null

        if (routerContract != null && facContract != null &&
            coinAContract != null && coinBContract != null && tokenAAddress != null && tokenBAddress != null) {
            try {
                let coinAAllowance = await getCoinAllowance(coinAName, UniRouter.contractAddress)
                let coinBAllowance = await getCoinAllowance(coinBName, UniRouter.contractAddress)
                coinAAllowance = typeof (coinAAllowance) === 'number' ? coinAAllowance : 0
                coinBAllowance = typeof (coinBAllowance) === 'number' ? coinBAllowance : 0
                if (coinAAllowance - amountADesired >= 0 && coinBAllowance - amountBDesired >= 0) {
                    const tx = await routerContract.addLiquidity(
                        tokenAAddress, tokenBAddress,
                        parseUnits(`${amountADesired}`, 12), parseUnits(`${amountBDesired}`, 12),
                        0, 0, userAccount, deadline)
                    await tx.wait()
                    alert('add liquidity success')
                    await updateTokenBal()
                } else {
                    setShowApproveModal(true)
                    if (coinAAllowance - amountADesired < 0) {
                        setCoinAAprove(coinAName)
                    }
                    if (coinBAllowance - amountBDesired < 0) {
                        setCoinBApprove(coinBName)
                    }
                }
            } catch (error) {
                console.log(error)
                alert('add liquidity cause crash by system')
            }
        } else alert('get PoolPair contract failed')
    }

    const [swapTokenA, setSwapTokenA] = useState('')
    const [swapTokenB, setSwapTokenB] = useState('')
    const [swapShowModal, setSwapModal] = useState('')


    // const removeLiquidity = async (lpToBurn, rdxMinBack, wjkMinBack) => {
    //     const contract = await getContract('poo')
    //     if (contract != null) {
    //         try {
    //             let txApprovePoolPair, txRemoveLiquidity, rdlpAllowance
    //             rdlpAllowance = (await contract.allowance(userAccount, PoolPair.contractAddress)) / 10 ** 12
    //             if (rdlpAllowance - lpToBurn >= 0) {
    //                 txRemoveLiquidity = await contract.removeLiquidity(parseUnits(`${lpToBurn}`, 12),
    //                     parseUnits(`${rdxMinBack}`, 12), parseUnits(`${wjkMinBack}`, 12),
    //                     userAccount)
    //                 alert('remove liquidity success')
    //                 await txRemoveLiquidity.wait()
    //                 await updateTokenBal()
    //             } else {
    //                 if (rdlpAllowance - lpToBurn < 0) {
    //                     txApprovePoolPair = await contract.approve(PoolPair.contractAddress, parseUnits(`${lpToBurn}`, 12))
    //                     await txApprovePoolPair.wait()
    //                 }
    //                 rdlpAllowance = (await contract.allowance(userAccount, PoolPair.contractAddress)) / 10 ** 12
    //                 if (rdlpAllowance - lpToBurn >= 0) {
    //                     txRemoveLiquidity = await contract.removeLiquidity(parseUnits(`${lpToBurn}`, 12),
    //                         parseUnits(`${rdxMinBack}`, 12), parseUnits(`${wjkMinBack}`, 12),
    //                         userAccount)
    //                     alert('remove liquidity success wait 30 seconds to see change')
    //                     await txRemoveLiquidity.wait()
    //                     await updateTokenBal()
    //                 }
    //             }
    //         } catch (error) {
    //             alert('remove liquidity cause crash by system')
    //         }
    //     } else alert('get PoolPair contract failed')
    // }
    // const swap = async (leftEqualRDX, leftSwapValue) => {
    //     const rdxContract = await getContract('rdx')
    //     const wjkContract = await getContract('wjk')
    //     const pooContract = await getContract('poo')
    //     if (pooContract != null && rdxContract != null && wjkContract != null) {
    //         try {
    //             if (leftEqualRDX) {
    //                 let rdxAllowance = await getRDXAllowance()
    //                 if (leftSwapValue <= 0) return alert('please submit an valid amount to swap')
    //                 if (rdxAllowance && rdxAllowance - leftSwapValue >= 0) {
    //                     const swapTX = await pooContract.swap(RDXToken.contractAddress,
    //                         parseUnits(`${leftSwapValue}`, 12),
    //                         parseUnits('0', 12))
    //                     await swapTX.wait()
    //                     alert('swap success')
    //                     await updateTokenBal()
    //                 } else {
    //                     let tx = await rdxContract.approve(PoolPair.contractAddress, parseUnits(`${leftSwapValue}`, 12))
    //                     await tx.wait()
    //                     const swapTX = await pooContract.swap(RDXToken.contractAddress,
    //                         parseUnits(`${leftSwapValue}`, 12),
    //                         parseUnits('0', 12))
    //                     await swapTX.wait()
    //                     alert('swap success')
    //                     await updateTokenBal()
    //                 }
    //             } else {
    //                 let wjkAllowance = await getWJKAllowance()
    //                 if (leftSwapValue <= 0) return alert('please submit an valid amount to swap')
    //                 if (wjkAllowance && wjkAllowance - leftSwapValue >= 0) {
    //                     const swapTX = await pooContract.swap(WJKToken.contractAddress,
    //                         parseUnits(`${leftSwapValue}`, 12),
    //                         parseUnits('0', 12))
    //                     alert('swap success')
    //                     await swapTX.wait()
    //                     await updateTokenBal()
    //                 } else {
    //                     let tx = await wjkContract.approve(PoolPair.contractAddress, parseUnits(`${leftSwapValue}`, 12))
    //                     await tx.wait()
    //                     const swapTX = await pooContract.swap(WJKToken.contractAddress,
    //                         parseUnits(`${leftSwapValue}`, 12),
    //                         parseUnits('0', 12))
    //                     await swapTX.wait()
    //                     alert('swap success')
    //                     await updateTokenBal()
    //                 }
    //             }
    //         } catch (error) {
    //             alert('swap cause crash by system')
    //         }
    //     } else alert('get poolpair contract failed')

    // }


    // master chef
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
                coinBals,
                mintCoin,
                addLiquidity,
                approveCoin,
                showApproveModal, setShowApproveModal, coinAApprove, coinBApprove, setCoinAAprove, setCoinBApprove,
                addLiquidityTokenA, setAddLiquidityTokenA, addLiquidityTokenB, setAddLiquidityTokenB, addLiquidityShowModal, setAddLiquidityShowModal,
                swapTokenA, setSwapTokenA, swapTokenB, setSwapTokenB, swapShowModal, setSwapModal,

                uniDepositBalance, uniRdxPending,
                setUniDepositAmount, depositToken,
                setUniWithdrawAmount, withdrawToken,
                setClaimeRewardFromUniAmount, claimReward
            }}
        >
            {children}
        </MainContext.Provider>
    )
}