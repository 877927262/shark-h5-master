import {observable, useStrict, action} from "mobx";
import request from "superagent";

useStrict(true);

import util from "../util";

const baseUrl = `${util.baseUrl}api/wechat/auth`;

const SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
  PENDING = "PENDING";

class Auth {
  @observable state = PENDING;

  getWechatLogin = (host) => new Promise((resolve) => {
    request
      .get(`${baseUrl}?url=${host}`)
      .send()
      .end((err, res) => {
        if (res.body.code === 200) {
          resolve(res.body.data);
        }
      })
  });

  getToken = (code) => new Promise((resolve) => {
    request
      .post(baseUrl)
      .send({
        code: code
      })
      .end((err, res) => {
        if (res.body.code === 200) {
          resolve(res.header["x-auth-token"])
        }
      })
  });

  @action
  setAuthState = (state) => {
    this.state = state
  };

  setToken = (token) => {
    util.clearToken();

    localStorage.token = JSON.stringify({
      data: token,
      expire: new Date()
    });

    this.setAuthState(SUCCESS);
  };

  checkExpire(token) {
    const {expire} = JSON.parse(token);
    const duration = new Date().getTime() - new Date(expire).getTime();
    return duration >= 432000000 ; // 5 * 24* 3600 * 1000
  }
}

export default Auth;


