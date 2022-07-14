import React, { useContext, useMemo, useState } from "react";
import { MainContext } from '../../context/MainContext'
import { Outlet, Link } from "react-router-dom";


const SwapRoute = () => {

    return (
        <>
            <nav>
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Link to="/swap/" style={{ marginRight: 50 }}>
                        <p style={{ fontSize: 25, color: 'blue' }}>
                            Swap
                        </p>
                    </Link>
                    <Link to="/swap/add_liquidity" style={{ marginRight: 50 }}>
                        <p style={{ fontSize: 25, color: 'blue' }}>
                            Add Liquidity
                        </p>
                    </Link>
                    <Link to="/swap/remove_liquidity" style={{ marginRight: 50 }}>
                        <p style={{ fontSize: 25, color: 'blue' }}>
                            Remove Liquidity
                        </p>
                    </Link>
                </div>
            </nav>

            <Outlet />
        </>

    )
}
export default SwapRoute


// interface inputPros {
//     placeholder: string,
//     name: string,
//     type: string,
//     handleChange: Function,
//     value: any
// }
// const Input = ({ placeholder, name, type, handleChange, value }: inputPros) => (
//     <input
//         placeholder={placeholder}
//         type={type}
//         style={{ marginRight: 10, width: 120 }}
//         onChange={(e) => handleChange(e, name)}
//         value={value}
//     />
// );

// const [leftEqualRDX, setLeftEqualRDX] = useState<boolean>(true)
// const [leftSwapValue, setLeftSwapValue] = useState<any>(0)
// const handleSwap = () => {
//     swap(leftEqualRDX, leftSwapValue)
// }
// const handleAddLQ = () => {
//     const { rdxExpect, rdxMin, wjkMin } = formDataAddLQ
//     addLiquidity(rdxExpect, rightLiquidityValue, rdxMin, wjkMin)
// }
// const handleRemoveLQ = () => {
//     const { lpToBurn, rdxMinBack, wjkMinBack } = formDataRemoveLQ
//     removeLiquidity(lpToBurn, rdxMinBack, wjkMinBack)
// }

// const rightSwapValue = useMemo(() => {
//     if (reserveRdx <= 0 || reserveWjk <= 0 || parseFloat(leftSwapValue) <= 0) {
//         return 0
//     }
//     let tokenOutAmount
//     if (leftEqualRDX) {
//         tokenOutAmount = (reserveWjk * parseFloat(leftSwapValue)) / (reserveRdx + parseFloat(leftSwapValue))
//     } else {
//         tokenOutAmount = (reserveRdx * parseFloat(leftSwapValue)) / (reserveWjk + parseFloat(leftSwapValue))
//     }
//     return tokenOutAmount
// }, [leftEqualRDX, leftSwapValue, reserveRdx, reserveWjk])

// const rightLiquidityValue = useMemo(() => {
//     if (reserveRdx <= 0 || reserveWjk <= 0 || parseFloat(formDataAddLQ.rdxExpect) <= 0) return 0
//     let rightAmountOut = parseFloat(formDataAddLQ.rdxExpect) * parseFloat(reserveWjk) / parseFloat(reserveRdx)
//     rightAmountOut = Math.round(rightAmountOut * 100) / 100
//     return rightAmountOut
// }, [formDataAddLQ.rdxExpect, reserveRdx, reserveWjk])

