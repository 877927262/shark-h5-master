import {observable, useStrict, action} from "mobx";

import util from "../util";
const baseUrl = `${util.baseUrl}api`;
import {httpGet} from "../../service";

useStrict(true);

class EnrollList {
  @observable list = [];

  @action
  setCourses(list) {
    this.list = list;
  }

  fetchList = (scb) => {
    httpGet(`${baseUrl}/clazzes?status=OPEN`)
      .then(scb);
  }
}

export default EnrollList;