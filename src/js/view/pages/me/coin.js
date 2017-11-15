'use strict';

import React, { Component } from "react";
import { Link } from "react-router";
import { observer, inject } from "mobx-react";
import WeUI from "react-weui";

import { getEnumByKey, withdrawStatusEnum } from "../../enum";
import _ from "../../util";
import commonUtil from '../../../common-util';

const {
  Cells,
  Cell,
  CellBody,
  CellFooter,
  Tab,
  TabBody,
  NavBar,
  NavBarItem,
  Button
} = WeUI;

@inject("Coin") @observer
class Coin extends Component {
  constructor(props) {
    super(props);

    this.coin = this.props.Coin;
  }

  componentDidMount() {
    const { fetchCoinInfo, fetchWithdrawList } = this.coin;

    fetchCoinInfo();
    fetchWithdrawList();
  }

  render() {
    const { coinInfo, withdrawList, currentPanel, PANEL, setCurrentPanel } = this.coin;

    return (
      <div className="page page-current me-page">
        <header className="bar bar-nav">
          <button className="button button-link button-nav pull-left" onClick={() => history.go(-1)}>
            <span className="icon icon-left"/>
          </button>
          <h1 className="title">我的优币</h1>
        </header>
        <div className="content">
          <Tab>
            <NavBar>
              <NavBarItem active={PANEL.COIN === currentPanel}
                          onClick={e => setCurrentPanel(PANEL.COIN)}>优币</NavBarItem>
              <NavBarItem active={PANEL.WITHDRAW === currentPanel}
                          onClick={e => setCurrentPanel(PANEL.WITHDRAW)}>提现</NavBarItem>
            </NavBar>
            <TabBody>
              {
                ((currentPanel) => {
                  switch (currentPanel) {
                    case PANEL.COIN:
                      return (<div>
                        <Cells>
                          <Cell className="coin-total-cell">
                            <CellBody>
                              <div className="coin-number">{coinInfo.sum}</div>
                              <div className="coin-label">优币余额</div>
                            </CellBody>
                          </Cell>
                        </Cells>

                        <Cells>
                          {
                            _.get(coinInfo, "values", [])
                              .map((item) => (
                                <Cell className="coin-list-cell" key={item.id}>
                                  <CellBody>
                                    <div className="action-type">
                                      {item.title}
                                    </div>
                                    <div className="action-balance">
                                      余额: {item.sum}
                                    </div>
                                  </CellBody>
                                  <CellFooter>
                                    <div className="action-time">
                                      {commonUtil.format(new Date(item.changeDate), 'yyyy-MM-dd')}
                                    </div>
                                    <div className="action-result">
                                      {(Number(item.coinChange) > 0 ? `+` : ``) + item.coinChange}
                                    </div>
                                  </CellFooter>
                                </Cell>
                              ))
                          }
                          <Cell className="coin-footer-cell">
                            <CellBody>
                              没有更多记录了
                            </CellBody>
                          </Cell>
                        </Cells>
                      </div>);
                    case PANEL.WITHDRAW:
                      return (<div>
                        <div className="withdraw-top">
                          <div className="withdraw-num">共&nbsp;{withdrawList.length}&nbsp;条记录</div>
                          <div className="withdraw-btn">
                            <Link to="/me/withdraw">
                              <Button size="small">新建提现</Button>
                            </Link>
                          </div>
                        </div>
                        <Cells className="withdraw-list">
                          {
                            withdrawList.map((item) => (
                              <Cell className="withdraw-list-cell" key={item.id}>
                                <CellBody>
                                  <div className="action-info">
                                    提现-{item.applyMoney}币
                                  </div>
                                  <div className="action-time">
                                    {commonUtil.format(new Date(item.applyDate), 'yyyy-MM-dd')}
                                  </div>
                                </CellBody>
                                <CellFooter>
                                  <div className="action-status">
                                    {getEnumByKey(item.status, withdrawStatusEnum).name}
                                  </div>
                                  <div className="action-result">
                                    ￥{item.applyMoney}
                                  </div>
                                </CellFooter>
                              </Cell>
                            ))
                          }
                        </Cells>
                      </div>);
                    default:
                      return <div/>
                  }
                })(currentPanel)
              }
            </TabBody>
          </Tab>
        </div>
      </div>
    )
  }
}

export default Coin;
