<template>
  <div class="homeContainer">
    <left-nav class="pcOnly"/>
    <div class="rightView">
      <right-header/>
      <vant-notice-bar :textlist="noticelist"/>
      <router-view></router-view>
      <right-nav-header class="mobileOnly"/>
    </div>
    <my-dialog
        v-model:visible="closeDialogVisible"
        title="确认关闭"
        :width="320"
    >
      <span style="color: #ffffff">确认退出账号吗？</span>
      <div style="margin-top: 10px;display: flex;justify-content: flex-end;">
        <el-button class="copyLink2" @click="hideCloseDialog" style="margin-right: 10px">取消</el-button>
        <el-button class="copyLink" @click="closeDialogConfirm">
          确定
        </el-button>
      </div>
    </my-dialog>
  </div>
</template>

<script setup>
import {useExit} from "@/composition/useUser.js";
import bus from "@/bus/mitt.js";
import MyDialog from "@/components/myDialog.vue";
import RightHeader from "@/components/rightHeader.vue";
import RightNavHeader from "@/components/rightNavHeader.vue";
import VantNoticeBar from "@/components/vant/vant-notice-bar.vue";
import { showDialog } from 'vant';

const noticelist = [
  {
    text: "生态支付与MERC交易所（测试版）",
    click: () => {
      showDialog({ title: '生态支付与MERC交易所（测试版）', message: `
      MERC交易所（测试版）已经开启了测试上线，这是一个令人兴奋的消息。参与测试的用户可以通过参与水龙头活动获得测试代币，这些测试代币可以用于在交易所进行测试交易。
参与测试的步骤
  1.访问MERC交易所（测试版）：首先，您需要访问MERC交易所的测试版平台，点击生态支付，Merc交易所。
  2.参与水龙头活动：在平台上，您可以在钱包内找到参与水龙头活动的入口，需要您点击申领。
  3.获得测试代币：完成申领，您将获得一定数量的测试代币。
  4.进行测试交易：使用这些测试代币，您可以在MERC交易所（测试版）上进行各种交易操作，以测试平台的功能和性能。
测试代币的用途
测试代币是专门为了在测试环境中模拟真实交易而设计的。它们没有实际的货币价值，不能在正式的交易所或市场上进行交易。测试代币的主要目的是帮助开发人员和用户在模拟环境中测试交易所的功能，发现潜在的问题，并提供反馈以改进平台。
注意事项
在参与MERC交易所（测试版）的测试时，请注意以下几点：
  1.测试代币仅用于测试目的，不具有任何实际价值。
  2.测试环境可能存在不稳定或未完善的情况，因此在交易时应谨慎操作。
  3.提供反馈对于改进平台至关重要，因此如果您遇到任何问题或有建议，请及时向MERC交易所的开发团队反馈。
通过参与MERC交易所（测试版）的测试，您不仅可以帮助改进平台，还可以提前体验新的交易功能和特性。
      ` });
    }
  },
  {
    text: "Mint节点网络上线",
    click: () => {
      showDialog({ title: 'Mint节点网络上线', message: '通过Mint能够快速获取MERC这种可流通性代币。Mint的方式是，每次点击花费 0.01BNB 获得一个区块每张6000枚token。Mint总共的创世区块有10000张，先到先得，这些都会铸造在MERC节点生态链上。\n\n' +
            '我们致力于建立一个Merc 水星Web3生态平台，用于聚合可互换的数字平台，如计算、存储和Dapp。其次，我们使生态系统能够充分发挥其移动基础设施的潜力，并通过共享资源获得回报。最后，我们的终极愿景是成为为一条有价值的性能链，为节点网络贡献者和消费者提供 全网服务的一站式生态。' });
    }
  },
  {
    text: "官方限时福利兑换活动",
    click: () => {
      showDialog({ title: '官方限时福利兑换活动', message: '在Swap板块：Merc网络生态板块之一MERC/USDT交易对,目前处于福利空投阶段，大家可以通过挖掘MERC来兑换USDT福利。在第一阶段的Apla1中，每个月能够兑换一次，福利先到先得' });
    }
  },
  {
    text: "领取您的＄MERC空投",
    click: () => {
      showDialog({ title: '领取您的＄MERC空投', message: `$MERC空投即将开始，您需要填写BSC链钱包地址以参与空投活动。
1: 授权币安链BSC钱包地址
2: 在2024.12.06 00:00（UTC+0）到 2024.12.30 00:00（UTC+0）期间，使用上述钱包地址访问提币页面
3: MERC合约：0xE2CF16eDd5b705DD89DAde70CdF42189fb8A353C

规则
1、绑定BSC钱包地址是免费的
2、收钱提币支付Gas费用，您可以在 2024.12.30 00:00（UTC+0）之前绑授权提币”
3、通过BSC钱包地址并不保证空投，请遵循提币页面的指南
4、确保您可以使用绑定的地址登录空投页面，建议在Web3钱包区块链浏览器上使用
5、每个钱包地址只能用于一个提币绑定。` });
    }
  },
  {
    text: "测试第一阶段水龙头奖励已经发放 ",
    click: () => {
    }
  },
];

const closeDialogVisible = ref(false);
const showCloseDialog = () => {
  closeDialogVisible.value = true;
}
const hideCloseDialog = () => {
  closeDialogVisible.value = false;
}
const closeDialogConfirm = () => {
  useExit();
}
bus.$on('showCloseDialog', showCloseDialog);

</script>

<style lang="scss">
.van-dialog__message--has-title {
  padding-top: var(--van-dialog-has-title-message-padding-top);
  color: var(--van-dialog-has-title-message-text-color);
  text-align: left;
  word-break: break-all;
}
.homeContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  background-color: var(--color-dashboard-bg-main);
  color: var(--color-dashboard-white);

  .rightView {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .notice-swipe {
    height: 40px;
    line-height: 40px;
  }
}

@media screen and (max-width: 768px) {
  .homeContainer {
    .rightView {
      width: 65%;
    }
  }
}
</style>
