import React, { useEffect, useState, useRef } from "react";
import { useWeb3React } from '@web3-react/core';
import { BigNumber, Contract, providers, utils } from "ethers";

import ABI from "./abi.json";
import axios from "axios";

function Mint() {
    const context = useWeb3React();
    const { account, connector, active } = context;
    const web3 = new providers.Web3Provider(window.ethereum);
    const signerAddr = web3.getSigner();
    const contract = new Contract(
        "0xD45C1E669a7D3E7E01C39e0cE8e93A6d9eD7cA87",
        ABI,
        signerAddr
    );

    // Mint Info
    let [ mintStatus, setMintStatus ] = useState(2);
    let [ supplyMinted, setSupplyMinted ] = useState(0);
    let [ maxPerWallet, setMaxPerWallet ] = useState(0);
    let [ tokenPrice, setTokenPrice ] = useState(0);

    let [ totalFreeMintSupply, setTotalFreeMintSupply] = useState(0);

    // User
    let [ tokenAmount, setTokenAmount ] = useState(null);
    let [ merkleProof, setMerkleProof ] = useState(null);
    let [ freeMinted, setFreeMinted ] = useState(false);
    let [ userMinted, setUserMinted ] = useState(0);

    // others
    let [ mintError, setMintError ] = useState(undefined);
    let [ numCanMint, setNumCanMint ] = useState([ 1, 2, 3, 4 ]);
    let [ numToMint, setNumToMint ] = useState(1);
    let [ listMethod, setListMethod ] = useState([0, 1]);
    let [ method, setMethod ] = useState(0);

    useInterval(async () => {

        if (active && account && connector && web3) {

            const getMintStatus = await contract.mintStatus().then(res => parseInt(res.toString()));
            const getSupplyMinted = await contract.totalSupply().then(res => parseInt(res.toString()));
            const getMaxPerWallet = await contract.maxPerWallet().then(res => parseInt(res.toString()));
            const getTokenPrice = await contract.price().then(res => parseInt(res.toString()));

            const getTotalFreeMintSupply = await contract.totalFreeMintSupply().then(res => parseInt(res.toString()));

            const getFreeMinted = await contract.freeMinted(account)
            const getUserMinted = await contract.userMinted(account).then(res => parseInt(res.toString()));

            if(mintStatus !== getMintStatus && !isNaN(getMintStatus))               setMintStatus(getMintStatus);
            if((mintStatus == 0 || mintStatus == 1) && !tokenAmount && !merkleProof) {
                const { data: { amount, merkleProof: mkp } } = await axios.get(`https://api.ordinaryeveryday.xyz/merkleproof?address=${account}`);
                setTokenAmount(amount);
                setMerkleProof(mkp);
            }
            if(supplyMinted !== getSupplyMinted && !isNaN(getSupplyMinted))         setSupplyMinted(getSupplyMinted);
            if(maxPerWallet !== getMaxPerWallet && !isNaN(getMaxPerWallet))         setMaxPerWallet(getMaxPerWallet);
            if(tokenPrice !== getTokenPrice && !isNaN(getTokenPrice))               setTokenPrice(getTokenPrice);

            if(totalFreeMintSupply !== getTotalFreeMintSupply && !isNaN(getTotalFreeMintSupply)) setTotalFreeMintSupply(getTotalFreeMintSupply);

            if(freeMinted !== getFreeMinted)                                        setFreeMinted(getFreeMinted);
            if(userMinted !== getUserMinted && !isNaN(getUserMinted))               setUserMinted(getUserMinted);


        }
    }, supplyMinted !== 7777 ? 1000 : null);


    async function handleMint(type) {
        if (active && account && connector && web3) {
            if(type == 1) {
                if(!tokenAmount && !merkleProof) return setMintError("You are not eligible");
                const txn = await contract.freeMint(
                    tokenAmount,
                    merkleProof
                ).catch(err => {
                    setMintError(err?.reason);
                });
                if(txn !== undefined) {
                    const receipt = await txn.wait().catch(err => {
                        setMintError(err?.reason);
                    });
                    if(receipt !== undefined) console.log(receipt);
                }
            } else if(type == 2) {
                const txn = await contract.publicMint(
                    numToMint,
                    {
                        value: BigNumber.from(`${tokenPrice * numToMint}`)
                    }
                ).catch(err => {
                    setMintError(err?.reason);
                });
                if(txn !== undefined) {
                    const receipt = await txn.wait().catch(err => {
                        setMintError(err?.reason);
                    });
                    if(receipt !== undefined) console.log(receipt);
                }
            }
        } 
    }

    function toggleNumToMint(index) {
        setNumToMint(numCanMint[index]);
    }

    function toggleNumCanMintClass(index) {
        if(numCanMint[index] === numToMint) {
            return "numCanMint selected";
        } else {
            return "numCanMint";
        }
    }

    function toggleMethod(index) {
        setMethod(listMethod[index]);
    }

    function toggleMethodClass(index) {
        if(listMethod[index] === method) {
            return "method_mint selected_method";
        } else {
            return "method_mint";
        }
    }

    return (
    <>
        <div className="wrap_mint">
            <div className="wrap_method">
                <span className={toggleMethodClass(0)} onClick={() => toggleMethod(0)}>FREE MINT</span>
                <span className="method_line">|</span>
                <span className={toggleMethodClass(1)} onClick={() => toggleMethod(1)}>PUBLIC MINT</span>
            </div>
            {/* Free Mint */}
            {(method == 0 && mintStatus !== 2) && (
                <>
                    <span className="mint_info">TOTALSUPPLY: {totalFreeMintSupply}/1522</span>
                    <span className="mint_info">MINTED: {freeMinted.toString().toLocaleUpperCase()}</span>
                    <span className="mint_info">AMOUNT: {freeMinted ? 0 : tokenAmount || 0}</span>
                    <button className="mint_btn" onClick={() => handleMint(1)}>
                        <div id="slide"></div>
                        <span>MINT</span>
                    </button>
                </>
            )}

            {/* Public Mint */}
            {method == 1 && mintStatus !== 2 && 
                mintStatus == 1
                    ? (<>
                        <div className="select_number">
                            {numCanMint.map((item, id) => 
                                userMinted + item > numCanMint.length
                                ? <button key={id} className="numCanMint"><strike>{item}</strike></button>
                                : <button key={id} className={toggleNumCanMintClass(id)} onClick={() => toggleNumToMint(id)}>{item}</button>
                            )}
                        </div>
                        <span className="mint_info">TOTALSUPPLY: {supplyMinted}/7777</span>
                        <span className="mint_info">MAX PER WALLET: {userMinted}/{maxPerWallet}</span>
                        <span className="mint_info">PRICE: {utils.formatEther(`${tokenPrice * numToMint}`)}ETH</span>
                        <button className="mint_btn" onClick={() => handleMint(2)}>
                            <div id="slide"></div>
                            <span>MINT</span>
                        </button>
                    </>)
                    : method == 1 && mintStatus !== 2 && <span className="mint_not_active">PUBLIC NOT YET</span>
            }

            {/* Pause Mint */}
            {mintStatus == 2 && (
                <>
                    {supplyMinted == 7777
                        ? <span className="mint_not_active">SOLDOUT</span>
                        : <span className="mint_not_active">MINT LIVE AT 7/7 3PM UTC</span>
                    }
                </>
            )}
            {mintError && <span className="msg_warning" onClick={() => setMintError("")}>{mintError}</span>}
        </div>
    </>)
}

function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
}

export default Mint;
