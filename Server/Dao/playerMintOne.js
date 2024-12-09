import db from "../models/index.js";

let playerMintOne = db.playerMintOne;
let playerMintOneDao = {};

// 创建新数据
playerMintOneDao.create = async (user_id, type, bnb_amount, merc_amount, chain_hash, t) => {
    return playerMintOne.create({user_id, type, bnb_amount, merc_amount, chain_hash}, {transaction: t});
};

// 获取所有数据的bnb_amount之和
playerMintOneDao.getTotalBnbAmount = async () => {
    return playerMintOne.sum("bnb_amount");
};
export default playerMintOneDao;
