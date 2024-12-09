import {
  addBillForSwap_Sys,
  getUserData,
  getUserEth,
  getUserUsdt,
  queryCheckId,
  queryCheckPage,
  queryCheckTransferId
} from "./utils.js";
import {errorHandle, errorTip, getNow, httpResult, sha256} from "../utils/utils.js";
import SafeCalc from "../utils/bignumberjs.js";
import {useCoinPrice} from "../timerGlobalData/priceData.js";
import {
  getTransferRecords_ETH,
  getTransferRecords_Merc, getTransferRecords_USDT, getTransferRecordsCount_ETH,
  getTransferRecordsCount_Merc, getTransferRecordsCount_USDT,
  transfer_ETH,
  transfer_Merc, transfer_USDT
} from "./transfer.js";
import {useCheckPassword} from "../api/api_user/useUser.js";
import transferRecordDao from "../Dao/transferReocrd.js";
import sequelize from "../models/init.js";
import userDao from "../Dao/user.js";
import userEarningsDao from "../Dao/userEarnings.js";
import {earningTypes, tokenBillTypes} from "../types/index.js";
import userUsdtDao from "../Dao/userUsdt.js";
import userUsdtBillDao from "../Dao/userUsdtBill.js";
import userEthDao from "../Dao/userEth.js";
import playerMintOneDao from "../Dao/playerMintOne.js";
import userEthBillDao from "../Dao/userEthBill.js";
import {useBscscanGetTxStatus} from "../api/api_bscscan/useBscscan.js";
import userWithdrawDao from "../Dao/userWithdraw.js";

// 钱包获取所有的币种余额
export const getBalance = async (req, res) => {
  let {id} = req.body;
  queryCheckId(id);
  // 获取MERC的钱包数据
  let mercCoinData = await getMERCWalletData(id);
  // 获取BNB的钱包数据
  let bnbCoinData = await getBNBWalletData(id);
  // 获取USDT的钱包数据
  let usdtCoinData = await getUSDTWalletData(id);
  res.json(httpResult.success({
    result: true,
    coinList: [
      bnbCoinData,
      mercCoinData,
      usdtCoinData
    ]
  }));
};

// 转账
export const transfer = async (req, res) => {
  let {id, username, email, address, amount, coinName, password} = req.body;
  // 转账功能暂未开放
  // errorTip('转账功能暂未开放');
  const transferFuncObj = {
    MERC: transfer_Merc,
    BNB: transfer_ETH,
    // USDT: transfer_USDT
  };
  queryCheckId(id);
  // 判断转账币种是不是在transferFuncObj中
  if (!transferFuncObj[coinName]) {
    errorTip('该币暂时暂未开启转账');
  }
  // 判断转账者和发起请求是否是同一个人
  queryCheckTransferId(req, id);
  // 检查密码
  let userData = await useCheckPassword(id, password);
  if (!userData) {
    errorTip('密码错误');
  }
  // 调用转账方法
  await transferFuncObj[coinName](id, amount, username, email, address);
  res.json(httpResult.success({result: true}));
};

// 活动swap: todo 后续重写
export const swapActiveCoin = async (req, res) => {
  // todo: 后续重写
  const swapFun = async (id, fromCoin, toCoin, from_amount, to_amount) => {
    // 开启事务
    const t = await sequelize.transaction();
    try {
      // 1.根据id获取用户信息
      const user = await userDao.getUserLock(id, t);
      // 判断用户的可用余额是否足够
      if (SafeCalc.compare(user.balance, from_amount) === '-1') {
        errorTip('余额不足');
      }
      let createtime = getNow();
      // 2.减少用户MERC的余额
      const newBalanceFrom = SafeCalc.sub(user.balance, from_amount);
      await userDao.updateUserBalance(id, newBalanceFrom, t);
      // 判断用户的可用余额是不是大于余额，如果大于则将他等于余额
      if(SafeCalc.compare(user.unlock_balance || 0, newBalanceFrom) === '1') {
        await userDao.updateUserUnlockBalance(id, newBalanceFrom, t);
      }
      // 3.添加MERC的交易记录
      await userEarningsDao.add(id, earningTypes.SWAP_OUT, SafeCalc.mul(-1, from_amount), 0, createtime, t);
      // 4.添加用户USDT的余额
      // 4.1.获取用户USDT的余额
      let userToUsdt = await userUsdtDao.findLock(id, t);
      if (!userToUsdt) {
        // 创建接收人用户USDT数据
        await userUsdtDao.create(id, to_amount, t);
      } else {
        // 增加接收人的余额
        let newBalanceTo = SafeCalc.add(userToUsdt.amount, to_amount);
        await userUsdtDao.update(id, newBalanceTo, t);
      }
      // 5.添加USDT的交易记录
      await userUsdtBillDao.create(id, to_amount, tokenBillTypes.SWAP_IN, null, createtime, t);
      // 6.添加swap转账记录
      await addBillForSwap_Sys(id, fromCoin, toCoin, from_amount, to_amount, createtime, t);
      // 7.关闭事务
      await t.commit();
      return true;
    } catch (e) {
      // 回滚事务
      await t.rollback();
      errorHandle(e);
      return false;
    }

  };
  let {id, fromCoin, toCoin, from_amount} = req.body;
  if (fromCoin === toCoin) {
    errorTip('不能与原币种相同');
  }
  console.log(fromCoin, toCoin, from_amount);
  // 目前只支持MERC和USDT的兑换,且只能MERC兑换USDT
  if (fromCoin !== 'MERC' || toCoin !== 'USDT') {
    errorTip('暂不支持该兑换');
  }
  // 兑换比例 20:1
  let to_amount = SafeCalc.div(from_amount, 20);
  // 获取用户USDT的余额
  let userUsdt = (await getUserUsdt(id)).usdtBalance || 0;
  console.log(SafeCalc.add(to_amount, userUsdt), to_amount, userUsdt);
  // 比较用户余额和这次兑换的余额一共只能是10USDT
  if(SafeCalc.compare(10, SafeCalc.add(to_amount, userUsdt)) === '-1') {
    errorTip('限时福利兑换10U');
  }
  // 调用swap方法
  await swapFun(id, fromCoin, toCoin, from_amount, to_amount);
  res.json(httpResult.success({result: true}));
};

