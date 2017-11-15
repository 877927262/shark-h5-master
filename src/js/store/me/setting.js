"use strict";

import { observable, useStrict, action } from "mobx";
import util from "../util";
import { httpGet, httpPut } from "../../service";
import uniqueToast from "../common/httpToast";

useStrict(true);

const baseUrl = `${util.baseUrl}api/account`;

class Setting {
  @observable setting = {};
  @observable
  showTimeZonePicker = false;

  timeZoneGroup = [
    {
      items: [
        {
          key: "UTC-12",
          label: "马朱罗-西十二区"
        },
        {
          key: "UTC-11",
          label: "中途岛-西十一区"
        },
        {
          key: "UTC-10",
          label: "檀香山-西十区"
        },
        {
          key: "UTC-9",
          label: "朱诺-西九区"
        },
        {
          key: "UTC-8",
          label: "洛杉矶-西八区"
        },
        {
          key: "UTC-7",
          label: "盐湖城-西七区"
        },
        {
          key: "UTC-6",
          label: "墨西哥城-西六区"
        },
        {
          key: "UTC-5",
          label: "纽约-西五区"
        },
        {
          key: "UTC-4",
          label: "加拉加斯-西四区"
        },
        {
          key: "UTC-3",
          label: "巴西利亚-西三区"
        },
        {
          key: "UTC-2",
          label: "华盛顿-西二区"
        },
        {
          key: "UTC-1",
          label: "达塔德尔加达-西一区"
        },
        {
          key: 'UTC',
          label: '格林威治标准时间'
        },
        {
          key: "UTC+1",
          label: "柏林-东一区"
        },
        {
          key: "UTC+2",
          label: "雅典-东二区"
        },
        {
          key: "UTC+3",
          label: "莫斯科-东三区"
        },
        {
          key: "UTC+4",
          label: "阿布扎比-东四区"
        },
        {
          key: "UTC+5",
          label: "伊斯兰堡-东五区"
        },
        {
          key: "UTC+6",
          label: "达卡-东六区"
        },
        {
          key: "UTC+7",
          label: "曼谷-东七区"
        },
        {
          key: "UTC+8",
          label: "北京-东八区"
        },
        {
          key: "UTC+9",
          label: "东京-东九区"
        },
        {
          key: "UTC+10",
          label: "堪培拉-东十区"
        },
        {
          key: "UTC+11",
          label: "霍尼亚拉-东十一区"
        },
        {
          key: "UTC+12",
          label: "惠灵顿-东十二区"
        }
      ]
    }
  ];

  constructor() {
  }

  @action
  clickInput = (e) => {
    this.showTimeZonePicker = true;
  };

  @action
  changeTimeZone = (selected) => {
    let value = "";
    selected.forEach((s, i) => {
      value = this.timeZoneGroup[i]["items"][s].key
    });
    this.setting.timezone = value;
    this.showTimeZonePicker = false
  };

  @action
  cancelTimeZone = () => {
    this.showTimeZonePicker = false;
  };

  saveTimeZone = (cb) => (selected) => {
    this.changeTimeZone(selected);
    httpPut(
      `${baseUrl}/privacy`,
      {
        timezone: this.setting.timezone
      })
      .then(cb);
  };

  bindToastWithAction = () => this.saveTimeZone = this.saveTimeZone(this.actionToast);

  actionToast = (resBody) => {
    if (resBody === true) {
      uniqueToast.showToast({ text: "操作成功", icon: "success" });
    } else {
      uniqueToast.showToast({ text: "操作失败", icon: "warn" });
    }
  };

  fetchInfo = (scb) =>
    httpGet(`${baseUrl}/privacy`)
      .then(scb);

  setInfo = () => this.fetchInfo(action((data) => {
    this.setting = data;
  }));
}

export default Setting;
