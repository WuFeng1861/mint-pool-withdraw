import schedule from "node-schedule";
import {EthersHelper} from "../utils/ethersHelper.js";
import {config} from "../config/index.js";
import sequelize from "../models/init.js";
import contractHeightDao from "../Dao/contractHeight.js";
import SafeCalc from "../utils/bignumberjs.js";
import chainLogDao from "../Dao/chainLog.js";
import userDao from "../Dao/user.js";
import userEthDao from "../Dao/userEth.js";
import {ethers} from "ethers";
import userEthBillDao from "../Dao/userEthBill.js";
import {tokenBillTypes} from "../types/index.js";
import {getNow} from "../utils/utils.js";
import {addBillForETH_Sys} from "../controllers/utils.js";

const ethersHelper = new EthersHelper(config.PROVIDER_URL, EthersHelper.BinanceUrl);
// 获取用户的充值
export const timer_getTrans = async () => {
  console.log('start');
  let lastHeightNow = 0;
  // 启动一个定时任务 10秒钟执行一次 立即执行
  const job = schedule.scheduleJob(`*/${config.TIMER_INTERVAL_TRAN} * * * * *`, async function () {
    console.log("定时任务执行了" + new Date().toLocaleTimeString(), lastHeightNow);
    let t = null;
    try {
      t = await sequelize.transaction();
      // 从mysql中获取之前的高度，然后+1
      let lastHeight = Number((await contractHeightDao.findLock(t))?.height);
      console.log(lastHeight, 'lastHeight');
      if (!lastHeight || lastHeight < config.CHAIN_START_BLOCK) {
        console.log(lastHeight, config.CHAIN_START_BLOCK, 'toNewStart');
        lastHeight = config.CHAIN_START_BLOCK;
      }
      if(lastHeight < lastHeightNow ) {
        lastHeight = lastHeightNow;
      }
      // 获取当前区块的高度
      const currentHeight = ethersHelper.latestBlock;
      console.log(currentHeight, 'currentHeight');
      // 获取下100高度或者到最新高度的所有交易
      let newTranHashList = [];
      // 如果当前高度和上一次的高度差大于100，则获取下100高度的交易，否则获取当前高度和上一次高度之间的所有交易
      let thisGetHeight = 100;
      if (currentHeight <= lastHeight) {
        console.log(lastHeight, currentHeight, 'bsc链没有新高度');
        await t.commit();
        return;
      }
      if (currentHeight <= lastHeight + 100) {
        thisGetHeight = currentHeight - lastHeight;
      }
      console.log(lastHeight + thisGetHeight);
      newTranHashList = await getNextBlockTrans(lastHeight, thisGetHeight);
      // 然后判断这些交易是否是已经记录的和完成的 1.查询mysql数据库是否有这笔交易，有就跳过 2.完成的增加用户eth余额且写入mysql数据库中 3.未完成的不处理
      // 查询这些交易mysql中是否已经有了
      const tranHashList = await filterExistTrans(newTranHashList);
      console.info('newTranHashList', newTranHashList);
      // 判断这些交易是否完成 获取完成了的交易
      const finishedTranList = await filterFinishTrans(tranHashList);
      console.log('finishedTranList', finishedTranList);
      // 更新用户的余额 和 更新用户的账单
      await updateUserData(finishedTranList, t);
      // 给邀请者一个点的返点
      await giveInviterRebate(finishedTranList, t);
      // 将这个记录写入mysql
      await writeToMysql(finishedTranList, t);
      // 更新高度
      await contractHeightDao.update(lastHeight + thisGetHeight, t);
      await t.commit();
      lastHeightNow = lastHeight + thisGetHeight;
    } catch (e) {
      console.log(e.message);
      if (t) {
        await t.rollback();
      }
      process.exit(999); // 这个表示错误退出，pm2会重新启动程序
    }
  });
};

// 获取下100个区块的合约的交易
const getNextBlockTrans = async (startBlockHeight, getHeight = 100) => {
  // console.log(startBlockHeight, SafeCalc.add(startBlockHeight, getHeight))
  let hashList = await ethersHelper.getContractTransactions(config.CONTRACT_ADDRESS, startBlockHeight, SafeCalc.add(startBlockHeight, getHeight));
  // console.log(hashList.length)
  return hashList;
};

// 判断这些交易是否在mysql中已经存在 已存在的剔除
const filterExistTrans = async (hashList) => {
  let res = [];
  for (let i = 0; i < hashList.length; i++) {
    let hash = hashList[i];
    let isExist = await chainLogDao.getByHash(hash);
    if (!isExist) {
      res.push(hash);
    }
  }
  return res;
};

// 判断这些交易是否完成 未完成的不要
const filterFinishTrans = async (hashList) => {
  let res = [];
  for (let i = 0; i < hashList.length; i++) {
    let hash = hashList[i];
    let isFinish = await ethersHelper.confirmTransaction(hash);
    if (!isFinish) {
      continue;
    }
    // 获取交易的信息
    let transInfo = await ethersHelper.getTransaction(hash);
    console.log('交易信息：', transInfo);
    if (transInfo.to === config.CONTRACT_ADDRESS && transInfo.value > 0) {
      res.push(transInfo);
    }
  }
  return res;
};

