import React from "react";
import { useWeb3React } from "@web3-react/core";

import ConnectWallet from "./components/ConnectWallet";
import Mint from "./components/Mint";
import "./index.css";

import main_logo from "../../assets/main-logo.png";
import txt1 from "../../assets/text1.png";
import txt2 from "../../assets/text2.png";
import txt3 from "../../assets/text3.png";

function LandingPage() {
    const context = useWeb3React();
    const { account, connector, active } = context;

    return (
        <>
            <title>Ordinary Everyday</title>
            <div className="warp_page">
                <header>
                    <img src={main_logo} alt="main logo" className="logo" />
                </header>
                <main>
                    <div className="wrap_main">
                        <div className="menu">
                            <img src={main_logo} alt="main logo" className="logo-main" />
                            <img src={txt1} className="imgtext a" alt="" />
                            <img src={txt2} className="imgtext b" alt="" />
                            <img src={txt3} className="imgtext c" alt="" />
                            {active
                                ? <Mint />
                                : <ConnectWallet />
                            }
                        </div>
                        <div className="wrap_social">
                            <a className="social" href="https://twitter.com/OrdnryEvrdy" target="_blank" rel="noopener noreferrer">
                                TWITTER
                            </a>
                            <a className="social" href="http://" target="_blank" rel="noopener noreferrer">
                                OPENSEA
                            </a>
                            <a className="social" href="http://" target="_blank" rel="noopener noreferrer">
                                ETHERSCAN
                            </a>
                        </div>
                    </div>
                    <div className="img_preview" />
                </main>
                <footer>
                    © 2022 Ordinary Everyday
                </footer>
            </div>
        </>
    );
}

export default LandingPage;
