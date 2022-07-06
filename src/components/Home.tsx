import React, { useEffect, useState, useContext } from "react";
import { MainContext } from "../context/MainContext";

const Home = () => {
    const { userAccount, rdxBal, uniBal, wjkBal, rdxrwBal, rdlpBal, mintRDX, mintWJK, mintUni } = useContext(MainContext)
    
    return (
        <div style={{ display: 'flex', marginTop: 30, marginBottom: 30, justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <p>Account: {userAccount}</p>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <h1 style={{ color: 'blue', marginRight: 25 }} >Mint 1000 RDX </h1>
                <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 25, width: 60 }} type="button" onClick={mintRDX} >
                    <p>mint </p>
                </button>
            </div>
            <p>Your RDX Balance: {rdxBal} </p>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <h1 style={{ color: 'blue', marginRight: 25 }} >Mint 1000 Uni </h1>
                <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 25, width: 60 }} type="button" onClick={mintUni} >
                    <p>mint </p>
                </button>
            </div>
            <p>Your Uni Balance: {uniBal} </p>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <h1 style={{ color: 'blue', marginRight: 25 }} >Mint 1000 WJK </h1>
                <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 25, width: 60 }} type="button" onClick={mintWJK} >
                    <p>mint </p>
                </button>
            </div>
            <p>Your WJK Balance: {wjkBal} </p>

            <h2>Your RDX Chef Reward Balance: {rdxrwBal} </h2>
            <h2>Your RDLP Balance: {rdlpBal}</h2>

        </div>
    )
}

export default Home