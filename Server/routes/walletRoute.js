import express from "express";
import {
  getBalance, getMintTotal,
  getTransferRecord,
  getTransferRecordDetail,
  getTransferRecordTotal, playerMint, playerWithdraw, swapActiveCoin,
  transfer
} from "../controllers/wallet.js";
let router = express.Router();

router.post('/getBalance', getBalance);
router.post('/transfer', transfer);
router.post('/swapActiveCoin', swapActiveCoin);
router.post('/playerMint', playerMint);
router.post('/playerWithdraw', playerWithdraw);
router.post('/getMintTotal', getMintTotal);
router.post('/getTransferRecord', getTransferRecord);
router.post('/getTransferRecordTotal', getTransferRecordTotal);
router.post('/getTransferRecordDetail', getTransferRecordDetail);
export default router;


