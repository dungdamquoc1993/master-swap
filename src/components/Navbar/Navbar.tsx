import { useContext, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { useWeb3React } from '@web3-react/core';
import { Injected } from '../../connectors';
import { MainContext } from "../../context/MainContext";

const Navbar = () => {
    const { userAccount } = useContext(MainContext)
    const { activate } = useWeb3React();
    const connectWallet = async () => {
        await activate(Injected)
    }
    useEffect(() => {
        if (window.localStorage.getItem('userAccount')) {
            connectWallet()
        }
    }, [])

    return (
        <>
            <nav>
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Link to="/" style={{ marginRight: 50 }}>
                        <p style={{ fontSize: 25 }}>Home</p>
                    </Link>
                    <Link to="/swap" style={{ marginRight: 50 }}>
                        <p style={{ fontSize: 25 }}>
                            Swap
                        </p>
                    </Link>
                    <Link to="/farm" style={{ marginRight: 50 }}>
                        <p style={{ fontSize: 25 }}>
                            Farm
                        </p>
                    </Link>
                    {!userAccount &&
                        <button onClick={connectWallet}>
                            <p>Connect Wallet</p>
                        </button>}
                </div>
            </nav>

            <Outlet />
        </>
    )
};

export default Navbar;