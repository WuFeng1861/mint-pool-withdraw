import {httpResult} from "../utils/utils.js";

/**
 * 异常处理函数
 */
export const exceptionHandle = (err, req, res, next) => {
  if(err.message.indexOf("请重新登录账号") >= 0 ) {
    res.json(httpResult(401, null,  err.message));
    return;
  }
  if(err.message.indexOf("socket hang up") >= 0 ) {
    res.json(httpResult(400, null,  "服务器繁忙"));
    return;
  }
  res.json(httpResult.error(err.message));
};
