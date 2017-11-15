import {observable, useStrict, action} from "mobx";

import {httpGet} from "../../service";
import util, {curry} from "../util";
const baseUrl = `${util.baseUrl}api`;


useStrict(true);

class CheckinCenter {
  @observable courseList = [];

  @action
  setCourseList = (data) => {
    this.courseList = data;
  };

  fetchList = () =>
    httpGet(`${baseUrl}/clazzes?status=PROCESSING&isCheckinable=true`)

  getList = () => {
    this.fetchList()
      .then((courseList) => this.setCourseList(courseList));
  }
}

export default CheckinCenter;
