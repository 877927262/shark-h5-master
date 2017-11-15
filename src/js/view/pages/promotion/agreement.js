'use strict';

import React, { Component } from "react";
import { browserHistory } from "react-router";
import { observer, inject } from "mobx-react";
import WeUI from "react-weui";
import IMAGE_URL_MAP from "../../BigImageUrl";

import _ from '../../util';

const {
  Cell,
  CellHeader,
  CellBody,
  CellFooter,
  Article,
  Flex,
  FlexItem,
  Agreement,
  Button
} = WeUI;

@inject("Promotion") @observer
export default class PromotionAgreement extends Component {
  constructor(props) {
    super(props);

    this.promotion = this.props.Promotion;
  }

  componentDidMount() {
    this.promotion.getPromotionUserList();

    this.promotion.initWechatShare();
  }

  render() {
    const {
      currentPromotionUser, promotionUserList, isAgreed, joinedCount,
      setIsAgreed, processJoinConfirmAction
    } = this.promotion;

    const currentUserName = _.get(currentPromotionUser, 'name', '');

    return (
      <div className="promotion-page agreement-page w-full">
        <header className="agreement-page-header w-full bar bar-nav">
          <a className="icon icon-left pull-left p-l-none p-r-none" onClick={() => browserHistory.replace('/me/index')}/>
          <span className="title">伙 伴 中 心</span>
        </header>
        <main className="agreement-page-main m-t-none content">
          <Cell className="agreement-page-main-user">
            <CellHeader>
              <img className="agreement-page-main-user-photo" src={_.get(currentPromotionUser, 'headImgUrl', '')} alt={currentUserName}/>
            </CellHeader>
            <CellBody className="agreement-page-main-user-info">
              <span>{currentUserName}</span>
              <span className="studentNumber">学号：{_.get(currentPromotionUser, 'studentNumber', '')}</span>
            </CellBody>
            <CellFooter className="agreement-page-main-user-join">
              <span>这是你加入友班</span>
              <span>第<span className="user-join-day"> {_.get(currentPromotionUser, 'joinedDays', 0)} </span> 天</span>
            </CellFooter>
          </Cell>

          <Article className="agreement-page-main-description text-center">
            <section className="m-b">
              <p className="m-b-xs">Hi!</p>
            </section>
            <section className="m-b">
              <p className="m-b-xs">{currentUserName}</p>
            </section>
            <section className="m-b">
              <p className="m-b-xs">欢迎来到伙伴中心</p>
              <p className="m-b-xs">在这里你可以<span className="description-span">赚“友金”</span></p>
            </section>
            <section className="m-b">
              <p className="m-b-xs">将你的<span className="description-span">首单优惠码</span></p>
              <p className="m-b-xs">分享给好朋友们</p>
              <p className="m-b-xs">只要他们首次购买课程</p>
              <p className="m-b-xs">并输入你的优惠码</p>
              <p className="m-b-xs">你可以获得<span className="description-span">现金奖励</span>哦~</p>
            </section>
            <section className="m-b">
              <p className="m-b-xs">优惠多多，快来加入吧！</p>
            </section>
          </Article>

          <Flex className="agreement-page-main-agree">
            {
              promotionUserList.map((promotionUser) => (
                <div key={promotionUser.id}>
                  <FlexItem>
                    <img className="agreement-page-main-allies-photo" src={promotionUser.headImgUrl} key={promotionUser.id} alt={promotionUser.name}/>
                  </FlexItem>
                </div>
              ))
            }
            <img className="allies-photo-more" src={IMAGE_URL_MAP["MORE"]} />
          </Flex>
          <p className="agreement-page-main-allies-number text-center">已有{joinedCount}名友军加入</p>
        </main>
        <footer className="agreement-page-footer text-center">
          <Agreement className="agreement-page-footer-agree p-n" checked={isAgreed} onChange={e => setIsAgreed(e.target.checked)}>
            <span>我已阅读上述说明</span>
          </Agreement>
          <Button className="agreement-page-footer-button" disabled={!isAgreed} onClick={processJoinConfirmAction}>确认加入</Button>
        </footer>
      </div>
    )
  }
}


