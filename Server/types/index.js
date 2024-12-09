//   1: '日常收入',
//   2: '转账收入',
//   3: '游戏收入',
//   4: '邀请收入',
//   5: '刮一刮收入',
//   6: '兑换收入',
//   7: '兑换支出',
//   100: '转账支出',
//   102: '转账收入支出'
//   103: '兑换收入支出',
// 主币账单类型
export const earningTypes = {
  MINT: 1,
  TRANSFER_IN: 2,
  GAME: 3,
  INVITE: 4,
  SCRATCH: 5,
  SWAP_IN: 6,
  SWAP_OUT: 7,
  ACTIVE_REWARDING: 8,
  TRANSFER_OUT: 100,
  WITHDRAW: 101,
  TRANSFER_IN_OUT: 102,
  SWAP_IN_OUT: 103,
};

// 代币账单类型
export const tokenBillTypes = {
  // 充值
  RECHARGE: 0,
  // 邀请返利
  INVITATION_REBATE: 1,
  // 盲盒消费
  BLINDBOX_CONSUME: 2,
  // 转账收入
  TRANSFER_IN: 3,
  // SWAP 兑换收入
  SWAP_IN: 4,
  // SWAP 兑换支出
  SWAP_OUT: 5,
  // 转账支出
  TRANSFER_OUT: 100,
  // MINT 消费BNB
  MINT_BNB_CONSUME: 101,
  // 提币支出手续费
  WITHDRAW_FEE: 102,
  // 转账出入
  TRANSFER_IN_OUT: 103,
  // SWAP 兑换收入支出
  SWAP_IN_OUT: 104,
};

export const userContributeTypes = {
  // 挖矿加速
  miningSpeedUp: 1,
};

