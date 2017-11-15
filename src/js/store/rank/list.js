'use strict';
import { observable, useStrict, action } from "mobx";

import Paginator from "../common/paginator";
import util from "../util";
import { httpGet, httpPost } from "../../service";
import WechatShare from "../common/wechatShare";

useStrict(true);

const baseUrl = `${util.baseUrl}api/clazz`;

class RankList {
  @observable
  rankListPaginator = new Paginator();
  @observable
  isCurrentUserFirst = false;

  constructor() {
  }

  setCourseId = (courseId) => {
    this.courseId = courseId;
  };

  @action
  clearData = () => {
    this.courseId = null;
    this.rankListPaginator = new Paginator();
    this.isCurrentUserFirst = false;
  };

  initWechatShare(courseName, courseBanner) {
    const targetUrl = `/course/${ this.courseId }/detail?tabIndex=0&currentPanel=rankPanel`;

    this.wechatShare = new WechatShare(
      `你在 ${ courseName } 的打卡排行榜上名列前茅吗？`,
      `友班 ${ courseName }  英雄榜，看看你排第几？`,
      `${ location.origin }/redirect?target=${ encodeURIComponent(targetUrl) }`,
      courseBanner
    );
  }

  getRankList = () => {
    const { updateData, pageNumber } = this.rankListPaginator;

    this._fetchRankList(40, pageNumber).then(updateData);
  };

  getCurrentUserRankInfo = (clazzId) =>
    this._fetchCurrentUserRankInfo().then(this._setCurrentUserRankInfo);

  favourRankItem = (item, index) => {
    if (item.favourInfo.isFavour === true) {
      return;
    }

    this._favourRank(item.id)
      .then(action((data) => {
        this.rankListPaginator.values.splice(index, 1, data);
      }))
  };

  @action
  _setCurrentUserRankInfo = (data) => {
    if (data.id != null) {
      this.isCurrentUserFirst = true;
      this.rankListPaginator.values.unshift(data);
    }
  };

  _fetchRankList = (pageSize, pageNumber = 1) =>
    httpGet(`${baseUrl}/${this.courseId}/ranks?pageSize=${pageSize}&pageNumber=${pageNumber}`);

  _fetchCurrentUserRankInfo = () =>
    httpGet(`${baseUrl}/${this.courseId}/rank`);


  _favourRank = (rankId) =>
    httpPost(`${baseUrl}/${this.courseId}/rank/${rankId}/favour`);
}

export default new RankList();
