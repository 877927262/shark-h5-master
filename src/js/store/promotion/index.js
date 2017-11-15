'use strict';

import { observable, useStrict, action } from "mobx";
import { httpGet, httpPost, httpPut } from "../../service";
import httpToast from '../common/httpToast';

import WechatShare from '../common/wechatShare';
import util from "../util";

const baseUrl = `${util.baseUrl}api/`;

useStrict(true);

class Promotion {
  /**
   * 推广用户列表
   * @type {Array}
   */
  @observable
  promotionUserList = [];

  @observable
  isAgreed = false;

  @observable
  isRecommendMaskDisplay = false;

  @observable
  joinedCount = 0;

  @observable
  currentPromotionUser = null;

  @observable
  promotionInviteeList = [];

  @observable
  currentPromotionInvitee = null;

  @observable
  promotionIncomeList = [];

  @observable
  targetPromoterUser = null;

  @observable
  currentDialogIndex = 1;

  constructor() {
    this.gridList = [{
      name: 'recommend',
      title: '去推荐',
      icon: 'icon-gb-promotion-introduction',
      available: true,
      path: '/promotion/recommend'
    }, {
      name: 'income',
      title: '查收益',
      icon: 'icon-gb-promotion-income',
      available: true,
      path: '/promotion/income'
    }, {
      name: 'promotion',
      title: '看友军',
      icon: 'icon-gb-promotion-invitees',
      available: true,
      path: '/promotion/invitees'
    }, {
      name: 'help',
      title: '怎么玩',
      icon: 'icon-gb-promotion-help',
      available: true,
      path: '/promotion/help'
    }, {
      name: 'badge',
      title: '看勋章',
      icon: 'icon-gb-promotion-medal',
      available: false,
      path: ''
    }, {
      name: 'coming',
      title: '敬请期待',
      icon: 'icon-gb-promotion-coming',
      available: false,
      path: ''
    }];

    this.dialogList = [{
      content: "欢迎来到伙伴中心-玩法指南，在这里我会带你熟悉各个板块。<span>回复 <a class=\"reply-red\">看友军；</a></span><span>回复 <a class=\"reply-red\">查收益；</a></span><span>回复 <a class=\"reply-red\">去推荐。</a></span>就可以查看详细介绍哦，其他功能敬请期待哦~",
      isSelf: false
    }, {
      content: "看友军",
      isSelf: true
    }, {
      content: "看友军板块中，你可以查看自己带来的友军哦。包括友军的学号，报名的课程数，课程名，课程进展情况与购买金额。",
      isSelf: false
    }, {
      content: "查收益",
      isSelf: true
    }, {
      content: "在查收益板块中，你可以查看自己的收益余额与收益状态，点击查看记录可以看收益详情。",
      isSelf: false
    }, {
      content: "去推荐",
      isSelf: true
    }, {
      content: "在去推荐板块中，你可以一键复制首单优惠码。通过分享页面，助你召唤一大波友军！",
      isSelf: false
    }];
  }

  getPromotionUserList = () => {
    this._fetchPromotionUserList().then(this._setPromotionUserList);
  };

  getCurrentPromotionUser = () => {
    this._fetchCurrentPromotionUser().then(this._setCurrentPromotionUser);
  };

  getPromotionInviteeList = () => {
    this._fetchPromotionInviteeList().then(this._setPromotionInviteeList);
  };

  getCurrentPromotionInvitee = (inviteeId) => {
    this._fetchCurrentPromotionInvitee(inviteeId).then(this._setCurrentPromotionInvitee);
  };

  getPromotionIncomeList = () => {
    this._fetchPromotionIncomeList().then(this._setPromotionIncomeList);
  };

  processJoinConfirmAction = () => {
    this._postPromotionAgreement()
      .then(() => {
        httpToast.showToast({ text: '成功加入', icon: 'success' });

        // 重新获取推广用户信息
        this.getCurrentPromotionUser();
      });
  };

