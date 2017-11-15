'use strict';
import { observable, useStrict, action } from "mobx";

import util from "../util";
import { httpGet } from "../../service";

useStrict(true);

const baseUrl = `${util.baseUrl}api`;

class SystemConfig {
  @observable
  appInfo = null;

  constructor() {

  }

  fetchAppInfo = (platform) => {
    if (sessionStorage.APP_INFO == null) {
      return this._fetchAppInfo(platform)
        .then((appInfo) => {
          if (appInfo.url != null) {
            sessionStorage.APP_INFO = true;
            this._setAppInfo(appInfo);

            window.setTimeout(() => this._setAppInfo(null), 5000);
          }
        });
    }

    return Promise.resolve({});
  };

  /*********************************************************************************************************************
   *                                          私有方法
   *********************************************************************************************************************/

  _fetchAppInfo = (platform) => httpGet(`${ baseUrl }/app?platform=${ platform }`);

  @action
  _setAppInfo = (appInfo) => this.appInfo = appInfo;
}

export default SystemConfig;
