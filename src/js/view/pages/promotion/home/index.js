'use strict';

import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { browserHistory } from "react-router";
import WeUI from "react-weui";
import CopyToClipboard from 'react-copy-to-clipboard';

import _ from '../../../util';

const {
  Cell,
  CellHeader,
  CellBody,
  CellFooter,
  Button,
  Grids,
  Grid,
  GridIcon,
  GridLabel
} = WeUI;

@inject("Promotion") @observer
export default class Homepage extends Component {
  constructor(props) {
    super(props);

    this.promotion = this.props.Promotion;
  }

  componentDidMount() {
    this.promotion.initWechatShare();
  }

  render() {
    const { currentPromotionUser, alertCopySuccess, gridList } = this.promotion;

    const promotionInfo = _.get(currentPromotionUser, 'promotionInfo', null),
      currentUserName = _.get(currentPromotionUser, 'name', '');

    const promotionKey = _.get(promotionInfo, 'key', '');

    return (
      <div className="promotion-page home-page w-full">
        <header className="page-header bar bar-nav w-full divide-full">
          <a className="icon icon-left pull-left p-l-none p-r-none"
             onClick={() => browserHistory.replace('/me/index')}/>
          <span className="title">伙 伴 中 心</span>
        </header>
        <main className="home-page-main">
          <Cell className="home-page-main-user">
            <CellHeader className="user-income text-center p-r-md">
              <span className="user-income-number">￥{(_.get(promotionInfo, 'incomeSum', 0) / 100).toFixed(0)}</span>
              <span className="user-income-des">总收益</span>
            </CellHeader>
            <CellBody className="user-photo">
              <img className="user-photo-icon" src={_.get(currentPromotionUser, 'headImgUrl', '')}
                   alt={currentUserName}/>
            </CellBody>
            <CellFooter className="user-info text-right p-l-md">
              <span className="user-info-name">{currentUserName}</span>
              <span className="user-info-number">学号：{_.get(currentPromotionUser, 'studentNumber', '')}</span>
            </CellFooter>
          </Cell>

          <section className="home-page-main-invitation text-center">
            <p>我的邀请码：<span className="invitecode text-center">{promotionKey}</span></p>
            <CopyToClipboard text={promotionKey} onCopy={alertCopySuccess}>
              <Button className="copy-button">一键复制</Button>
            </CopyToClipboard>
          </section>
        </main>
        <footer className="home-page-footer m-t-lg">
          <Grids>
            {
              gridList.map((gridItem) => {
                return (
                  <Grid key={gridItem.name} className="home-page-footer-icon"
                        onClick={() => gridItem.available && browserHistory.push(gridItem.path)}>
                    <GridIcon><i className={`m-l-n-sm icon-gb ${ gridItem.icon }`}/></GridIcon>
                    <GridLabel className={`icon-label m-b-none ${ gridItem.available ? '' : 'icon-label-grey'}`}>{gridItem.title}</GridLabel>
                  </Grid>
                )
              })
            }
          </Grids>
        </footer>
      </div>
    )
  }
}
