'use strict';

import React, { Component } from "react";
import { browserHistory } from "react-router";
import { observer, inject } from "mobx-react";
import WeUI from  'react-weui';
import { clazzStatusEnum } from '../../enum';
import EmptyTip from '../../EmptyTip';

const {
  Tab,
  TabBody,
  NavBar,
  NavBarItem,
  Button,
  Article,
  Dialog
} = WeUI;

@inject('ActivityEnroll', 'User') @observer
export default class ActivityEnroll extends Component {
  constructor(props) {
    super(props);

    this.activityEnroll = new this.props.ActivityEnroll(this.props.params.activityId);
    this.user = this.props.User;
  }

  componentDidMount() {
    const { fetchActivityDetail, setActivityDetail } = this.activityEnroll;

    fetchActivityDetail().then(setActivityDetail);
  }

  render() {
    const {
      PANEL, modal,
      setCurrentPanel, enrollActivity,
      activityItem, currentDetailPanel, activityId
    } = this.activityEnroll;
    const { info: userInfo } = this.user;

    const redirectTDetailPage = () => browserHistory.push(`/redirect?target=/activity/${activityId}/user/${userInfo.id}`);

    return (
      <div className="page page-current activity-enroll-page">
        <header className="bar bar-nav activity-enroll-header">
          <a className="icon icon-left pull-left" onClick={() => browserHistory.replace('/activity/list')}/>
          <img className="header-background" src={activityItem.banner}/>
          <a className="icon pull-right share-link" onClick={modal.open}>分享</a>
        </header>

        <div className="activity-enroll-body">
          <Tab>
            <NavBar className="activity-enroll-navbar">
              <NavBarItem className="activity-enroll-navbar-item"
                          active={ currentDetailPanel === PANEL.introduction }
                          onClick={() => setCurrentPanel(PANEL.introduction)}>
                介绍
              </NavBarItem>
              <NavBarItem className="activity-enroll-navbar-item"
                          active={ currentDetailPanel === PANEL.requirements }
                          onClick={() => setCurrentPanel(PANEL.requirements)}>
                要求
              </NavBarItem>
              <NavBarItem className="activity-enroll-navbar-item"
                          active={ currentDetailPanel === PANEL.questionAnswered }
                          onClick={() => setCurrentPanel(PANEL.questionAnswered)}>
                问答
              </NavBarItem>
              <NavBarItem className="activity-enroll-navbar-item"
                          active={ currentDetailPanel === PANEL.messageBook }
                          onClick={() => setCurrentPanel(PANEL.messageBook)}>
                留言
              </NavBarItem>
            </NavBar>
            <TabBody className="activity-enroll-content-container">
              <Article className=" activity-enroll-content">
                {
                  ((currentDetailPanel) => {
                    const introduction = activityItem.introduction[currentDetailPanel];

                    return introduction == null
                      ? <EmptyTip tip="空空如也"/>
                      : <section dangerouslySetInnerHTML={{ __html: introduction }}/>;
                  })(currentDetailPanel)
                }
              </Article>
            </TabBody>
          </Tab>
        </div>

        <footer className="bar bar-tab activity-enroll-footer">
          {
            ((joined, status) => {
              if (joined === false) {
                switch (status) {
                  case clazzStatusEnum.OPEN.key:
                    return <Button
                      onClick={() => {
                        enrollActivity()
                          .then(redirectTDetailPage)
                          .catch(() => {
                          })
                      }}>
                      参加报名
                    </Button>;
                  default:
                    return <Button type="default" disabled>已结束</Button>;
                }
              }

              return <Button onClick={redirectTDetailPage}>查看进度</Button>
            })(activityItem.joined, activityItem.status)
          }
        </footer>

        <Dialog buttons={modal.buttons} show={modal.state} title={modal.title}>
          点击页面右上角分享到朋友圈
        </Dialog>
      </div>
    )
  }
}
