'use strict';

import { observable, useStrict, action, computed } from "mobx";
import util from "../util";
import { httpGet } from "../../service";

const baseUrl = `${util.baseUrl}api/account`;

useStrict(true);

class Coin {
  @observable
  coinInfo = {};      // 优币信息

  @observable
  withdrawList = [];  // 退款详情列表

  @observable
  panel = this.PANEL.COIN;

  constructor() {
    this.PANEL = {
      COIN: 'COIN',
      WITHDRAW: 'WITHDRAW'
    }
  }

  /**
   * 1. 获取优币详情
   * 2. 设置优币信息
   */
  fetchCoinInfo = () => this._fetchCoinInfo().then(this._setCoinInfo);

  /**
   * 1. 获取退款列表
   * 2. 设置退款列表
   */
  fetchWithdrawList = () => this._fetchWithdrawList().then(this._setWithdrawList);

  @action
  setCurrentPanel = (panel) => {
    const currentPanel = util.get(this.PANEL, panel, null);

    if (panel != null) {
      this.panel = currentPanel;
    }
  };

  @computed
  get currentPanel() {
    return this.panel
  };

  /*********************************************************************************************************************
   *                                       以下为内部方法，请勿直接调用
   *********************************************************************************************************************/

    // 获取优币详情
  _fetchCoinInfo = () => httpGet(`${baseUrl}/coins`);

  // 获取退款列表
  _fetchWithdrawList = () => httpGet(`${baseUrl}/withdraws`);

  // 设置优币信息
  @action
  _setWithdrawList = (withdrawList) => this.withdrawList = [...withdrawList];

  // 设置退款列表
  @action
  _setCoinInfo = (coinInfo) => this.coinInfo = { ...coinInfo };
}

export default new Coin();
