'use strict';

import React, { Component } from "react";
import { browserHistory } from "react-router";
import { observer, inject } from "mobx-react";
import WeUI from "react-weui";

import _ from '../../util';
import IMAGE_URL_MAP from "../../BigImageUrl";
import '../../../../style/promotion.scss';

const {
  Article
} = WeUI;

@inject("Promotion") @observer
export default class PromotionShare extends Component {
  constructor(props) {
    super(props);

    this.promoption = this.props.Promotion;
  }

  componentDidMount() {
    const { promoterUserId } = this.props.params;

    this.promoption.getTargetPromoterInfo(promoterUserId)
      .catch(() => browserHistory.replace('/subscribe'));
  }

  render() {
    const { targetPromoterUser } = this.promoption;

    const promotionInfo = _.get(targetPromoterUser, 'promotionInfo', null);

    const promotionKey = _.get(promotionInfo, 'key', ''),
      qrcodeUrl = _.get(promotionInfo, 'qrcodeUrl', '');

    return (
      <div className="page page-current promotion-share-page">
        <div className="content">
          <header className="promotion-share-header flex-row-center">
            <div className="promotion-info-container">
              <img className="promoter-avatar" src={_.get(targetPromoterUser, 'headImgUrl', '')} alt="用户头像"/>
              <img className="icon-together" src={IMAGE_URL_MAP["PRMOTION_STUDY_TOGETHER"]}/>
              <i className="icon-gb icon-gb-promotion-first-order icon-first-order"/>
              <span className="promotion-key">{promotionKey}</span>
              <span className="desc">报名时输入上面的优惠码有优惠</span>
            </div>
          </header>
          <Article className="p-n uband-introduction">
            <img className="introduction-image align-center"
                 src="http://qiniuprivate.gambition.cn/FXLzR0_uband-intro-01.png"
                 alt="..."/>
            <img className="introduction-image m-t-n-xxl align-center"
                 src="http://qiniuprivate.gambition.cn/ODHpW4_uband-intro-02.png"
                 alt="..."/>
            <img className="introduction-image align-center"
                 src="http://qiniuprivate.gambition.cn/gOee9H_uband-intro-03.png"
                 alt="..."/>
            <img className="introduction-image align-center"
                 src="http://qiniuprivate.gambition.cn/bXp6Hg_uband-intro-04.png"
                 alt="..."/>
          </Article>
          <footer className="promotion-share-footer p-xxs flex-row-center">
            <div className="promotion-info-container">
              <img className="promoter-avatar" src={_.get(targetPromoterUser, 'headImgUrl', '')} alt="用户头像"/>
              <img className="icon-together" src={IMAGE_URL_MAP["PRMOTION_STUDY_TOGETHER"]}/>
              <img className="icon-qrcode-prefix" src={IMAGE_URL_MAP["QRCODE_PREFIX"]}/>
              <img className="promotion-qrcode" src={qrcodeUrl} alt="uband qrcode"/>
            </div>
          </footer>
        </div>
      </div>
    )
  }
}
