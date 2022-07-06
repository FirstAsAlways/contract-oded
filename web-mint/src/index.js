import React from "react";
import { createRoot } from "react-dom/client";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

function getLibrary(provider) {
    const library = new Web3Provider(provider);
    library.pollingInterval = 8000;
    return library;
}

const container = document.getElementById('web3');
const root = createRoot(container);

root.render(
    <Web3ReactProvider getLibrary={getLibrary}>
        <App />
    </Web3ReactProvider>
);

reportWebVitals();