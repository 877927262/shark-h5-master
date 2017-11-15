'use strict';

import { observable, useStrict, action, computed } from "mobx";
import WechatShare from "../common/wechatShare";
import util from "../util";
import { httpGet, httpPost } from "../../service";
import Modal from "../common/modal";

useStrict(true);

const baseUrl = `${util.baseUrl}api`;

export default class ActivityEnroll {
  @observable
  modal = new Modal("Uband线上活动", "关闭");

  @observable
    // 推广活动详情
  activityItem = {
    joined: false,
    banner: null,
    introduction: {
      introduction: null,
      requirements: null,
      questionAnswered: null
    }
  };

  @observable
  currentPanel = this.PANEL.introduction;

  constructor(activityId) {
    this.activityId = activityId;

    this.PANEL = {
      introduction: 'introduction',
      requirements: 'requirements',
      questionAnswered: 'questionAnswered',
      messageBook: 'messageBook'
    };
  }


  @action
  setActivityDetail = (activityItem) => {
    this.activityItem = activityItem;

    this.activityItem.joined = util.get(activityItem, 'joined', false);
    const banner = util.get(activityItem, 'banner', null);

    this.activityItem.banner = banner;

    this.activityItem.introduction.introduction = util.get(activityItem, 'introduction.introduction', null);
    this.activityItem.introduction.requirements = util.get(activityItem, 'introduction.requirements', null);
    this.activityItem.introduction.questionAnswered = util.get(activityItem, 'introduction.questionAnswered', null);

    const activityName = util.get(activityItem, 'name', 'Uband线上活动'),
      activityDescription = util.get(activityItem, 'description', '快来一起参与吧');

    this.wechatShare = new WechatShare(
      activityName,
      activityDescription,
      `${ location.origin }/redirect?target=/activity/${ this.activityId }`,
      banner
    );
  };

  @action
  setCurrentPanel = (panel) => {
    const currentPanel = util.get(this.PANEL, panel, null);

    if (currentPanel) {
      this.currentPanel = currentPanel;
    }
  };

  @computed
  get currentDetailPanel() {
    return this.currentPanel;
  }

  fetchActivityDetail = () => httpGet(`${baseUrl}/activity/${ this.activityId }`);

  enrollActivity = () => httpPost(`${baseUrl}/activity/${ this.activityId }/user`);
}
