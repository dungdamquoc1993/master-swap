import React, { useEffect, useState, useContext } from "react";
import { MainContext } from "../context/MainContext";

const Home = () => {
    const { userAccount, mintCoin, coinBals } = useContext(MainContext)

    return (
        <div style={{ display: 'flex', marginTop: 30, marginBottom: 30, justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <p>Account: {userAccount}</p>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <h1 style={{ color: 'blue', marginRight: 25 }} >Mint 1000 Uni </h1>
                <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 25, width: 60 }} type="button" onClick={() => mintCoin('uni')} >
                    <p>mint</p>
                </button>
            </div>
            <p>Your Coin Uni Balance: {coinBals.uniBal} </p>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <h1 style={{ color: 'blue', marginRight: 25 }} >Mint 1000 A </h1>
                <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 25, width: 60 }} type="button" onClick={() => mintCoin('a')} >
                    <p>mint</p>
                </button>
            </div>
            <p>Your A Balance: {coinBals.coinABal} </p>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <h1 style={{ color: 'blue', marginRight: 25 }} >Mint 1000 B </h1>
                <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 25, width: 60 }} type="button" onClick={() => mintCoin('b')} >
                    <p>mint</p>
                </button>
            </div>
            <p>Your B Balance: {coinBals.coinBBal} </p>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <h1 style={{ color: 'blue', marginRight: 25 }} >Mint 1000 C </h1>
                <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 25, width: 60 }} type="button" onClick={() => mintCoin('c')} >
                    <p>mint</p>
                </button>
            </div>
            <p>Your C Balance: {coinBals.coinCBal} </p>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <h1 style={{ color: 'blue', marginRight: 25 }} >Mint 1000 D </h1>
                <button style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 25, width: 60 }} type="button" onClick={() => mintCoin('d')} >
                    <p>mint </p>
                </button>
            </div>
            <p>Your D Balance: {coinBals.coinDBal} </p>
            <h2>Your RDX Chef Reward Balance: {coinBals.rdxrwBal} </h2>

        </div>
    )
}

export default Home