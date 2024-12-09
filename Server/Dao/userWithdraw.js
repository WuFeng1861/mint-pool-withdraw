import db from "../models/index.js";

let userWithdraw = db.userWithdraw;
let userWithdrawDao = {};

// create a new userWithdraw
userWithdrawDao.create = (user_id, amount, address, t) => {
    return userWithdraw.create({user_id, amount, fee_type: 0, address}, {transaction: t});
};

// get all userWithdraws
userWithdrawDao.getAll = () => {
    return userWithdraw.findAll({raw: true});
};

// get all userWithdraw by user_id
userWithdrawDao.findById = (user_id) => {
    return userWithdraw.findAll({where: {user_id}, raw: true});
};

export default userWithdrawDao;

