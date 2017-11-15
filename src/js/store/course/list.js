'use strict';

import { observable, useStrict, action } from "mobx";

import util from "../util";
import { httpGet } from "../../service";

const baseUrl = `${util.baseUrl}api`;

useStrict(true);

class CourseList {
  @observable processList = [];
  @observable closeList = [];
  @observable currentPanel = this.PANEL.PROCESSING;

  constructor() {
    this.PANEL = {
      PROCESSING: 'PROCESSING',
      CLOSE: 'CLOSE'
    };

    // 是否加载数据标识
    this.isLoaded = false
  }

  markReloadFlag = () => {
    this.isLoaded = false;
  };

  getList = () => {
    this._fetchList("PROCESSING").then((data) => this._setListData(this.processList, data));
    this._fetchList("CLOSE").then((data) => this._setListData(this.closeList, data));

    this.isLoaded = true;
  };

  @action
  setCurrentPanel = (currentPanel) => {
    const panel = util.get(this.PANEL, currentPanel, null);

    if (panel != null) {
      this.currentPanel = panel;
    }
  };

  @action
  _setListData = (container, data) => {
    container.splice(0, container.length);

    data.forEach((item) => {
      item.redirectUrl = `/course/${ item.id }/detail`;

      container.push(item);
    });
  };

  _fetchList = (status) => httpGet(`${baseUrl}/clazzes?status=${status}`);
}

export default new CourseList();