// {/* <div style={{ display: 'flex', flexDirection: 'column' }} >
//                 <div style={{ display: 'flex', flexDirection: 'column' }} >
//                     <h1 style={{ color: 'blue' }} >Swap</h1>
//                     <div style={{ display: 'flex', flexDirection: 'row' }}>
//                         <div style={{ display: 'flex', flexDirection: 'column', marginRight: 40 }} >
//                             <p>RDX available in pool:</p>
//                             <p style={{ fontSize: 20 }}>{}</p>
//                         </div>
//                         <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 40 }} >
//                             <p>WJK available in pool:</p>
//                             <p style={{ fontSize: 20 }}>{}</p>
//                         </div>
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'row' }}>
//                         <div style={{ display: 'flex', flexDirection: 'column', marginRight: 20 }}>
//                             <p>{leftEqualRDX ? 'RDX' : 'WJK'}: {rdxBal}</p>
//                             <input style={{ marginRight: 10, width: 120 }} type='number' onChange={(e) => {
//                                 setLeftSwapValue(e.target.value)
//                             }} />
//                         </div>
//                         <div style={{ display: 'flex', flexDirection: 'column' }}>
//                             <p>{leftEqualRDX ? 'WJK' : 'RDX'}: {wjkBal}</p>
//                             <input style={{ marginRight: 10, width: 120 }} type='number' disabled={true} value={rightSwapValue} />
//                         </div>
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
//                         <p style={{ marginRight: 20 }}>{leftEqualRDX ? 'RDX TO WJK' : 'WJK TO RDX'}</p>
//                         <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 30, width: 60, marginRight: 20 }}
//                             type="button" onClick={() => setLeftEqualRDX(!leftEqualRDX)}>
//                             <p>Revert</p>
//                         </button>
//                         <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 30, width: 60, }}
//                             type="button" onClick={handleSwap}>
//                             <p>Swap</p>
//                         </button>
//                     </div>
//                 </div>
//                 <div style={{ display: 'flex', flexDirection: 'column' }} >
//                     <h1 style={{ color: 'blue', marginRight: 25 }} >Add Liquidity</h1>
//                     <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 20 }}>
//                         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 50 }}>
//                             <p>Approve RDX</p>
//                             <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 30, width: 60 }} type="button" onClick={approveRDX}>
//                                 <p>Approve</p>
//                             </button>
//                         </div>
//                         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                             <p>Approve WJK</p>
//                             <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 30, width: 60 }} type="button" onClick={approveWJK}>
//                                 <p>Approve</p>
//                             </button>
//                         </div>
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'row' }}>
//                         <div style={{ display: 'flex', flexDirection: 'column' }}>
//                             <p>RDX : {rdxBal}</p>
//                             <Input placeholder="RDX Expect" name="rdxExpect" type="number"
//                                 handleChange={handleChangeAddLQ} value={undefined} />
//                         </div>
//                         <div style={{ display: 'flex', flexDirection: 'column' }}>
//                             <p>WJK : {wjkBal}</p>
//                             <Input placeholder="WJK Expect" name="wjkExpect" type="number"
//                                 handleChange={handleChangeAddLQ} value={rightLiquidityValue} />
//                         </div>

//                     </div>
//                     <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 30, width: 60, marginTop: 20 }} type="button" onClick={handleAddLQ}>
//                         <p>Add</p>
//                     </button>
//                 </div>
//                 <div style={{ display: 'flex', flexDirection: 'column' }} >
//                     <h1 style={{ color: 'blue', marginRight: 25 }} >Recall Liquidity</h1>
//                     <div style={{ display: 'flex', flexDirection: 'column' }}>
//                         <p>Approve RDLP</p>
//                         <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 30, width: 60 }} type="button" onClick={approveRDLP}>
//                             <p>Approve</p>
//                         </button>
//                     </div>
//                     <p>Your RDLP Token: {rdlpBal}</p>
//                     <div style={{ display: 'flex', flexDirection: 'row' }}>
//                         <Input placeholder="LP amount" name="lpToBurn" type="number" handleChange={handleChangeRemoveLQ} value={undefined} />
//                         <Input placeholder="RDX Min Back" name="rdxMinBack" type="number" handleChange={handleChangeRemoveLQ} value={undefined} />
//                         <Input placeholder="WJK Min Back" name="wjkMinBack" type="number" handleChange={handleChangeRemoveLQ} value={undefined} />
//                     </div>
//                     <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 30, width: 60, marginTop: 20 }} type="button" onClick={handleRemoveLQ}>
//                         <p>Recall</p>
//                     </button>
//                 </div>
//             </div> */}