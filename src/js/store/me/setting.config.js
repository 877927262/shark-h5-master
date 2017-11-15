"use strict";

import { observable, useStrict, action } from "mobx";
import { httpPut } from "../../service"
import util from "../util";
import toptip from "../common/toptip";
import uniqueToast from "../common/httpToast";

useStrict(true);

const baseUrl = `${util.baseUrl}api/account`;

class SettingConfig {
  @observable value;

  constructor(type) {
    this.type = type;
    this.body = {};
  }

  @action
  handleChange = e => {
    this.value = e.target.value;
  };

  showWarnToptip = (message) => toptip.showToptip({ type: "warn", content: message });

  saveConfig = (value) => {
    this.body[this.type] = value;

    return httpPut(`${baseUrl}/privacy`, this.body)
      .then(() => {
        uniqueToast.showToast({ text: "操作成功", icon: "success", cb: () => history.back() });
      });
  };
}

export default SettingConfig;
