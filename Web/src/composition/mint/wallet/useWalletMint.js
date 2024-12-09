import {getMintTotal, playerMint} from "@/api/mintPool/wallet.js";
import {useMyBalanceRef} from "@/composition/mint/useMyBalance.js";

export async function useWalletMint(type, bnbAmount, chain_hash) {
    let id = localStorage['id'];
    if (!id) {
        return;
    }
    const mybalanceRef = useMyBalanceRef();
    if(!mybalanceRef.value.address) {
        return;
    }
    await playerMint(id, type, bnbAmount, chain_hash, mybalanceRef.value.address);
}

export async function useMintTotal() {
    let res = await getMintTotal();
    return res.total;
}