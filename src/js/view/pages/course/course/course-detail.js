'use strict';

import React, { Component } from "react";
import { observer, inject } from "mobx-react";

import WeUI from "react-weui";
import _ from '../../../util';
import { clazzJoinStatusEnum } from '../../../enum';

import CheckinList from "./checkin-list";
import CourseStudy from "./course-study";

const {
  TabBar,
  TabBarItem
} = WeUI;

@inject("CourseDetail", "TaskList") @observer
class CourseDetail extends Component {
  constructor(props) {
    super(props);

    const { CourseDetail, location, params } = this.props;

    const { courseId } = params;

    this.courseId = courseId;

    this.detail = new CourseDetail();

    // 设置tabIndex
    const { tabIndex, isCheckin } = location.query;

    if (tabIndex === '1' || isCheckin === '1') {
      const { setTabIndex, TAB_INDEX } = this.detail;

      setTabIndex(TAB_INDEX.CHECKIN_LIST);
    }
  }

  componentDidMount() {
  }

  render() {
    const {TaskList: tasks, location} = this.props;
    const { currentPanel } = location.query;
    const { currentTabIndex, setTabIndex, TAB_INDEX } = this.detail;

    const status = _.get(tasks.clazz, 'clazzJoinStatus', clazzJoinStatusEnum.PROCESSING.key);
    // 返回地址
    const backUrl = `/course/list?status=${ status }#${ this.courseId }`;

    return (
      <div className="page page-current course-page">
        <div>
          {
            currentTabIndex === TAB_INDEX.COURSE_STUDY &&
            <CourseStudy courseId={this.courseId} currentPanel={currentPanel} backUrl={backUrl}/>
          }
          {
            currentTabIndex === TAB_INDEX.CHECKIN_LIST &&
            <CheckinList courseId={this.courseId} backUrl={backUrl}
            />
          }
          <TabBar>
            <TabBarItem
              active={currentTabIndex === TAB_INDEX.COURSE_STUDY}
              label="去学习" icon={<i className="icon-gb icon-gb-task"/>}
              onClick={e => setTabIndex(TAB_INDEX.COURSE_STUDY)}>
            </TabBarItem>
            <TabBarItem
              active={currentTabIndex === TAB_INDEX.CHECKIN_LIST}
              label="去打卡" icon={<i className="icon-gb icon-gb-checkin"/>}
              onClick={e => setTabIndex(TAB_INDEX.CHECKIN_LIST)}>
            </TabBarItem>
          </TabBar>
        </div>
      </div>
    )
  }
}

export default CourseDetail;
