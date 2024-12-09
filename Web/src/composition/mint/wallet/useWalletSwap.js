import {swapActiveCoin} from "@/api/mintPool/wallet.js";

export const useWalletSwapActive = async (fromCoin, toCoin, from_amount) => {
    let id = localStorage['id'];
    if (!id) {
        return;
    }
    await swapActiveCoin(id, fromCoin, toCoin, from_amount);
    return true;
}