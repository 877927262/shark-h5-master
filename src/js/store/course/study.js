'use strict';

import { observable, useStrict, action, computed } from "mobx";
import util from "../util";

useStrict(true);

const baseUrl = `${util.baseUrl}api`;

class CourseStudy {
  @observable
  currentPanel = this.PANEL.taskPanel;

  constructor(courseId) {
    this.courseId = courseId;

    this.PANEL = {
      taskPanel: 'taskPanel',
      rankPanel: 'rankPanel'
    };
  }

  @action
  setCurrentPanel = (panel) => {
    const currentPanel = util.get(this.PANEL, panel, null);

    if (currentPanel != null) {
      this.currentPanel = currentPanel;
    }
  };

  @computed
  get currentDetailPanel() {
    return this.currentPanel;
  }
}

export default CourseStudy;
