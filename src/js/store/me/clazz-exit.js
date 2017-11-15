'use strict';

import { observable, useStrict, action, computed } from "mobx";
import util from "../util";
import { httpGet, httpPost } from "../../service";
import uniqueToast from "../common/httpToast";

useStrict(true);

const baseUrl = `${util.baseUrl}api`;

class ClazzExit {
  @observable
  clazzList = [];

  @observable
  selectedClazzId = null;

  @observable
  exitReason = "";

  @observable
  isDialogshow = false;

  constructor() {
    this.dialogButtons = [
      {
        type: "default",
        label: "取消",
        onClick: this._hideDialog
      },
      {
        type: "primary",
        label: "确认",
        onClick: this._confirmClazzExit
      }
    ]
  }

  fetchProcessingClazzList = () => this._fetchClazzList()
    .then((clazzList) => {
      this._setClazzList(clazzList);

      if (clazzList.length > 0) {
        this.setSelectedClazzId(clazzList[0].id);
      }
    });

  @computed
  get isFormValid() {
    return this.selectedClazzId != null && this.exitReason != null && this.exitReason != "";
  }

  @action
  setSelectedClazzId = (clazzId) => this.selectedClazzId = clazzId;

  @action
  setExitReason = (exitReason) => this.exitReason = exitReason;

  @action
  showDialog = () => this.isDialogshow = true;

  @action
  _hideDialog = () => this.isDialogshow = false;


  _confirmClazzExit = () => {
    console.log(this.isFormValid);
    if (this.isFormValid !== true) {
      uniqueToast.showToast({ text: "请再次检查申请表单" });
    } else {
      this._createClazzExit({ clazzId: this.selectedClazzId, reason: this.exitReason })
        .then(() => {
          this._hideDialog();
          uniqueToast.showToast({ text: "申请成功，请耐心等待", icon: "success", cb: () => history.back() })
        });
    }
  };

  _fetchClazzList = () => httpGet(`${baseUrl}/clazzes?status=PROCESSING`);

  @action
  _setClazzList = (clazzList) => this.clazzList = [...clazzList];

  _createClazzExit = (clazzExit) => httpPost(`${baseUrl}/clazzExit`, clazzExit);
}

export default ClazzExit;
