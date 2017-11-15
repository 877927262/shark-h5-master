"use strict";

import { observable, useStrict, action, computed } from "mobx";

import util from "../util";
import cutil from "../../common-util";
import { httpGet, httpPut } from "../../service";
import topTip from "../common/toptip";

useStrict(true);

const baseUrl = `${util.baseUrl}api`;

class User {
  @observable info = {};
  @observable birthday = "";

  constructor() {
  }

  @action
  setInfo = (data) => {
    this.info = data;
  };

  @action
  setBirthday = (date) => {
    const now = new Date();
    const custDate = new Date(date);

    this.birthday = custDate > now ? cutil.format(now, "yyyy-MM-dd") : date;

    return this.updateBirthday()
      .then(() => {
        topTip.showToptip({type: "primary", content: "修改生日成功！"})
      });
  };


  fetchInfo = (scb) =>
    httpGet(`${baseUrl}/account`)
      .then(scb);

  updateBirthday = () => httpPut(
    `${baseUrl}/account`,
    {
      birthday: this.birthday ? this.birthday : cutil.format(new Date(), "yyyy-MM-dd")
    }
  );

  @computed
  get cusBirthday() {
    return this.birthday;
  }
}

export default new User();
