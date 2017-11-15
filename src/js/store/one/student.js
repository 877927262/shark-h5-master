import {observable, useStrict, action, computed} from "mobx";

useStrict(true);

import util from "../util";
import Paginator from "../common/paginator";
import {httpGet} from "../../service";

const baseUrl = `${util.baseUrl}api/clazz`;

class Students {
  @observable showWaiting = util.get(sessionStorage, "SHARK_ONE_SHOW_WAITING", "true") === "true";
  @observable keyWord = util.get(sessionStorage, "SHARK_ONE_KEY_WORD", "");

  constructor(cid) {
    this.cid = cid;
    this.timer = null;
    this.all = new Paginator();
    this.wait = new Paginator();
  }

  fetchStudents = (pageNumber = 1, keyWord = "", pageSize = 13, showWaiting = this.showWaiting) => {
    return httpGet(`${baseUrl}/${this.cid}/feedbacks?pageNumber=${pageNumber}&pageSize=${pageSize}&keyWord=${keyWord}&isWaitingOnly=${showWaiting}`);
  };

  getStudents = () => {
    let {updateData, pageNumber} = this.showWaiting ? this.wait : this.all;
    this.fetchStudents(pageNumber, this.keyWord).then(updateData);
  };

  getInitialStudents = () => {
    let {updateData, resetValues} = this.showWaiting ? this.wait : this.all;
    resetValues();
    this.fetchStudents(1, this.keyWord).then(updateData);
  };

  @action
  cancelSearch = () => {
    // 保存搜索条件到sessionStorage
    sessionStorage.SHARK_ONE_KEY_WORD = this.keyWord = "";
    this.getInitialStudents();
  };

  @action
  toggleWait = () => {
    // 保存是否只显示未回复到sessionStorage
    sessionStorage.SHARK_ONE_SHOW_WAITING = this.showWaiting = !this.showWaiting;
    this.getStudents();
  };

  @computed
  get showingStudents() {
    return this.showWaiting ? this.wait.values : this.all.values;
  }

  @action
  setKeyword = (e) => {
    // 保存搜索条件到sessionStorage
    sessionStorage.SHARK_ONE_KEY_WORD =  this.keyWord = e.target.value;

    const getInitialStudents = this.getInitialStudents;

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      getInitialStudents();
    }, 1000);
  };

  hasMore = () => {
    return this.showWaiting ? this.wait.hasMore : this.all.hasMore;
  }
}

export default Students;
