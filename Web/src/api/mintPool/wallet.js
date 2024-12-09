import {createInstance} from "./createInstance.js";

const instance = createInstance('wallet');


// 转账
export const transferWithAddress = async (id, address, amount, coinName, password) => {
  return instance.post('/transfer', {id, address, amount, coinName, password}, {
    timeout: 10*1000,
    retry: 0
  });
}

// 获取钱包余额数据
export const getBalance = async (id) => {
  return instance.post('/getBalance', {id});
}

// 获取交易记录
export const getTransferRecord = async (id, coinName, startId, pageSize) => {
  return instance.post('/getTransferRecord', {id, coinName, startId, pageSize});
}

// 获取交易记录总量
export const getTransferRecordTotal = async (id, coinName) => {
  return instance.post('/getTransferRecordTotal', {id, coinName});
}

// 根据hash获取交易详情
export const getTransferRecordDetail = async (hash) => {
  return instance.post('/getTransferRecordDetail', {hash});
}

// swapActiveCoin
export const swapActiveCoin = async (id, fromCoin, toCoin, from_amount) => {
  return instance.post('/swapActiveCoin', {id, fromCoin, toCoin, from_amount});
}

// playerMint
export const playerMint = async (id, type, bnbAmount, chain_hash, address) => {
  return instance.post('/playerMint', {id, type, bnbAmount, chain_hash, address});
}

// getMintTotal
export const getMintTotal = async () => {
  return instance.post('/getMintTotal');
}

// playerWithdraw
export const playerWithdraw = async (id, amount) => {
  return instance.post('/playerWithdraw', {id, amount});
}


