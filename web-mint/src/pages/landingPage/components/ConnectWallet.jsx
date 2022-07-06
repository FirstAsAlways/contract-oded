import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';

import { getErrorMessage, toHex, truncateAddress } from '../../../web3/functions';
import { useEagerConnect, useInactiveListener } from "../../../web3/hooks";
import { injected } from '../../../web3/connectors';

function ConnectWallet() {
    const context = useWeb3React();
    const {
        active: networkActive,
        activate: activateNetwork,
        error: networkError,
        connector,
        account
    } = context;

    // handle logic to recognize the connector currently being activated
    const [activatingConnector, setActivatingConnector] = useState();
    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }

    }, [activatingConnector, connector]);

    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const triedEager = useEagerConnect();

    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager || !!activatingConnector);

    const switchNetwork = async () => {
        const { ethereum } = window;
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: toHex(4) }]
        });
    };

    return (
        <>
            {!networkActive
                ? (getErrorMessage(networkError) == ("NOT_INSTALL"||"UNSUPPORT_NETWORK")
                    ? (
                        getErrorMessage(networkError) == "NOT_INSTALL" && <span className="connect_btn" onClick={() => window.open("https://metamask.io/", "_blank")}>Install Metamask</span> ||
                        getErrorMessage(networkError) == "UNSUPPORT_NETWORK" && <span className="connect_btn" onClick={() => switchNetwork()}>Switch Network</span>
                    ) : (
                        <span className="connect_btn" onClick={() => {
                            activateNetwork(injected);
                        }}>Connect Wallet</span>
                    )
                ) : (
                    <span className="connect_btn">{truncateAddress(account)}</span>
                )
            }
        </>
    )
}

export default ConnectWallet