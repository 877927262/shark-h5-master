'use strict';

import React, { Component } from "react";
import { browserHistory } from "react-router";
import { observer, inject } from "mobx-react";
import WeUI from "react-weui";
import _ from '../../../util';

import { promotionIncomeStatusEnum } from "../../../enum";

const {
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellFooter,
  Article,
  Button
} = WeUI;

@inject("Promotion") @observer
export default class Incomepage extends Component {
  constructor(props) {
    super(props);

    this.promotion = this.props.Promotion;
  }

  componentDidMount() {
    this.promotion.initWechatShare();
  }

  render() {
    const { currentPromotionUser, processWithdrawAction } = this.promotion;

    const promotionInfo = _.get(currentPromotionUser, 'promotionInfo', null);

    const income = _.get(promotionInfo, 'income', {}),
      incomeSum = (_.get(promotionInfo, 'incomeSum', 0) / 100).toFixed(0);

    const reservedIncome = (_.get(income, promotionIncomeStatusEnum.RESERVED.key, 0) / 100),
      availableIncome = (_.get(income, promotionIncomeStatusEnum.AVAILABLE.key, 0) / 100);

    return (
      <div className="promotion-page income-page w-full">
        <header className="page-header w-full bar bar-nav">
          <a className="icon icon-left pull-left p-l-none p-r-none" onClick={() => browserHistory.replace('/promotion/home')} />
          <span className="title">我 的 收 益</span>
        </header>
        <main className="income-page-main">
          <div className="income-page-main-profit">
            <div className="profit text-center p-t-xl p-b-none p-l-none p-r-none">
              <span className="profit-number">{(reservedIncome + availableIncome).toFixed(0)}</span>
              <span className="profit-balance">收益余额</span>
            </div>
            <Button className="income-page-main-recored text-center m-b" type="default" size="small" onClick={() => browserHistory.push('/promotion/incomes')}>查看记录</Button>
          </div>

          <Cells className="income-page-main-list m-t-none">
            <Cell className="income-main-list p-md">
              <CellHeader>在路上</CellHeader>
              <CellBody/>
              <CellFooter className="list-road-number">{reservedIncome.toFixed(0)}</CellFooter>
            </Cell>
            <Cell className="income-main-list p-md">
              <CellHeader>可提现</CellHeader>
              <CellBody/>
              <CellFooter className="list-withdraw-number" >{availableIncome.toFixed(0)}</CellFooter>
            </Cell>
            <Cell className="income-main-list p-md">
              <CellHeader>已提现</CellHeader>
              <CellBody/>
              <CellFooter>{(_.get(income, promotionIncomeStatusEnum.COINED.key, 0) / 100).toFixed(0)}</CellFooter>
            </Cell>
            <Cell className="income-main-list p-md">
              <CellHeader>收益总额</CellHeader>
              <CellBody/>
              <CellFooter>{incomeSum}</CellFooter>
            </Cell>
          </Cells>

          <Article className="income-main-description">
            <section className="m-b-sm">收益余额=在路上+可提现</section>
            <section className="m-b-sm">
              <span>在路上：</span>
              <span>指你的友军购买了课程，但是还没有结课，如果友军退课的话，在路上的收益就会飞走哦~（即：收益没了。。。）</span>
            </section>
            <section className="m-b-sm">
              <span>可提现：</span>
              <span>指你的友军购买了课程，并且已结课，此时在路上的收益就会变成可提现的收益</span>
            </section>
            <section className="m-b-sm">如果友军在课程中表现优秀，比如每天打卡，还会有格外的奖励哦~</section>
            <section className="m-b-sm">收益总额=收益余额+已提现</section>
          </Article>
        </main>
        <footer className="income-footer m-t-n-md">
          <Button disabled={availableIncome <= 0} onClick={processWithdrawAction}>提至优币</Button>
        </footer>
      </div>
    )
  }
}
