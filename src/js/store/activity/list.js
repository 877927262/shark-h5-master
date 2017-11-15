'use strict';

import { observable, useStrict, action } from "mobx";

import util from "../util";
const baseUrl = `${util.baseUrl}api`;
import { httpGet } from "../../service";

useStrict(true);

export default class ActivityList {
  @observable
  activityList = []; // 推广活动列表

  /**
   * action 更新推广活动列表
   * @param activityList
   */
  @action
  setActivities = (activityList) => this.activityList = activityList;

  fetchList = () => httpGet(`${baseUrl}/activities`);
}
