'use strict';

import React, { Component } from "react";
import { browserHistory } from "react-router";
import { observer, inject } from "mobx-react";
import WeUI from "react-weui";
import _ from '../../../util';
import EmptyTip from '../../../EmptyTip';

import { clazzJoinTypeEnum, promotionIncomeStatusEnum, clazzJoinStatusEnum } from "../../../enum";

const {
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellFooter
} = WeUI;

@inject("Promotion") @observer
export default class InviteeDetail extends Component {
  constructor(props) {
    super(props);

    this.inviteeId = this.props.params.inviteeId;

    this.promoption = this.props.Promotion;
  }

  componentDidMount() {
    this.promoption.getCurrentPromotionInvitee(this.inviteeId);

    this.promoption.initWechatShare();
  }

  componentWillUnmount() {
    this.promoption.resetCurrentPromotionInvitee();
  }

  render() {
    const { currentPromotionInvitee } = this.promoption;

    const promotionInfo = _.get(currentPromotionInvitee, 'promotionInfo', {}),
      inviteeUserName = _.get(currentPromotionInvitee, 'name', ''),
      inviteeStudentNumber = _.get(currentPromotionInvitee, 'studentNumber', '');

    const incomeList = _.get(promotionInfo, 'incomeList', []);

    return (
      <div className="promotion-page allies-detail-page w-full">
        <header className="page-header w-full bar bar-nav">
          <a className="icon icon-left pull-left p-l-none p-r-none"
             onClick={() => browserHistory.replace('/promotion/invitees')}/>
          <span className="title">友 军 详 情</span>
        </header>
        <main className="allies-detail-page-main">
          <Cell className="main-user">
            <CellHeader className="main-user-info">
              <img className="main-user-avatar" src={_.get(currentPromotionInvitee, 'headImgUrl', '')} alt="友军头像"/>
            </CellHeader>
            <CellBody className="main-user-clazz-info">
              <span className="m-l-sm">{inviteeUserName}</span>
              {inviteeStudentNumber && <span className="m-l-sm">学号：{inviteeStudentNumber}</span>}
            </CellBody>
            <CellFooter className="main-user-profit-info">
              <div className="main-user-profit-info-div">
                <span>购课数</span>
                <span>{_.get(promotionInfo, 'clazzCount', 0)}</span>
              </div>
              <div className="main-user-profit-info-div">
                <span>购课收益</span>
                <span className="profit-info-number">{(_.get(promotionInfo, 'incomeSum', 0) / 100).toFixed(0)}</span>
              </div>
            </CellFooter>
          </Cell>

          <Cells className="main-allies-detail m-t-none">
            {
              incomeList.length === 0
                ? <EmptyTip tip="空空如也"/>
                : incomeList.map((item) => {
                const incomeStatusClassName = promotionIncomeStatusEnum.CANCELED === _.get(promotionIncomeStatusEnum, `${ item.status }`, promotionIncomeStatusEnum.CANCELED)
                  ? ''
                  : 'available';

                return <Cell className="main-allies-detail-list" key={item.id}>
                  <CellHeader className="main-allies-detail-list-clazz">
                    <span className="text-overflow-hidden">
                      {item.clazzInfo.name} | {_.get(clazzJoinTypeEnum, `${item.clazzInfo.clazzJoinType}.name`, '')}
                    </span>
                  </CellHeader>
                  <CellBody />
                  <CellFooter className="main-allies-detail-profit-state">
                    <div className="profit-state-div">
                      <span>金额</span>
                      <span className={incomeStatusClassName}>{(item.promoterUserIncome / 100).toFixed(0)}</span>
                    </div>
                    <div className="profit-state-div">
                      <span>状态</span>
                      <span className={incomeStatusClassName}>{_.get(clazzJoinStatusEnum, `${ item.clazzInfo.clazzJoinStatus }.name`, '')}</span>
                    </div>
                  </CellFooter>
                </Cell>;
              })
            }
          </Cells>
        </main>
      </div>
    )
  }
}