// 获取交易记录
export const getTransferRecord = async (req, res) => {
  let {id, coinName, startId, pageSize} = req.body;
  queryCheckId(id);
  if (!startId) {
    // todo 后续考虑这里优化 这个数值可能不是那么完美 目前使用的是mysql int的最大值+1

    startId = 2147483648;
  }
  if (!pageSize) {
    pageSize = 10;
  }
  const transferRecordFuncObj = {
    MERC: getTransferRecords_Merc,
    BNB: getTransferRecords_ETH,
    USDT: getTransferRecords_USDT
  };
  // 判断币种是不是在transferFuncObj中
  if (!transferRecordFuncObj[coinName]) {
    errorTip('参数错误');
  }
  // 调用转账方法
  let list = await transferRecordFuncObj[coinName](id, startId, pageSize);
  res.json(httpResult.success({result: true, list}));
};

// 获取交易记录总数
export const getTransferRecordTotal = async (req, res) => {
  let {id, coinName} = req.body;
  queryCheckId(id);
  const transferRecordCountFuncObj = {
    MERC: getTransferRecordsCount_Merc,
    BNB: getTransferRecordsCount_ETH,
    USDT: getTransferRecordsCount_USDT
  };
  // 判断币种是不是在transferFuncObj中
  if (!transferRecordCountFuncObj[coinName]) {
    errorTip('参数错误');
  }
  // 调用转账方法
  let total = await transferRecordCountFuncObj[coinName](id);
  res.json(httpResult.success({result: true, total}));
};

// 获取交易记录详情
export const getTransferRecordDetail = async (req, res) => {
  let {hash} = req.body;
  let record = await transferRecordDao.queryByHash(hash);
  if (!record) {
    errorTip('交易记录不存在');
  }
  res.json(httpResult.success({result: true, record}));
};

async function getMERCWalletData(id) {
  let userData = await getUserData(id);
  return {
    balance: userData.balance || 0,
    unitPrice: 0.001,
    name: "MERC",
    lockBalance: SafeCalc.sub(userData.balance || 0, userData.unlock_balance || 0),
    unlockBalance: userData.unlock_balance || 0
  };
}

async function getBNBWalletData(id) {
  let balance = (await getUserEth(id)).ethBalance || 0;
  let unitPrice = await useCoinPrice("BNB");
  return {
    balance,
    unitPrice,
    name: "BNB",
    lockBalance: 0
  };
}

async function getUSDTWalletData(id) {
  let balance = (await getUserUsdt(id)).usdtBalance || 0;
  console.log(`id:${id}   ----------   usdt balance:${balance}`);
  let unitPrice = await useCoinPrice("USDT");
  // console.log(unitPrice);
  return {
    balance,
    unitPrice: 1,
    name: "USDT",
    lockBalance: 0
  };
}

//----------------------------------mint--------------------
const useRemainEthMint = async (id, bnbAmount, address, t) => {
  // 余额足够 直接扣减
  let userEthData = await userEthDao.findLock(id, t);
  // 判断用户bnb的余额
  if(!userEthData || SafeCalc.compare(userEthData.amount, bnbAmount) === '-1') {
    // 不足直接报错
    errorTip('余额不足');
    return;
  }
  const createtime = getNow();
  // 扣减用户bnb的余额
  let newEthBalance = SafeCalc.sub(userEthData.amount, bnbAmount);
  await userEthDao.update(id, newEthBalance, t);
  // 添加mint记录
  await playerMintOneDao.create(id, 1, bnbAmount, SafeCalc.mul(bnbAmount, 600000), null, t);
  // 添加用户的Eth记录
  await userEthBillDao.create(id, SafeCalc.mul('-1', bnbAmount), tokenBillTypes.MINT_BNB_CONSUME, null, createtime, t);
  // 添加交易记录
  const hash = `${id}-${createtime}-${address}-${''}-${1}-${bnbAmount}-${''}-mint`;
  await transferRecordDao.create(sha256(hash), 'BNB', 1, address, '', Math.abs(Number(bnbAmount)), createtime, 0, `mint`, t);
  return true;
};
const useNewEthMint = async (id, bnbAmount, address, chain_hash, t) => {
  // 直接记录hash和交易数量
  await playerMintOneDao.create(id, 2, bnbAmount, SafeCalc.mul(bnbAmount, 600000), chain_hash, t);
};

