/**
 * Created by violinsolo on 20/07/2017.
 */
'use strict';

import { observable, useStrict, action } from "mobx";

import util from "../util";
import WechatShare from "../common/wechatShare";
const baseUrl = `${util.baseUrl}api`;
import { httpGet } from "../../service";

useStrict(true);

export default class TeacherList {
  @observable
  teacherList = []; // 笃师的列表

  /**
   * action 更新笃师列表
   * @param teacherList
   */
  @action
  setTeachers = (teacherList) => {
    this.teacherList = teacherList.values;

    this.wechatShare = new WechatShare(
      "报告！友班笃师们在向你招手",
      "推荐一大波牛人给你认识～来友班，和牛人做朋友！",
      `${ location.origin }/redirect?target=/teacher/`,
      "http://qiniuprivate.gambition.cn/rgHxWu_uband_logo.png"
    );
  };

  fetchList = () => httpGet(`${baseUrl}/clazzTeachers?pageSize=1000`);//TODO: Hard Code, 以后改成下拉刷新的
}
