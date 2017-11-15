'use strict';
/**
 * Created by violinsolo on 07/07/2017.
 */
import { observable, useStrict, action } from "mobx";

import util from "../util";
import WechatShare from "../common/wechatShare";
import { httpGet, httpPost } from "../../service";
import Modal from "../common/modal";

useStrict(true);

const baseUrl = `${util.baseUrl}api`;

export default class ActivityDetail {
  @observable
  modal = new Modal("关注回复'活动'二字参与", "关闭");

  @observable
  activityInfo = {
    name: null,
    banner: null,
    isSelf: false,
    isFavour: false,
    progressRate: 0,
    neededFavor: 0
  };

  @observable
  userInfo = {
    name: null,
    headImgUrl: null
  };

  constructor(activityId, userId) {
    this.activityId = activityId;
    this.userId = userId;
  }

  @action
  setActivityInfo = (activityInfo) => {
    const { name: username, headImgUrl, isSelf, isFavour, progressRate, neededFavor } = activityInfo;

    const { name: activityName, description: activityDescription, banner } = activityInfo.activityInfo;

    this.activityInfo = {
      name: activityName,
      banner: banner,
      isSelf: isSelf,
      isFavour: isFavour,
      progressRate: progressRate,
      neededFavor: neededFavor
    };

    this.userInfo = {
      name: username,
      headImgUrl: headImgUrl
    };

    const shareUsername = isSelf ? '我' : username;
    const shareDescription = `${ shareUsername }正在参加“${ activityName }”，快来支持${ shareUsername }！`;

    this.wechatShare = new WechatShare(
      activityName,
      shareDescription,
      `${ location.origin }/redirect?target=/activity/${ this.activityId }/user/${this.userId}`,
      banner
    );
  };

  fetchActivityInfo = () => httpGet(`${baseUrl}/activity/${this.activityId}/user/${this.userId}`);

  favourUser = () => httpPost(`${baseUrl}/activity/${this.activityId}/user/${this.userId}/favour`);
}

