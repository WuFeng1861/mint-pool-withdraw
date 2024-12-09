import apiConfig from '../../config/api.js';
import axios from "axios";
import {elTip} from "../../utils/index.js";

let {EXCHANGE_URL, TIME_OUT} = apiConfig;

const instance = axios.create({
  baseURL: EXCHANGE_URL,
  timeout: TIME_OUT,
});

//拦截器 -- 请求拦截
instance.interceptors.request.use(config => {
  let token = localStorage["token"];
  let id = localStorage['id'];
  if(token && id)
  {
    config.headers = {
      "Authorization": `Bearer ${token} ${id}`,
      "Content-Type": "application/json"
    };
  }
  return config;
}, error => {
  console.log("request err");
  return Promise.reject(error);
});

//拦截器 -- 响应拦截
instance.interceptors.response.use(res => {
  if (res.data && res.data.code !== 200) {
    elTip(res.data.errMsg, 'error');
    throw new Error(res.data.errMsg);
  }
  return res.data.msg;
}, err => {
  return Promise.reject(err);
});
export default instance;
