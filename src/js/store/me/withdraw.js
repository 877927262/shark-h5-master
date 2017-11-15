'use strict';

import { observable, useStrict, action } from "mobx";
import { httpGet, httpPost } from "../../service";
import util from "../util";
import httpToast from "../common/httpToast";

useStrict(true);

const baseUrl = `${util.baseUrl}api`;
const MIN = 100;
const MAX = 500;

class WithDraw {
  @observable
  coinSum = 0;

  @observable
  wd = {
    coins: 0,
    username: "",
    payway: "wechat",
    remark: ""
  };

  @observable
  isWithdrawing = false;

  constructor() {
  }

  @action
  onChange = (v, type) => {
    this.wd[type] = v;
  };

  fetchCoinSum = () => this._fetchCoinSum().then(this._setCoinSum);

  withdrawCoin = () => {
    const { coins, username } = this.wd;

    if (!(coins && username)) {
      httpToast.showToast({text: "不能有未填项", icon: "warn"});
      return Promise.reject(new Error("不能有未填项"));
    }

    if (coins < MIN || coins > this.coinSum || coins > MAX) {
      httpToast.showToast({text: "优币数目错误", icon: "warn"});
      return Promise.reject(new Error("优币数目错误"));
    }

    this._setIsWaiting(true);
    httpToast.stickyToast({ text: "Loading...", icon: "loading" });
    return this._postWithdraw(this.wd)
      .then((data) => {
        httpToast.showToast({ text: "操作成功", icon: "success", cb: () => history.back() });

        this._setIsWaiting(false);

        return data;
      })
      .catch((error) => {
        this._setIsWaiting(false);
      });
  };

  /*********************************************************************************************************************
   *                                          以下为内部方法，请勿在外部调用
   *********************************************************************************************************************/

  _fetchCoinSum = () => httpGet(`${baseUrl}/account/coinSum`);

  _postWithdraw = (body) => httpPost(`${baseUrl}/account/withdraw`, body);

  @action
  _setCoinSum = coinSum => this.coinSum = coinSum;

  @action
  _setIsWaiting = isWithdrawing => this.isWithdrawing = isWithdrawing;
}

export default WithDraw;
