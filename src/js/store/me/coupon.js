import {observable, useStrict, action} from "mobx";

useStrict(true);

import util from "../util";
const baseUrl = `${util.baseUrl}api/account`;

import {httpGet} from "../../service";

class Coupon {
  @observable info = [];

  setInfo = () => this.fetchInfo(action((data) => {
    this.info = data;
  }));

  fetchInfo = (scb) =>
    httpGet(`${baseUrl}/coupons`)
      .then(scb)
}

export default new Coupon();

