'use strict';

import React, { Component } from "react";
import { browserHistory } from "react-router";
import { observer, inject } from "mobx-react";
import WeUI from "react-weui";

import _ from '../../../util';
import { clazzJoinTypeEnum, promotionIncomeStatusEnum } from "../../../enum";
import EmptyTip from '../../../EmptyTip';

const {
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellFooter
} = WeUI;

@inject("Promotion") @observer
export default class IncomeRecordpage extends Component {
  constructor(props) {
    super(props);

    this.promotion = this.props.Promotion;
  }

  componentDidMount() {
    this.promotion.getPromotionIncomeList();

    this.promotion.initWechatShare();
  }

  render() {
    const { promotionIncomeList } = this.promotion;

    return (
      <div className="promotion-page income-record-page w-full">
        <header className="page-header w-full bar bar-nav">
          <a className="icon icon-left pull-left p-l-none p-r-none" onClick={() => browserHistory.go(-1)}/>
          <span className="title">收 益 记 录</span>
        </header>
        <main className="income-record-page-main">
          <Cells className="income-record-page-main-list">
            {
              promotionIncomeList.length === 0
                ? <EmptyTip tip="空空如也"/>
                : promotionIncomeList.map((item) => {
                  const clazzInfo = item.clazzInfo,
                    userInfo = item.userInfo,
                    incomeStatusEnum = _.get(promotionIncomeStatusEnum, `${ item.status }`, promotionIncomeStatusEnum.CANCELED);

                  const incomeStatusClassName = incomeStatusEnum ===  promotionIncomeStatusEnum.CANCELED ? '' : 'available';

                  return (<Cell className="list-info" key={item.id}>
                    <CellHeader className="list-info-detail">
                      <img className="list-info-photo" src={userInfo.headImgUrl} alt="用户头像"/>
                    </CellHeader>
                    <CellBody className="list-info-des">
                      <span className="m-l-sm text-overflow-hidden">{userInfo.name}</span>
                      <span className="m-l-sm text-overflow-hidden">{clazzInfo.name} | {_.get(clazzJoinTypeEnum, `${ clazzInfo.clazzJoinType }.name`, '笃班')}</span>
                    </CellBody>
                    <CellFooter className="list-info-number">
                      <div className="list-info-number-div">
                        <span>金额</span>
                        <span className={incomeStatusClassName}>{(_.get(item, 'promoterUserIncome', 0) / 100).toFixed(0)}</span>
                      </div>
                     <div className="list-info-number-div">
                       <span>状态</span>
                       <span className={incomeStatusClassName}>{incomeStatusEnum.name}</span>
                     </div>
                    </CellFooter>
                  </Cell>)
                })
            }
          </Cells>
        </main>
      </div>
    )
  }
}
