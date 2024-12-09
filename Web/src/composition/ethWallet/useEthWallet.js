import EthWallet from "@/utils/ethersHelper.js";
import {useMyBalanceRef} from "@/composition/mint/useMyBalance.js";
import {elTip, handleAddress} from "@/utils/index.js";

const mybalanceRef = useMyBalanceRef();
let etherWallet = new EthWallet();
export const connectWalletBeforeAuth = async () => {
    if(EthWallet.walletList.length !== 0 && etherWallet.userAddress?.toLowerCase() === mybalanceRef.value?.address?.toLowerCase()) {
        return;
    }
    const chainId = await window.ethereum.request({method: 'eth_chainId'});
    console.log('connectWallet', window.ethereum.chainId, chainId, `0x${EthWallet.BINANCE.chainId.toString(16)}`);
    if (chainId !== `0x${EthWallet.BINANCE.chainId.toString(16)}`) {
        return etherWallet.toSwitch(EthWallet.BINANCE.chainId, EthWallet.BINANCE);
    }
    let result = await etherWallet.initAnyChain();
    if(!result.status) {
        elTip(result.message, 'warning');
        return;
    }
    EthWallet.walletList = [etherWallet];
    if(etherWallet.userAddress.toLowerCase() !== mybalanceRef.value.address.toLowerCase()) {
        elTip('钱包地址错误，请切换 ' + handleAddress(mybalanceRef.value.address) + ' 钱包', 'error');
    }
    window.ethereum.once('accountsChanged', async () => {
        console.log('accountsChanged');
        await connectWalletBeforeAuth();
    })
}