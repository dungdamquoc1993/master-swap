import React, { useContext, useEffect, useMemo, useState } from "react";
import { MainContext } from '../context/MainContext'

interface inputPros {
    placeholder: string,
    name: string,
    type: string,
    handleChange: Function
}
const Input = ({ placeholder, name, type, handleChange }: inputPros) => (
    <input
        placeholder={placeholder}
        type={type}
        style={{ marginRight: 10, width: 120 }}
        onChange={(e) => handleChange(e, name)}
    />
);
const Swap = () => {


    const [leftEqualRDX, setLeftEqualRDX] = useState<boolean>(true)
    const [leftSwapValue, setLeftSwapValue] = useState<any>(0)
    const { rdlpBal, formDataAddLQ, handleChangeAddLQ, addLiquidity, formDataRemoveLQ, handleChangeRemoveLQ, removeLiquidity, swap, reserveRdx, reserveWjk } = useContext(MainContext)
    const handleSwap = () => {
        swap(leftEqualRDX, leftSwapValue)
    }
    const handleAddLQ = () => {
        const { rdxExpect, wjkExpect, rdxMin, wjkMin } = formDataAddLQ
        addLiquidity(rdxExpect, wjkExpect, rdxMin, wjkMin)
    }
    const handleRemoveLQ = () => {
        const { lpToBurn, rdxMinBack, wjkMinBack } = formDataRemoveLQ
        removeLiquidity(lpToBurn, rdxMinBack, wjkMinBack)
    }

    const rightSwapValue = useMemo(() => {
        if (reserveRdx <= 0 || reserveWjk <= 0 || leftSwapValue <= 0) {
            return 0
        }
        let tokenOutAmount
        if (leftEqualRDX) {
            tokenOutAmount = (reserveWjk * parseInt(leftSwapValue)) / (reserveRdx + parseInt(leftSwapValue))
        } else {
            tokenOutAmount = (reserveRdx * parseInt(leftSwapValue)) / (reserveWjk + parseInt(leftSwapValue))
        }
        return tokenOutAmount
    }, [leftEqualRDX, leftSwapValue, reserveRdx, reserveWjk])


    return (
        <div style={{ paddingBottom: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{display: 'flex', flexDirection: 'column'}} >
                <div style={{ display: 'flex', flexDirection: 'column' }} >
                    <h1 style={{ color: 'blue' }} >Swap</h1>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', marginRight: 40 }} >
                            <p>RDX available in pool:</p>
                            <p style={{ fontSize: 20 }}>{reserveRdx}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 40 }} >
                            <p>WJK available in pool:</p>
                            <p style={{ fontSize: 20 }}>{reserveWjk}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', marginRight: 20 }}>
                            <p>{leftEqualRDX ? 'RDX' : 'WJK'}</p>
                            <input style={{ marginRight: 10, width: 120 }} type='number' onChange={(e) => {
                                setLeftSwapValue(e.target.value)
                            }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <p>{leftEqualRDX ? 'WJK' : 'RDX'}</p>
                            <input style={{ marginRight: 10, width: 120 }} type='number' disabled={true} value={rightSwapValue} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <p style={{ marginRight: 20 }}>{leftEqualRDX ? 'RDX TO WJK' : 'WJK TO RDX'}</p>
                        <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 30, width: 60, marginRight: 20 }}
                            type="button" onClick={() => setLeftEqualRDX(!leftEqualRDX)}>
                            <p>Revert</p>
                        </button>
                        <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 30, width: 60, }}
                            type="button" onClick={handleSwap}>
                            <p>Swap</p>
                        </button>
                    </div>

                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }} >
                    <h1 style={{ color: 'blue', marginRight: 25 }} >Add Liquidity</h1>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Input placeholder="RDX Expect" name="rdxExpect" type="number" handleChange={handleChangeAddLQ} />
                        <Input placeholder="WJK Expect" name="wjkExpect" type="number" handleChange={handleChangeAddLQ} />
                    </div>


                    <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 30, width: 60, marginTop: 20 }} type="button" onClick={handleAddLQ}>
                        <p>Add</p>
                    </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }} >
                    <h1 style={{ color: 'blue', marginRight: 25 }} >Recall Liquidity</h1>
                    <p>Your RDLP Token: {rdlpBal}</p>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Input placeholder="LP amount" name="lpToBurn" type="number" handleChange={handleChangeRemoveLQ} />
                        <Input placeholder="RDX Min Back" name="rdxMinBack" type="number" handleChange={handleChangeRemoveLQ} />
                        <Input placeholder="WJK Min Back" name="wjkMinBack" type="number" handleChange={handleChangeRemoveLQ} />
                    </div>
                    <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 30, width: 60, marginTop: 20 }} type="button" onClick={handleRemoveLQ}>
                        <p>Recall</p>
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Swap