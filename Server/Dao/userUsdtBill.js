import db from "../models/index.js";
import {getNow} from "../utils/utils.js";
import sequelize from "../models/init.js";
import {Op} from "sequelize";

let userUsdtBill = db.userUsdtBill;
let userUsdtBillDao = {};

// 创建用户eth的记录
userUsdtBillDao.create = (user_id, amount, type, chain_hash, created_at, t) => {
  return userUsdtBill.create({
    user_id, amount, type, chain_hash, created_at
  }, {transaction: t});
};

// 查询用户eth的记录
userUsdtBillDao.findByUserId = (user_id, t) => {
  return userUsdtBill.findAll({
    where: {
      user_id
    },
    raw: true,
    order: [[sequelize.literal('created_at + 0'), 'DESC']],
    transaction: t
  });
};

// 获取这张表的条数
userUsdtBillDao.getCount = () => {
  return userUsdtBill.count();
};

// 翻页获取数据 根据id游标查询指定条数
userUsdtBillDao.findByPageWithId = (id, size, t) => {
  return userUsdtBill.findAll({
    where: {
      id: {
        [Op.gt]: id
      }
    },
    limit: size,
    order: [['id', 'ASC']],
    raw: true,
    transaction: t
  });
};

export default userUsdtBillDao;

