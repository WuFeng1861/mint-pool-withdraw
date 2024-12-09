import db from "../models/index.js";

let userUsdt = db.userUsdt;
let userUsdtDao = {};

// 创建用户的usdt余额信息
userUsdtDao.create = async (id, amount, t) => {
  return userUsdt.create({
    id, amount
  }, {transaction: t});
};

// 更新用户的usdt余额信息
userUsdtDao.update = async (id, amount, t) => {
  return userUsdt.update(
    {amount},
    {where: {id}, transaction: t}
  );
};

// 查询用户的usdt余额信息
userUsdtDao.findLock = async (id, t) => {
  return userUsdt.findOne({
    where: {id},
    raw: true,
    transaction: t,
    lock: 'UPDATE'
  });
};

export default userUsdtDao;

