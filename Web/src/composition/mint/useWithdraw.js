import {playerWithdraw} from "@/api/mintPool/wallet.js";

export const useWithdraw = async (amount) => {
    let id = localStorage.getItem("id");
    if (!id) {
        return false;
    }
    await playerWithdraw(id, amount);
    return true;
};