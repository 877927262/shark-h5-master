"use strict";
/**
 * 为活动morning call开发的界面逻辑
 *
 * Created by Liam on 2017/5/19.
 */
import { observable, useStrict, action } from "mobx";
import { browserHistory } from 'react-router';
import util from "../util";
import { httpGet, httpPost, httpDel } from "../../service";
import Dialog from "../common/dialog";
import uniqueToast from "../common/httpToast";

useStrict(true);


const baseUrl = `${util.baseUrl}api`;
const defaultHeadIcon = 'http://qiniuprivate.gambition.cn/SwBrgT_mc-default-head.png';

class MorningCall {
  @observable
  tempClazzId;

  @observable
  userStatus = {
    joinStatus: '',
    showDialog: false,
    statistics: {}
  };

  @observable
  userRoomInfo = {
    status: 'NOT_FOUND',
    statusDesc: '任务还未开始',
    userInfo: {
      headImgUrl: defaultHeadIcon
    },
    partnerInfo: {
      headImgUrl: defaultHeadIcon
    }
  };

  //用户申请
  @observable
  userApply = {
    userGender: '2',
    targetGender: '1',
    selfDesc: ''
  };

  constructor() {
    this.toast = uniqueToast;
    this.dialog = new Dialog();
  }

  @action
  updateUserStatusButton = (target) => {
    if (target) {
      this.userStatus.joinStatus = target.status;
      this.userStatus.statistics = target.statistics;
    }
  };

  translateStatus = () => {
    const st = {
      'NOT_FOUND': '任务还未开始',
      'OPEN': '#U树洞开启状态#',
      'CLOSED': '#U树洞关闭状态#'
    };
    this.userRoomInfo.statusDesc = st[this.userRoomInfo.status];
  };

  @action
  updateUserRoomInfo = (target) => {
    this.userRoomInfo = target;
    if (!this.userRoomInfo.partnerInfo.headImgUrl) {
      this.userRoomInfo.partnerInfo.headImgUrl = defaultHeadIcon;
    }
    this.translateStatus();
  };
  @action
  userRoomException = () => {
    this.userRoomInfo.status = 'NOT_FOUND';
    this.translateStatus();
  };


  @action
  updateUserApplyByKey = (target, value) => {
    this.userApply[target] = value;
  };

  updateUserGender = (event) => {
    this.updateUserApplyByKey('userGender', event.target.value)
  };

  updateUserTargetGender = (event) => {
    this.updateUserApplyByKey('targetGender', event.target.value)
  };

  updateUserselfDesc = (event) => {
    this.updateUserApplyByKey('selfDesc', event.target.value);
  };


  /**
   * 获取用户当前参加活动的状态
   */
  fetchUserStatus = () => {
    return httpGet(`${baseUrl}/activity/` + this.tempClazzId + '/account')
      .then(this.updateUserStatusButton);
  };

  /**
   * 获取用户当前房间的信息
   */
  fetchUserRoomInfo = () => {
    httpGet(`${baseUrl}/activity/` + this.tempClazzId + '/room')
      .then(this.updateUserRoomInfo)
      .catch(this.userRoomException);
  };

  submitApplyEventHandler = () => {
    // 参数检查
    for (let key in this.userApply) {
      if (!this.userApply[key]) {
        uniqueToast.showToast({ text: '好像信息不全哦', icon: "warn" });
        return;
      }
    }

    uniqueToast.stickyToast({ text: "提交中...", icon: "loading" });

    const submitMessage = {};
    submitMessage['gender'] = this.userApply.userGender;
    submitMessage['partnerInfo'] = { 'gender': this.userApply.targetGender };
    submitMessage['introduction'] = this.userApply.selfDesc;

    // 提交表单
    httpPost(`${baseUrl}/activity/` + this.tempClazzId + '/account', submitMessage)
      .then(() => {
        uniqueToast.showToast({ text: "提交成功", icon: "success", cb: () => browserHistory.replace('/game/mc/share') });
      })
      .catch((error) => {
        uniqueToast.showToast({ text: "我好像被玩坏了，请稍后再试！", icon: "warn" });
      });
  };

  /**
   * 终止U树洞
   */
  quitUserRoom = () => {
    this.dialog.dismissDialog();
    httpDel(`${ baseUrl }/activity/${ this.tempClazzId }/room`)
      .then(() => {
        uniqueToast.showToast({ text: "成功终止", icon: "success", cb: () => browserHistory.replace('/game/mc/index') });
      });
  };

  fetchActivityId = () => {
    httpGet(`${baseUrl}/activity?type=MORNING_CALL`)
      .then(action((activityInfo) => this.tempClazzId = activityInfo.id));
  };
}

export default new MorningCall();
