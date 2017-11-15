'use strict';

import React, { Component } from "react";
import { browserHistory } from "react-router";
import { observer, inject } from "mobx-react";
import WeUI from "react-weui";
import CopyToClipboard from 'react-copy-to-clipboard';

import _ from '../../util';

const {
  Cell,
  CellHeader,
  CellBody,
  CellFooter,
  Article,
  Button,
} = WeUI;

@inject("Promotion") @observer
export default class Recommentpage extends Component {
  constructor(props) {
    super(props);

    this.promotion = this.props.Promotion;
  }

  componentDidMount() {
    this.promotion.initWechatShare();
  }

  render() {
    const { currentPromotionUser, isRecommendMaskDisplay, alertCopySuccess, toggleRecommendMask } = this.promotion;

    const promotionInfo = _.get(currentPromotionUser, 'promotionInfo', null),
      currentUserName = _.get(currentPromotionUser, 'name', '');

    const promotionKey = _.get(promotionInfo, 'key', '');

    return (
      <div className="promotion-page recommend-page w-full">
        <header className="page-header w-full bar bar-nav">
          <a className="icon icon-left pull-left p-l-none p-r-none"
             onClick={() => browserHistory.replace('/promotion/home')}/>
          <span className="title">强 烈 推 荐</span>
        </header>
        <main className="recommend-page-main">
          <Cell className="recommend-page-main-user">
            <CellHeader className="user-profit">
              <div className="user-profit-info">
                <span>邀请码</span>
                <span>{promotionKey}</span>
              </div>
              <div className="user-profit-info">
                <span>总收益</span>
                <span className="all-profit">￥{(_.get(promotionInfo, 'incomeSum', 0) / 100).toFixed(0)}</span>
              </div>
            </CellHeader>
            <CellBody className="user-info-photo">
              <img className="user-photo" src={_.get(currentPromotionUser, 'headImgUrl', '')} alt="用户头像"/>
            </CellBody>
            <CellFooter className="current-user-info text-right">
              <span>{currentUserName}</span>
              <span>学号：{_.get(currentPromotionUser, 'studentNumber', '')}</span>
            </CellFooter>
          </Cell>

          <Article className="text-center">
            <section className="text-center">
              <p>分享首单优惠码</p>
              <p>和好友一起<span className="come-study">得优惠，来学习</span></p>
            </section>
            <section className="first-order text-center">
              <p className="first-order-des m-b-none">首单优惠码</p>
              <span className="invitecode text-center">{promotionKey}</span>
              <CopyToClipboard text={promotionKey} onCopy={alertCopySuccess}>
                <Button className="copy-button">一键复制</Button>
              </CopyToClipboard>
            </section>
            <section className="text-center m-t-n-xl">
              <p className="m-b-xs">点击下方分享</p>
              <p className="m-b-xs">帮助你召唤一大波友军</p>
              <p className="m-b-xs">友军越多，优惠越多，惊喜不断哦~</p>
              <p className="m-b-xs">赶快行动起来吧！</p>
            </section>
            <Button className="share-button" onClick={toggleRecommendMask}>分享</Button>
            <p className="note text-center m-t-xl m-b-xl m-l-none m-r-none">注：首单优惠码在购课时方可使用，仅限首次购课</p>
          </Article>
        </main>
        <div className="masking-out w-full text-center" style={{ display: isRecommendMaskDisplay ? 'block' : 'none' }}
             onClick={toggleRecommendMask}>
          <i className="tap icon-gb-promotion-tap icon-gb"/>
          <p className="des">点击上方进行分享</p>
        </div>
      </div>
    )
  }
}
