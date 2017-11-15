/**
 * Created by violinsolo on 20/07/2017.
 */
'use strict';

import { observable, useStrict, action } from "mobx";

import util from "../util";
import WechatShare from "../common/wechatShare";
import { httpGet, httpPost } from "../../service";
import uniqueToast from "../common/httpToast";

useStrict(true);

const baseUrl = `${util.baseUrl}api`;

export default class TeacherDetail {
  @observable
  currentTabIndex = this.TAB_INDEX.BASIC_INFO;

  @observable
  isBadgeVisible = false;

  @observable
  teacherBasicInfo = {};

  @observable
  teacherMeatySharings = [];

  @observable
  teacherCommends = [];

  @observable
  teacherClazzOpen = [];
  @observable
  teacherClazzClose = [];

  constructor(teacherId) {
    this.teacherId = teacherId;
    this.toast = uniqueToast;

    this.TAB_INDEX = {
      BASIC_INFO: 'BASIC_INFO',
      MEATY_SHARE: 'MEATY_SHARE',
      COMMEDNS: 'COMMEDNS',
      COURSE: 'COURSE'
    }
  }

  @action
  setCurrentTab = (tabIndex) => {
    const currentTabIndex = util.get(this.TAB_INDEX, tabIndex, null);

    if (currentTabIndex != null) {
      this.currentTabIndex = tabIndex;
    }
  };

  @action
  setBadgeVisible = (visibility) => {
    this.isBadgeVisible = visibility === true;
  };

  // following are processing fetching teacher basic info
  fetchTeacherBasicInfo = () => httpGet(`${baseUrl}/clazzTeacher/${this.teacherId}`);

  @action
  setTeacherBasicInfo = (originalTeacherBasicInfo) => {
    this.teacherBasicInfo = originalTeacherBasicInfo;

    const { headImgUrl, name, id } = originalTeacherBasicInfo;

    this.wechatShare = new WechatShare(
      `Uband友班笃师${ name }`,
      `墙裂推荐笃师${ name }给你认识，来友班，和牛人做朋友`,
      `${ location.origin }/redirect?target=/teacher/${ id }`,
      headImgUrl
    );
  };


  // following are processing fetching teacher real stuff sharings list
  fetchTeacherMeatySharings = () => httpGet(`${baseUrl}/clazzTeacher/${this.teacherId}/meatySharings?pageSize=1000`);//TODO: Hard Code, 以后改成下拉刷新的

  @action
  setTeacherMeatySharings = (originalTeacherMeatySharings) => {
    this.teacherMeatySharings = originalTeacherMeatySharings.values;
  };


  // following are processing fetching teacher comments list
  fetchTeacherCommends = () => httpGet(`${baseUrl}/clazzTeacher/${this.teacherId}/commends?pageSize=1000`);//TODO: Hard Code, 以后改成下拉刷新的

  @action
  setTeacherCommends = (originalTeacherCommends) => {
    this.teacherCommends = originalTeacherCommends.values;
  };


  // following are processing fetching teacher clazzes list
  fetchTeacherClazzOpen = () => httpGet(`${baseUrl}/clazzTeacher/${this.teacherId}/clazzes?status=OPEN`);//TODO: Hard Code, 以后改成下拉刷新的

  @action
  setTeacherClazzOpen = (originalTeacherClazzOpen) => {
    this.teacherClazzOpen = originalTeacherClazzOpen;
  };

  fetchTeacherClazzClose = () => httpGet(`${baseUrl}/clazzTeacher/${this.teacherId}/clazzes?pageSize=1000`);//TODO: Hard Code, 以后改成下拉刷新的

  @action
  setTeacherClazzClose = (originalTeacherClazzCLose) => {
    this.teacherClazzClose = originalTeacherClazzCLose.values;//Close的是分页的数据，open不是
  };


  /**
   * fire when the user click the follow btn
   * @returns {Promise}
   */
  processFollowingTeacherAction = () => {
    return httpPost(`${baseUrl}/clazzTeacher/${this.teacherId}/follower`, {});
  }
}
