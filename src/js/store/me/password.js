'use strict';

import { observable, useStrict, action, computed } from "mobx";
import Toast from "../common/toast";
import util from "../util";
import { httpGet, httpPost, httpPut } from "../../service";
import httpToast from "../common/httpToast";
import topTip from "../common/toptip";

useStrict(true);

const baseUrl = `${util.baseUrl}api/account`;

class Password {
  @observable
  oldPassword = "";
  @observable
  newPassword = "";
  @observable
  hasSetPassword = false;
  @observable
  showOldPassword = false;
  @observable
  showNewPassword = false;
  @observable
  isUpdating = false;

  constructor() {
    this.toast = new Toast();
  }

  fetchHasSetPassword = () => this._fetchHasSetPassword().then(this._setPasswordState);

  updatePassword = () => {
    this._setIsUpdating(true);

    httpToast.stickyToast({ text: "Loading...", icon: "loading" });
    const update = (this.hasSetPassword === true)
      ? httpPut(
        `${baseUrl}/password`,
        {
          password: this.newPassword,
          oldPassword: this.oldPassword
        }
      )
      : httpPost(`${baseUrl}/password`, {
        password: this.newPassword
      });

    return update.then((data) => {
        httpToast.hideToast();
        this._setIsUpdating(false);
        httpToast.showToast({ text: "操作成功", icon: "success", cb: () => history.back() });

        return data;
      })
      .catch((error) => {
        this._setIsUpdating(false);
      });
  };

  @action
  setOldPassword = oldPassword => this.oldPassword = oldPassword;

  @action
  setNewPassword = newPassword => this.newPassword = newPassword;

  @action
  toggleOldPassword = event => this.showOldPassword = !this.showOldPassword;

  @action
  toggleNewPassword = event => this.showNewPassword = !this.showNewPassword;

  showInvalidPasswordTip = () => topTip.showToptip({type: "warn", content: "请输入符合规范的密码！"});

  /**
   * check btn state
   * @returns {boolean} : return false if btn must block, true means btn can click!
   */
  @computed
  get isPasswordValid() {
    if (this.hasSetPassword === true) {
      //if is reset password page
      return this._validatePassword(this.newPassword) && this.oldPassword !== "";
    }

    //set new password page
    return this._validatePassword(this.newPassword);
  }

  /*********************************************************************************************************************
   *                                          以下为内部方法，请勿在外部调用
   *********************************************************************************************************************/

  /**
   * validate the psd,
   * @param psd : the password
   * @returns {boolean} : return true if it pass the validation
   */
  _validatePassword = (psd) => (8 <= psd.length && psd.length <= 20);

  _fetchHasSetPassword = () => httpGet(`${baseUrl}/password`);

  @action
  _setIsUpdating = (isUpdating) => this.isUpdating = isUpdating;

  @action
  _setPasswordState = data => this.hasSetPassword = data === true;
}

export default Password;
