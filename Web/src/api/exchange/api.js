import instance from "./instance.js";

// 获取水龙头的下次获取时间
export const getWaterDropTime = (id) => {
  return instance.post("/asset/getWaterDropTime", {id});
};

// 领取水龙头奖励
export const getWaterDrop = (id) => {
    return instance.post("/asset/getWaterDrop", {id});
};