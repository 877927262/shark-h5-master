'use strict';
import { browserHistory } from "react-router";
import React, { Component } from "react";
import { Link } from "react-router";
import { observer, inject } from "mobx-react";
import _ from "../../../util";
import cutil from "../../../../common-util";

import WeUI from "react-weui";

const {
  Tab,
  TabBody,
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellFooter,
  Button
} = WeUI;

@inject("CheckinList") @observer
class CheckinList extends Component {
  constructor(props) {
    super(props);
  }

  static getInterval(secondString) {
    const second = parseInt(secondString, 10);
    const h = Math.floor(second / 3600),
      m = Math.floor((second - h * 3600) / 60),
      s = Math.floor(second - h * 3600 - m * 60);

    return `${h ? h + '小时' : ''}${m ? m + '分' : ''}${s}秒`
  }

  render() {
    const { CheckinList: checkinList, backUrl } = this.props;
    const { courseId, checkins, info } = checkinList;

    const checkinState = info.canCheckin;// 原始代码(&& !info.hasCheckin)：现在不判断是否已经打卡了，只要允许打卡，不管当天是否已经打卡，都要能打卡

    return (
      <div>
        <header className="bar bar-nav">
          <button className="button button-link button-nav pull-left"
                  onClick={() => browserHistory.replace(backUrl)}>
            <span className="icon-gb icon-gb-close page-header-close-button"/>
          </button>
          <h1 className="title">作业记录</h1>
        </header>
        <div className="content">
          <Tab>
            <TabBody>
              <div className="checkin-list-top">
                <div className="checkin-user">
                  <div className="avatar-wrap">
                    <img src={_.get(checkinList, "info.userInfo.headImgUrl", "")}/>
                  </div>
                  <div className="info-wrap">
                    {_.get(checkinList, "info.userInfo.name", "")}
                  </div>
                  <div className="btn-wrap">
                    <Link to={`/course/${ courseId }/checkin`}><Button size="small"
                                                                       disabled={!checkinState}>去打卡</Button></Link>
                  </div>
                </div>
                <div className="checkin-total">
                  <div className="checkin-score">
                    <div className="number">{info.scoreSum}</div>
                    <div>已获学分</div>
                  </div>
                  <div className={(checkinState ? "normal" : "unnormal") + " checkin-day"}>
                    <div className="number">{info.openDays}</div>
                    <div>开班天数</div>
                  </div>
                  <div className={(checkinState ? "normal" : "unnormal") + " checkin-time"}>
                    <div className="number">{checkins.length}</div>
                    <div>打卡次数</div>
                  </div>
                </div>
              </div>
              <div className="checkin-list-wrap">
                <Cells>
                  {
                    checkins.map(item => (
                      <Cell className="checkin-item" key={item.id}
                            component={Link} to={`/course/${ courseId }/checkin/${ item.id }`} access>
                        <CellHeader>
                          <div className="checkin-score">{item.dayNumber}</div>
                        </CellHeader>
                        <CellBody>
                          <div className="checkin-time">{cutil.format(new Date(item.checkinTime), "hh:mm:ss")}</div>
                          <div className="checkin-tip">提前了{CheckinList.getInterval(item.aheadSeconds)}打卡</div>
                        </CellBody>
                        <CellFooter/>
                      </Cell>
                    ))
                  }
                  <Cell className="checkin-footer-item" access>
                    <CellBody>
                      没有更多记录
                    </CellBody>
                  </Cell>
                </Cells>
              </div>
            </TabBody>
          </Tab>
        </div>
      </div>
    )
  }
}

export default CheckinList;