// 更新用户余额和记录用户账单
const updateUserData = async (finishedTranList, t) => {
  for (let i = 0; i < finishedTranList.length; i++) {
    let transInfo = finishedTranList[i];
    // 获取交易的用户
    let user = await userDao.getUserByAddress(transInfo.from);
    if (!user) {
      // 该地址暂时没有用户绑定
      continue;
    }
    // 获取交易的用户余额
    let user_eth = await userEthDao.findLock(user.id, t);
    let rechargeQuantity = ethers.formatEther(transInfo.value);
    if (!user_eth) {
      // 创建用户数据插入
      await userEthDao.create(user.id, rechargeQuantity, t);
    } else {
      // 更新用户余额
      let new_eth = SafeCalc.add(rechargeQuantity, user_eth.amount);
      await userEthDao.update(user.id, new_eth, t);
    }
    // 记录用户的账单
    let createtime = getNow();
    await userEthBillDao.create(user.id, rechargeQuantity, tokenBillTypes.RECHARGE, transInfo.hash, createtime, t);
    // 添加钱包交易记录
    await addBillForETH_Sys(user.id, createtime, tokenBillTypes.RECHARGE, rechargeQuantity, transInfo.hash, t);
  }
};

// 给邀请者一个点的返利
const giveInviterRebate = async (finishedTranList, t) => {
  for (let i = 0; i < finishedTranList.length; i++) {
    let transInfo = finishedTranList[i];
    // 获取交易的用户
    let user = await userDao.getUserByAddress(transInfo.from);
    if (!user) {
      // 该地址暂时没有用户绑定
      continue;
    }
    if (Number(user.inviter_id) === 0) {
      // 如果用户的邀请者id为0 就不用返利
      continue;
    }
    // 获取交易的邀请者用户余额
    let user_eth = await userEthDao.findLock(user.inviter_id, t);
    // 返利一个点
    let rechargeQuantity = SafeCalc.mul(ethers.formatEther(transInfo.value), 0.01);
    if (!user_eth) {
      // 创建用户数据插入
      await userEthDao.create(user.inviter_id, rechargeQuantity, t);
    } else {
      // 更新用户余额
      let new_eth = SafeCalc.add(rechargeQuantity, user_eth.amount);
      await userEthDao.update(user.inviter_id, new_eth, t);
    }
    // 记录用户的账单
    let createtime = getNow();
    await userEthBillDao.create(user.inviter_id, rechargeQuantity, tokenBillTypes.INVITATION_REBATE, transInfo.hash, createtime, t);
    // 添加钱包交易记录
    await addBillForETH_Sys(user.inviter_id, createtime, tokenBillTypes.INVITATION_REBATE, rechargeQuantity, transInfo.hash, t);
  }
};

// 将记录写入到mysql
const writeToMysql = async (finishedTranList, t) => {
  for (let i = 0; i < finishedTranList.length; i++) {
    let transInfo = finishedTranList[i];
    let rechargeQuantity = ethers.formatEther(transInfo.value);
    let user = await userDao.getUserByAddress(transInfo.from);
    if (!user) {
      // 该地址暂时没有用户绑定 直接记录null
      await chainLogDao.create(null, transInfo.hash, rechargeQuantity, 1, transInfo.from, transInfo.blockNumber, t);
      setTimeout(() => {
        trans_bug_fix_recharge();
      }, 20*1000);
      continue;
    }
    await chainLogDao.create(user.id, transInfo.hash, rechargeQuantity, 1, transInfo.from, transInfo.blockNumber, t);
  }
};

// 判断这些交易是否在mysql中已经存在 不存在的丢弃
const filterExistTransForBugFix = async (hashList) => {
  let res = [];
  for (let i = 0; i < hashList.length; i++) {
    let hash = hashList[i];
    let isExist = await chainLogDao.getByHash(hash);
    // 判断user_eth_bill是否有这个hash
    let countInUserEthBill = await userEthBillDao.getCountByHash(hash);
    if (countInUserEthBill !== 0) {
      console.info('该交易已处理，跳过');
      continue;
    }
    if (isExist && isExist.address === '0x0000000000000000000000000000000000000000') {
      res.push(hash);
    } else {
      console.info('该交易未存在或者其他问题，打印日志');
      console.log(isExist);
    }
  }
  return res;
};

let is_in_trans_bug_fix = false;
// 给出bug的充值交易重新补
export const trans_bug_fix_recharge = async () => {
  if (is_in_trans_bug_fix) {
    setTimeout(() => {
      trans_bug_fix_recharge();
    }, 20*1000);
    return;
  }
  const t = await sequelize.transaction();
  try {
    is_in_trans_bug_fix = true;
    const findNullAddressChainLogs = await chainLogDao.getByNullAddressList(t);
    let hashList = findNullAddressChainLogs.map(item => item.hash);
    // 先查询mysql中是否有这笔交易
    const existHashList = await filterExistTransForBugFix(hashList);
    console.log('existHashList', existHashList);
    // 判断这些交易是否完成 未完成的不要
    const finishedTranList = await filterFinishTrans(existHashList);
    console.log('finishedTranList', finishedTranList);
    // 更新用户的余额 和 更新用户的账单
    await updateUserData(finishedTranList, t);
    // 给邀请者一个点的返点
    await giveInviterRebate(finishedTranList, t);
    // 将这个记录写入mysql
    await writeToMysql(finishedTranList, t);
    await t.commit();
    console.info('bug修复完成');
  } catch (e) {
    console.log(e.message);
    if (t) {
      await t.rollback();
    }
  } finally {
    is_in_trans_bug_fix = false;
  }
};

