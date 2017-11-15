'use strict';

import React, { Component } from "react";
import { observer, inject } from "mobx-react";

@inject("CheckinList", "CourseStudy", "TaskList", "RankList") @observer
class CourseItem extends Component {
  constructor(props) {
    super(props);

    const { TaskList, CheckinList, RankList, params } = this.props;
    const { courseId } = params;

    this.tasks = TaskList;
    this.checkins = CheckinList;
    this.rankList = RankList;

    this.tasks.setCourseId(courseId);
    this.checkins.setCourseId(courseId);
    this.rankList.setCourseId(courseId);
  }

  componentDidMount() {
    this.tasks.getInfo();

    this.checkins.getCheckins();

    const { getRankList, getCurrentUserRankInfo } = this.rankList;
    getCurrentUserRankInfo();
    getRankList();
  }

  componentWillUnmount() {
    this.tasks.clearData();
    this.checkins.clearData();
    this.rankList.clearData();
  }

  render() {
    return this.props.children
  }
}

export default CourseItem;