let totalBnbMintCache = 0;
let totalInitTag = false;
const initTotalBnbMint = (total) => {
  let totalNew = SafeCalc.add(42, total);
  if(SafeCalc.compare(totalNew, 99.5) === '-1') {
    totalBnbMintCache = totalNew;
  } else {
    totalBnbMintCache = 99.5;
  }
  return totalBnbMintCache;
};
const updateTotalBnbMint = (total) => {
  totalBnbMintCache = total;
};
const addTotalBnbMint = async (addAmount) => {
  if (!totalInitTag) {
    let totalTrue = await playerMintOneDao.getTotalBnbAmount();
    initTotalBnbMint(totalTrue);
    totalInitTag = true;
  }
  let newTotal = SafeCalc.add(totalBnbMintCache, addAmount);
  updateTotalBnbMint(newTotal);
};
// getMintTotal
export const getMintTotal = async (req, res) => {
  if(!totalBnbMintCache) {
    let totalTrue = await playerMintOneDao.getTotalBnbAmount();
    initTotalBnbMint(totalTrue);
  }
  let total = totalBnbMintCache;
  res.json(httpResult.success({result: true, total}));
};
// mint
export const playerMint = async (req, res) => {
  let {id, type, bnbAmount, chain_hash, address} = req.body;
  // 判断转账者和发起请求是否是同一个人
  queryCheckTransferId(req, id);

  const t = await sequelize.transaction();
  try {
    if(type === 1) {
      await useRemainEthMint(id, bnbAmount, address, t);
    }else {
      await useNewEthMint(id, bnbAmount, address, chain_hash, t);
    }
    await t.commit();
    addTotalBnbMint(bnbAmount);
    res.json(httpResult.success({result: true}));
  } catch (error) {
    await t.rollback();
    console.log(error);
    errorTip('mint失败');
  }
};

//----------------------------------withdraw--------------------

export const playerWithdraw = async (req, res) => {
  let {id, amount} = req.body;
  const fee = 0.0002;
  // 判断转账者和发起请求是否是同一个人
  queryCheckTransferId(req, id);
  const t = await sequelize.transaction();
  const createtime = getNow();
  try {
    // 判断用户的bnb余额是否足够手续费
    let userEthData = await userEthDao.findLock(id, t);
    if (!userEthData || SafeCalc.compare(userEthData.amount, fee) === '-1') {
      errorTip('BNB手续费余额不足');
      return;
    }
    // 判断用户的MERC可用余额是否足够提现
    let userData = await userDao.getUserLock(id, t);
    if (!userData || SafeCalc.compare(userData.unlock_balance, amount) === '-1' || SafeCalc.compare(userData.balance, amount) === '-1') {
      errorTip('MERC余额不足');
      return;
    }
    const address = userData.address;
    // 扣除用户的bnb余额
    let newEthBalance = SafeCalc.sub(userEthData.amount, fee);
    await userEthDao.update(id, newEthBalance, t);
    // 添加用户的Eth记录
    await userEthBillDao.create(id, newEthBalance, tokenBillTypes.WITHDRAW_FEE, null, createtime, t);
    // 添加交易记录
    const hash = `${id}-${createtime}-${address}-${''}-${1}-${fee}-${''}-withdraw`;
    await transferRecordDao.create(sha256(hash), 'BNB', 1, address, '', Math.abs(Number(fee)), createtime, 0, `withdraw`, t);
    // 减少MERC的余额和可用余额
    let newBalance = SafeCalc.sub(userData.balance, amount);
    let newUnlockBalance = SafeCalc.sub(userData.unlock_balance, amount);
    await userDao.updateUserBalance(id, newBalance, t);
    await userDao.updateUserUnlockBalance(id, newUnlockBalance, t);
    // 添加交易记录
    const hash2 = `${id}-${createtime}-${address}-${''}-${2}-${amount}-${''}-withdraw`;
    await transferRecordDao.create(sha256(hash2), 'MERC', earningTypes.WITHDRAW, address, '', Math.abs(Number(amount)), createtime, 0, `withdraw`, t);
    // 添加收益记录
    await userEarningsDao.add(id, earningTypes.WITHDRAW, SafeCalc.mul(-1, amount), 0, createtime, t);
    // 添加提现记录
    await userWithdrawDao.create(id, amount, address, t);
    // 关闭事务
    await t.commit();
    res.json(httpResult.success({result: true}));
  } catch (error) {
    await t.rollback();
    console.log(error);
    errorTip('提现失败');
  }
};


