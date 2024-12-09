import {getWaterDrop, getWaterDropTime} from "@/api/exchange/api.js";
import {elTip} from "@/utils/index.js";
import {useMyBalanceRef} from "@/composition/mint/useMyBalance.js";

let myBalance = useMyBalanceRef();
// 获取水龙头的下次开放时间
export async function getNextOpenTime() {
    let id = localStorage.getItem("id");
    if(!id) {
        return;
    }
    let result = await getWaterDropTime(id);
    console.log(result, 'getNextOpenTime result');
    return Number(result.nextTime) || 0;
}

// 领取水龙头
export async function claimWaterDrop(address) {
    let id = localStorage.getItem("id");
    if(!id) {
        return false;
    }
    if(myBalance.value.address.toLowerCase() !== address.toLowerCase()) {
        elTip("请输入和当前账号绑定地址", 'warning');
        return false;
    }
    await getWaterDrop(id);
    return true;
}
