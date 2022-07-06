import { UnsupportedChainIdError } from "@web3-react/core";
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";

const getErrorMessage = (error) => {
    if (!error) {
        return "";
    } else if (error instanceof NoEthereumProviderError) {
        return "NOT_INSTALL";
    } else if (error instanceof UnsupportedChainIdError) {
        return "UNSUPPORT_NETWORK";
    } else if (
        error instanceof UserRejectedRequestErrorInjected
    ) {
        return "NOT_AUTHORIZE";
    } else {
        console.error(error);
        return "SOMETHING_WENT_WRONG";
    }
}

const truncateAddress = (address) => {
    if (!address) return "No Account";
    const match = address.match(
        /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/
    );
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
};

const toHex = (num) => {
    const val = Number(num);
    return "0x" + val.toString(16);
  };

export {
    getErrorMessage,
    truncateAddress,
    toHex
}