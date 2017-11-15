'use strict';

import { observable, useStrict, action, computed } from "mobx";

import util from "../util";

useStrict(true);

class CourseDetail {
  @observable
  tabIndex = this.TAB_INDEX.COURSE_STUDY;

  constructor() {
    this.TAB_INDEX = {
      COURSE_STUDY: 'COURSE_STUDY',
      CHECKIN_LIST: 'CHECKIN_LIST'
    };
  }

  @computed
  get currentTabIndex() {
    return this.tabIndex;
  }

  @action
  setTabIndex = (tabIndex) => {
    const targetTabIndex = util.get(this.TAB_INDEX, tabIndex, null);

    if (targetTabIndex != null) {
      this.tabIndex = targetTabIndex;
    }
  }
}

export default CourseDetail;
