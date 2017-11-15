'use strict';
import { browserHistory } from "react-router";
import React, { Component } from "react";
import { observer, inject } from "mobx-react";

import WeUI from "react-weui";

import TaskList from "../task/task-list";
import RankList from "../rank/rank-list";
import { clazzJoinTypeEnum } from "../../../enum";
import { clazzTypeEnum } from '../../../enum';

const {
  NavBarItem,
  NavBar,
  Tab,
  TabBody,
  Popup,
  PopupHeader,
  Article,
  ButtonArea,
  Button
} = WeUI;

@inject("CourseStudy", "TaskList") @observer
class CourseStudy extends Component {
  constructor(props) {
    super(props);
    const { CourseStudy, courseId } = this.props;

    this.courseStudy = new CourseStudy(courseId);

    this.courseStudy.setCurrentPanel(this.props.currentPanel);
  }

  componentDidMount() {
  }

  render() {
    const { courseId, currentDetailPanel, setCurrentPanel, PANEL } = this.courseStudy;
    const { TaskList: taskList, backUrl } = this.props;

    const oneUrl = `/course/${courseId}/one/chat`;

    const {
      strategy, state, clazz,
      closePopup,
      openPopup
    } = taskList;


    return (
      <div>
        <header className="bar bar-nav ">
          <a className="icon icon-left pull-left" onClick={() => browserHistory.replace(backUrl)}/>
          <h1 className="title">课程主页</h1>
          <a className="icon pull-right course-page-more-link" onClick={openPopup}/>
        </header>
        <div className="content p-b-xxl">
          <div className="course-detail">
            <div className="course-introduction item-content">
              <div className="course-intro-wrapper">
                <div className="course-title">{clazz.name}</div>
                <div className="flex-row clazz-description-container">
                  <div className="flex-all flex-row" onClick={openPopup}>
                    <span>学习攻略</span>
                    <i className="qa-button icon-gb icon-gb-help"/>
                    <div className="flex-all flex-row"/>
                  </div>
                </div>
                <div className="flex-row justify-between clazz-task-container">
                  <div className="font-grey">
                    结束日期：{clazz.accountEndDate}
                  </div>
                  <div className="font-blue">
                    {
                      ((hasTheOne) => {
                        if (hasTheOne) {
                          return (<div onClick={() => browserHistory.replace(oneUrl)}>笃师一对一</div>);
                        } else {
                          return (``);
                        }
                      })(clazz.hasTheOneFeedback)
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Tab>
            <NavBar>
              <NavBarItem active={currentDetailPanel === PANEL.taskPanel}
                          onClick={() => setCurrentPanel(PANEL.taskPanel)}>
                任务表
              </NavBarItem>
              <NavBarItem active={currentDetailPanel === PANEL.rankPanel}
                          onClick={() => setCurrentPanel(PANEL.rankPanel)}>
                排行榜
              </NavBarItem>
            </NavBar>
            <div className="w-full nav-bar-placeholder"/>
            <TabBody>
              <div className="course-study">
                {
                  ((currentPanel) => {
                    let listTag;
                    switch (currentPanel) {
                      case PANEL.rankPanel:
                        listTag =
                          <RankList courseBanner={clazz.banner} courseName={clazz.name}/>;
                        break;
                      case PANEL.taskPanel:
                      default:
                        listTag = <TaskList courseId={courseId}/>;
                    }

                    return (
                      <div className="course-study-content">
                        {listTag}
                      </div>
                    )
                  })(currentDetailPanel)
                }
              </div>
            </TabBody>
          </Tab>
        </div>
        <Popup className="popup-dialog" show={state}>
          <PopupHeader left='返回' leftOnClick={closePopup}/>

          <Article>
            <div dangerouslySetInnerHTML={{ __html: strategy ? strategy : '还木有课程攻略' }}/>

            <ButtonArea>
              <Button primary onClick={closePopup}>返回</Button>
            </ButtonArea>
          </Article>
        </Popup>
      </div>
    )
  }
}

export default CourseStudy;
