import React, { useEffect, useState } from "react";
import { useWeb3React } from '@web3-react/core';
import { getContract, getPairContract } from "../utils/getContract";
import { MasterChef, UniRouter, CoinB, CoinA, CoinC, CoinD, UNIToken } from '../utils/constant'
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
    const [reserveSwap, setReserveSwap] = useState({ reserveA: 0, reserveB: 0 })
    const [reserveAdd, setReserveAdd] = useState({ reserveA: 0, reserveB: 0 })
    const [reserveRemove, setReserveRemove] = useState({ reserveA: 0, reserveB: 0 })

    const getReserveInPair = async (page, pairName, tokenA, tokenB) => {
        const pairContract = await getPairContract(pairName)
        if (!pairContract || pairContract?.address == 0) {
            if (page === 'swap') {
                setReserveSwap((prevState) => ({ ...prevState, reserveA: 0 }))
                setReserveSwap((prevState) => ({ ...prevState, reserveB: 0 }))
            } else if (page === 'add') {
                setReserveAdd((prevState) => ({ ...prevState, reserveA: 0 }))
                setReserveAdd((prevState) => ({ ...prevState, reserveB: 0 }))
            } else if (page === 'remove') {
                setReserveRemove((prevState) => ({ ...prevState, reserveA: 0 }))
                setReserveRemove((prevState) => ({ ...prevState, reserveB: 0 }))
            }
            return
        }
        if (pairContract != null) {
            try {
                let reserve0 = parseInt((await pairContract.getReserves())[0]) / 10 ** 12
                let reserve1 = parseInt((await pairContract.getReserves())[1]) / 10 ** 12
                if (page === 'swap') {
                    if (tokenA < tokenB) {
                        setReserveSwap((prevState) => ({ ...prevState, reserveA: reserve0 }))
                        setReserveSwap((prevState) => ({ ...prevState, reserveB: reserve1 }))
                    } else {
                        setReserveSwap((prevState) => ({ ...prevState, reserveA: reserve1 }))
                        setReserveSwap((prevState) => ({ ...prevState, reserveB: reserve0 }))
                    }
                } else if (page === 'add') {
                    if (tokenA < tokenB) {
                        setReserveAdd((prevState) => ({ ...prevState, reserveA: reserve0 }))
                        setReserveAdd((prevState) => ({ ...prevState, reserveB: reserve1 }))
                    } else {
                        setReserveAdd((prevState) => ({ ...prevState, reserveA: reserve1 }))
                        setReserveAdd((prevState) => ({ ...prevState, reserveB: reserve0 }))
                    }
                } else if (page === 'remove') {
                    if (tokenA < tokenB) {
                        setReserveRemove((prevState) => ({ ...prevState, reserveA: reserve0 }))
                        setReserveRemove((prevState) => ({ ...prevState, reserveB: reserve1 }))
                    } else {
                        setReserveRemove((prevState) => ({ ...prevState, reserveA: reserve1 }))
                        setReserveRemove((prevState) => ({ ...prevState, reserveB: reserve0 }))
                    }
                }
            } catch (error) {
                alert('get reserve cause crash by system')
            }
        } else {
            alert('get pair contract cause crash pair might be not initialize yet')
        }
    }

    const [addLiquidityTokenA, setAddLiquidityTokenA] = useState('')
    const [addLiquidityTokenB, setAddLiquidityTokenB] = useState('')
    const [addLiquidityShowModal, setAddLiquidityShowModal] = useState(false)
    const [showApproveModal, setShowApproveModal] = useState(false)
    const [coinAApprove, setCoinAAprove] = useState('')
    const [coinBApprove, setCoinBApprove] = useState('')
    const addLiquidity = async (pairName, coinAName, coinBName, amountADesired, amountBDesired) => {
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
                if (coinAAllowance - parseInt(amountADesired.toString()) / 10 ** 12 >= 0 &&
                    coinBAllowance - parseInt(amountBDesired.toString()) / 10 ** 12 >= 0) {
                    const tx = await routerContract.addLiquidity(
                        tokenAAddress < tokenBAddress ? tokenAAddress : tokenBAddress,
                        tokenAAddress < tokenBAddress ? tokenBAddress : tokenAAddress,
                        tokenAAddress < tokenBAddress ? amountADesired : amountBDesired,
                        tokenAAddress < tokenBAddress ? amountBDesired : amountADesired,
                        0, 0, userAccount, deadline)
                    await tx.wait()
                    alert('add liquidity success')
                    await updateTokenBal()
                    await getReserveInPair('add', pairName, tokenAAddress, tokenBAddress)
                } else {
                    setShowApproveModal(true)
                    if (coinAAllowance - parseInt(amountADesired.toString()) / 10 ** 12 < 0) {
                        setCoinAAprove(coinAName)
                    }
                    if (coinBAllowance - parseInt(amountBDesired.toString()) / 10 ** 12 < 0) {
                        setCoinBApprove(coinBName)
                    }
                }
            } catch (error) {
                console.log(error)
                alert('add liquidity cause crash by system')
            }
        } else alert('get PoolPair contract failed')
    }

    const [poolName, setPoolName] = useState('')
    const [showPickPoolModal, setShowPickPoolModal] = useState(false)
    // const [removeTokenA, setRemoveTokenA] = useState('')
    // const [removeTokenB, setRemoveTokenB] = useState('')
    
    // const removeLiquidity = async (lpToBurn) => {
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

    const [swapTokenA, setSwapTokenA] = useState('')
    const [swapTokenB, setSwapTokenB] = useState('')
    const [swapShowModal, setSwapModal] = useState('')
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
    const getTokenDepositBalance = async () => {
        const contract = await getContract('msc')
        if (contract != null) {
            poolNames.forEach(async (name) => {
                try {
                    const balance = await contract.getUserAmountDeposit(name)
                    if (name === 'uni') {
                        setUniBalance(parseInt(balance.toString()) / 10 ** 12)
                    }
                } catch (error) {
                    alert('get token deposit balance cause crash from system')
                }
            })
        } else alert('get MSC contract failed in getUniDepositBal')
    }
    const [uniRdxPending, setUniRdxPending] = useState(0)
    const getRDXPending = async () => {
        const contract = await getContract('msc')
        if (contract != null) {
            try {
                poolNames.forEach(async (name) => {
                    if (name === 'uni') {
                        const RDXPending = await contract.pendingRedDot(name, userAccount)
                        setUniRdxPending(Math.round(parseInt(RDXPending.toString()) / 10 ** 12))
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
    // get reserve in page add liquidity    
    useEffect(() => {
        if (!addLiquidityTokenA || !addLiquidityTokenB) return
        const tokenA = addLiquidityTokenA === 'CoinA' ? CoinA.contractAddress : addLiquidityTokenA === 'CoinB' ?
            CoinB.contractAddress : addLiquidityTokenA === 'CoinC' ? CoinC.contractAddress :
                addLiquidityTokenA === 'CoinD' ? CoinD.contractAddress : ''
        const tokenB = addLiquidityTokenB === 'CoinA' ? CoinA.contractAddress : addLiquidityTokenB === 'CoinB' ?
            CoinB.contractAddress : addLiquidityTokenB === 'CoinC' ? CoinC.contractAddress :
                addLiquidityTokenB === 'CoinD' ? CoinD.contractAddress : ''
        const pairName =
            addLiquidityTokenA === 'CoinA' && addLiquidityTokenB === 'CoinB' ? 'ab' :
                addLiquidityTokenA === 'CoinA' && addLiquidityTokenB === 'CoinC' ? 'ac' :
                    addLiquidityTokenA === 'CoinA' && addLiquidityTokenB === 'CoinD' ? 'ad' :
                        addLiquidityTokenA === 'CoinB' && addLiquidityTokenB === 'CoinA' ? 'ab' :
                            addLiquidityTokenA === 'CoinB' && addLiquidityTokenB === 'CoinC' ? 'bc' :
                                addLiquidityTokenA === 'CoinB' && addLiquidityTokenB === 'CoinD' ? 'bd' :
                                    addLiquidityTokenA === 'CoinC' && addLiquidityTokenB === 'CoinA' ? 'ac' :
                                        addLiquidityTokenA === 'CoinC' && addLiquidityTokenB === 'CoinB' ? 'bc' :
                                            addLiquidityTokenA === 'CoinC' && addLiquidityTokenB === 'CoinD' ? 'cd' :
                                                addLiquidityTokenA === 'CoinD' && addLiquidityTokenB === 'CoinA' ? 'ad' :
                                                    addLiquidityTokenA === 'CoinD' && addLiquidityTokenB === 'CoinB' ? 'bd' :
                                                        addLiquidityTokenA === 'CoinD' && addLiquidityTokenB === 'CoinC' ? 'cd' : ''
        getReserveInPair('add', pairName, tokenA, tokenB)
    }, [addLiquidityTokenA, addLiquidityTokenB])
    // get reserve in page swap liquidity    
    useEffect(() => {
        if (!swapTokenA || !swapTokenB) return
        const tokenA = swapTokenA === 'CoinA' ? CoinA.contractAddress : swapTokenA === 'CoinB' ?
            CoinB.contractAddress : swapTokenA === 'CoinC' ? CoinC.contractAddress :
                swapTokenA === 'CoinD' ? CoinD.contractAddress : ''
        const tokenB = swapTokenB === 'CoinA' ? CoinA.contractAddress : swapTokenB === 'CoinB' ?
            CoinB.contractAddress : swapTokenB === 'CoinC' ? CoinC.contractAddress :
                swapTokenB === 'CoinD' ? CoinD.contractAddress : ''
        const pairName =
            swapTokenA === 'CoinA' && swapTokenB === 'CoinB' ? 'ab' :
                swapTokenA === 'CoinA' && swapTokenB === 'CoinC' ? 'ac' :
                    swapTokenA === 'CoinA' && swapTokenB === 'CoinD' ? 'ad' :
                        swapTokenA === 'CoinB' && swapTokenB === 'CoinA' ? 'ab' :
                            swapTokenA === 'CoinB' && swapTokenB === 'CoinC' ? 'bc' :
                                swapTokenA === 'CoinB' && swapTokenB === 'CoinD' ? 'bd' :
                                    swapTokenA === 'CoinC' && swapTokenB === 'CoinA' ? 'ac' :
                                        swapTokenA === 'CoinC' && swapTokenB === 'CoinB' ? 'bc' :
                                            swapTokenA === 'CoinC' && swapTokenB === 'CoinD' ? 'cd' :
                                                swapTokenA === 'CoinD' && swapTokenB === 'CoinA' ? 'ad' :
                                                    swapTokenA === 'CoinD' && swapTokenB === 'CoinB' ? 'bd' :
                                                        swapTokenA === 'CoinD' && swapTokenB === 'CoinC' ? 'cd' : ''
        getReserveInPair('swap', pairName, tokenA, tokenB)
    }, [swapTokenA, swapTokenB])

    useEffect(() => {
        if (poolName === 'ab') {
            const pairName = 'ab'
            const [tokenA, tokenB] = CoinA.contractAddress < CoinB.contractAddress ? [CoinA.contractAddress, CoinB.contractAddress] :
                [CoinB.contractAddress, CoinA.contractAddress]
            // setRemoveTokenA('Coin A')
            // setRemoveTokenB('Coin B')
            getReserveInPair('remove', pairName, tokenA, tokenB)

        } else if (poolName === 'ac') {
            // setRemoveTokenA('Coin A')
            // setRemoveTokenB('Coin C')
            const pairName = 'ac'
            const [tokenA, tokenB] = CoinA.contractAddress < CoinC.contractAddress ? [CoinA.contractAddress, CoinC.contractAddress] :
                [CoinC.contractAddress, CoinA.contractAddress]
            getReserveInPair('remove', pairName, tokenA, tokenB)

        } else if (poolName === 'ad') {
            // setRemoveTokenA('Coin A')
            // setRemoveTokenB('Coin D')
            const pairName = 'ad'
            const [tokenA, tokenB] = CoinA.contractAddress < CoinD.contractAddress ? [CoinA.contractAddress, CoinD.contractAddress] :
                [CoinD.contractAddress, CoinA.contractAddress]
            getReserveInPair('remove', pairName, tokenA, tokenB)

        } else if (poolName === 'bc') {
            // setRemoveTokenA('Coin B')
            // setRemoveTokenB('Coin C')
            const pairName = 'bc'
            const [tokenA, tokenB] = CoinB.contractAddress < CoinC.contractAddress ? [CoinB.contractAddress, CoinC.contractAddress] :
                [CoinC.contractAddress, CoinB.contractAddress]
            getReserveInPair('remove', pairName, tokenA, tokenB)

        } else if (poolName === 'bd') {
            // setRemoveTokenA('Coin B')
            // setRemoveTokenB('Coin D')
            const pairName = 'bd'
            const [tokenA, tokenB] = CoinB.contractAddress < CoinD.contractAddress ? [CoinB.contractAddress, CoinD.contractAddress] :
                [CoinD.contractAddress, CoinB.contractAddress]
            getReserveInPair('remove', pairName, tokenA, tokenB)

        } else if (poolName === 'cd') {
            // setRemoveTokenA('Coin C')
            // setRemoveTokenB('Coin D')
            const pairName = 'cd'
            const [tokenA, tokenB] = CoinC.contractAddress < CoinD.contractAddress ? [CoinC.contractAddress, CoinD.contractAddress] :
                [CoinD.contractAddress, CoinC.contractAddress]
            getReserveInPair('remove', pairName, tokenA, tokenB)
        }
    }, [poolName])

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
                reserveAdd,
                swapTokenA, setSwapTokenA, swapTokenB, setSwapTokenB, swapShowModal, setSwapModal,
                reserveSwap,

                showPickPoolModal, setShowPickPoolModal, poolName, setPoolName, 
                // removeTokenA, removeTokenB, reserveRemove,

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