  getTargetPromoterInfo = (promoterUserId) => this._fetchPromoterUserInfo(promoterUserId).then(this._setTargetPromoterUserInfo);

  processWithdrawAction = () => {
    this._withdrawPromotionIncome()
      .then(() => {
        httpToast.showToast({ text: '提现成功', icon: 'success' });

        // 重新获取推广用户信息
        this.getCurrentPromotionUser();
      })
  };

  @action
  setIsAgreed = (isAgreed) => {
    this.isAgreed = isAgreed;
  };

  alertCopySuccess = () => {
    httpToast.showToast({ text: '复制成功', icon: 'success' });
  };

  initWechatShare = () => {
    const { id, name, headImgUrl } = this.currentPromotionUser;

    this._initWechatShare(name, id, headImgUrl);
  };

  @action
  resetAll = () => {
    this.promotionUserList = [];

    this.isAgreed = false;

    this.isRecommendMaskDisplay = false;

    this.joinedCount = 0;

    this.currentPromotionUser = null;

    this.promotionInviteeList = [];

    this.currentPromotionInvitee = null;

    this.promotionIncomeList = [];

    this.targetPromoterUser = null;

    this.currentDialogIndex = 0;
  };

  @action
  resetCurrentPromotionInvitee = () => {
    this.currentPromotionInvitee = null;
  };

  @action
  toggleRecommendMask = () => {
    this.isRecommendMaskDisplay = this.isRecommendMaskDisplay === false;
  };

  @action
  incrementCurrentDialogIndex = () => {
    ++this.currentDialogIndex;
  };

  @action
  _setCurrentPromotionUser = (promotionUser) => {
    this.currentPromotionUser = { ...promotionUser };
  };

  _initWechatShare = (name, id, headImgUrl) => {
    this.wechatShare = new WechatShare(
      '来友班，和我一起学习',
      `${ name }邀请你加入友班，开始学霸养成游戏.`,
      `${ location.origin }/redirect?target=/promotion/${ id }/share`,
      headImgUrl
    );
  };

  _fetchCurrentPromotionUser = () => httpGet(`${ baseUrl }/promotion`);


  @action
  _setPromotionUserList = (promotionUser) => {
    this.promotionUserList = [...promotionUser.joinedUserList];
    this.joinedCount = promotionUser.joinedCount;
  };

  _fetchPromotionUserList = () => httpGet(`${ baseUrl }/promotions`);

  _postPromotionAgreement = () => httpPost(`${ baseUrl }/promotion`);

  @action
  _setPromotionInviteeList = (promotionInviteeList) => {
    this.promotionInviteeList = [...promotionInviteeList];
  };

  _fetchPromotionInviteeList = () => httpGet(`${ baseUrl }/promotion/invitees`);

  @action
  _setCurrentPromotionInvitee = (promotionInvitee) => {
    this.currentPromotionInvitee = { ...promotionInvitee };
  };

  _fetchCurrentPromotionInvitee = (inviteeId) => httpGet(`${ baseUrl }/promotion/invitee/${ inviteeId }`);

  @action
  _setPromotionIncomeList = (promotionIncomeList) => {
    this.promotionIncomeList = [...promotionIncomeList];
  };

  _fetchPromotionIncomeList = () => httpGet(`${ baseUrl }/promotion/incomes`);

  _withdrawPromotionIncome = () => httpPut(`${ baseUrl }/promotion/income`);

  @action
  _setTargetPromoterUserInfo = (targetPromoterUser) => {
    this.targetPromoterUser = targetPromoterUser;

    const { id, name, headImgUrl } = targetPromoterUser;

    this._initWechatShare(name, id, headImgUrl);
  };

  _fetchPromoterUserInfo = (promoterUserId) => httpGet(`${ baseUrl }/promotion/promoter/${ promoterUserId }`);
}

export default new Promotion();
