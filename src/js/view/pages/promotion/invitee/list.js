'use strict';

import React, { Component } from "react";
import { Link, browserHistory } from "react-router";
import { observer, inject } from "mobx-react";
import WeUI from "react-weui";
import _ from '../../../util';
import EmptyTip from '../../../EmptyTip';

const {
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellFooter
} = WeUI;

@inject("Promotion") @observer
export default class InviteeList extends Component {
  constructor(props) {
    super(props);

    this.promotion = this.props.Promotion;
  }

  componentDidMount() {
    this.promotion.getPromotionInviteeList();

    this.promotion.initWechatShare();
  }

  render() {
    const { currentPromotionUser, promotionInviteeList } = this.promotion;

    const promotionInfo = _.get(currentPromotionUser, 'promotionInfo', null),
      currentUserName = _.get(currentPromotionUser, 'name', '');

    return (
      <div className="promotion-page allies-page w-full">
        <header className="page-header w-full bar bar-nav">
          <a className="icon icon-left pull-left p-l-none p-r-none" onClick={() => browserHistory.replace('/promotion/home')}/>
          <span className="title">我 的 友 军</span>
        </header>
        <main className="allies-page-main">
          <Cell className="allies-page-main-user">
            <CellHeader className="user-des">
              <div className="user-des-info">
                <span>友军数</span>
                <span>{_.get(promotionInviteeList, 'length', 0)}</span>
              </div>
              <div className="user-des-info">
                <span>总收益</span>
                <span className="user-des-info-number">￥{(_.get(promotionInfo, 'incomeSum', 0) / 100).toFixed(0)}</span>
              </div>
            </CellHeader>
            <CellBody className="user-number">
              <img className="user-photo" src={_.get(currentPromotionUser, 'headImgUrl', '')} alt={currentUserName}/>
            </CellBody>
            <CellFooter className="user-info text-right">
              <span>{currentUserName}</span>
              <span>学号：{_.get(currentPromotionUser, 'studentNumber', '')}</span>
            </CellFooter>
          </Cell>

          <Cells className="allies-page-main-list">
            {
              promotionInviteeList.length === 0
                ? <EmptyTip tip="空空如也"/>
                : promotionInviteeList.map((inviteeItem) => (
                <Cell className="list-info" component={Link} to={"/promotion/invitee/" + inviteeItem.id}
                      key={inviteeItem.id} access>
                  <CellHeader className="list-info-info">
                    <img className="list-info-photo" src={inviteeItem.headImgUrl} alt="友军头像"/>
                  </CellHeader>
                  <CellBody className="list-info-des">
                    <span className="m-l-sm text-overflow-hidden">{inviteeItem.name}</span>
                    {inviteeItem.studentNumber && <span className="m-l-sm text-overflow-hidden">学号：{inviteeItem.studentNumber}</span>}
                  </CellBody>
                  <CellFooter className="list-info-num">
                    <div className="list-info-num-div">
                      <span>购课数</span>
                      <span>{inviteeItem.promotionInfo.clazzCount}</span>
                    </div>
                    <div className="list-info-num-div">
                      <span>购课收益</span>
                      <span>{(inviteeItem.promotionInfo.incomeSum / 100).toFixed(0)}</span>
                    </div>
                  </CellFooter>
                </Cell>
              ))
            }
          </Cells>
        </main>
      </div>
    )
  }
}
