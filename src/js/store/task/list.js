"use strict";

import { observable, useStrict, action } from "mobx";
import { browserHistory } from "react-router";
import courseList from "../course/list";

import { httpGet, httpDel } from "../../service";

useStrict(true);

import util from "../util";
import Dialog from "../common/dialog";
import uniqueToast from "../common/httpToast";

const baseUrl = `${util.baseUrl}api/clazz`;

class TaskList {
  @observable clazz = {};
  @observable content = [];
  @observable strategy = "";
  @observable state = false;

  constructor() {
    this.dialog = new Dialog();
  }

  setCourseId = (courseId) => {
    this.courseId = courseId;
  };

  @action
  clearData = () => {
    this.courseId = null;
    this.clazz = {};
    this.content = [];
    this.strategy = "";
    this.state = false;
  };

  @action
  setDetail = (data) => {
    data.tasks.forEach(item => this.content.push(item));
    this.clazz = data;
  };

  fetchInfo = (cb) => {
    httpGet(`${baseUrl}/${this.courseId}/tasks`)
      .then(cb);
  };

  getInfo = () => {
    this.fetchInfo(this.setDetail);
  };

  getStrategy = () => {
    httpGet(`${baseUrl}/${this.courseId}/strategy`)
      .then(action(data => this.strategy = data.strategy))
  };

  @action
  openPopup = () => this.state = true;

  @action
  closePopup = () => this.state = false;

  //这里是dialog点击确认后处理退课请求
  processCourseCanceling = () => {
    this.dialog.dismissDialog();
    this.cancelCourse()
      .then(() => {
        uniqueToast.showToast({
          text: "退出课程成功",
          icon: "success",
          cb: () => {
            courseList.markReloadFlag();
            browserHistory.replace("/course/list")
          }
        });
      });
  };

  cancelCourse = () => {
    return httpDel(`${baseUrl}/${this.courseId}`);
  };
}

export default new TaskList();
