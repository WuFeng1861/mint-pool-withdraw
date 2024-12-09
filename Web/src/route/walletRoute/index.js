export const walletRoute = {
  path: '/wallet',
  component: () => import('@/view/walletView/wallet.vue'),
  name: 'wallet',
  meta: {
    title: '钱包',
    type: 'all'
  },
  children: [
    {
      path: '/wallet/asset',
      component: () => import('@/view/walletView/asset.vue'),
      name: 'asset',
      meta: {
        title: 'Wallet Asset',
        arr: ['Wallet Asset'],
        type: 'all',
        keepAlive: true
      }
    },
    {
      path: '/wallet/record/:coinName',
      component: () => import('@/view/walletView/record.vue'),
      name: 'record',
      meta: {
        title: 'Wallet Record',
        arr: ['Wallet Record'],
        type: 'all',
        keepAlive: true
      }
    },
    {
      path: '/wallet/transfer/:coinName',
      component: () => import('@/view/walletView/transfer.vue'),
      name: 'transfer',
      meta: {
        title: 'Wallet Transfer',
        arr: ['Wallet Transfer'],
        type: 'all',
        keepAlive: true
      }
    },
    {
      path: '/wallet/record-detail/:hash',
      component: () => import('@/view/walletView/record-detail.vue'),
      name: 'record-detail',
      meta: {
        title: 'Wallet Record Detail',
        arr: ['Wallet Record Detail'],
        type: 'all',
        keepAlive: true
      }
    },
    {
      path: '/wallet/receive-code',
      component: () => import('@/view/walletView/receive-code.vue'),
      name: 'receive-code',
      meta: {
        title: 'Wallet Receive Code',
        arr: ['Wallet Receive Code'],
        type: 'all',
        keepAlive: true
      }
    },
    {
      path: '/wallet/wallet-swap',
      component: () => import('@/view/walletView/swap.vue'),
      name: 'wallet-swap',
      meta: {
        title: 'Swap',
        arr: ['Wallet Swap'],
        type: 'all',
        keepAlive: true
      }
    },
    {
      path: '/wallet/wallet-mint',
      component: () => import('@/view/walletView/mint.vue'),
      name: 'wallet-mint',
      meta: {
        title: 'Mint',
        arr: ['Wallet mint'],
        type: 'all',
        keepAlive: true
      }
    },
    {
      path: '/wallet/exchange-faucet',
      component: () => import('@/view/walletView/faucet.vue'),
      name: 'wallet-exchange-faucet',
      meta: {
        title: 'Exchange Faucet',
        arr: ['Exchange Faucet'],
        type: 'all',
        keepAlive: true
      }
    },
  ]
};

// 这个表示可以异步
export const walletRouterBeforeResolve = async (to, from, next) => {
  // 先判断路由是不是在钱包路由
  if (to.matched.some(record => record.name === 'wallet')) {
    next();
  }
}
