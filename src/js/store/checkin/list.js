import { observable, useStrict, action, computed } from "mobx";

useStrict(true);

import util from "../util";
const baseUrl = `${util.baseUrl}api/clazz`;

import { httpGet } from "../../service";


class CheckinList {
  @observable checkins = [];
  @observable info = {};

  constructor() {
    this.courseId= null;
  }

  setCourseId = (courseId) => {
    this.courseId = courseId;
  };

  @action
  clearData = () => {
    this.courseId = null;
    this.checkins = [];
    this.info = {};
  };

  @action
  setCheckins = (data) => {
    this.info = data;

    this.checkins = [...data.checkins];
  };

  fetchCheckins = (scb) =>
    httpGet(`${baseUrl}/${this.courseId}/checkins`)
      .then(scb);

  getCheckins = () => {
    this.fetchCheckins(this.setCheckins);
  };

  @computed
  get checkinState() {
    return this.info.canCheckin && !this.info.hasCheckin;
  }
}

export default new CheckinList();


