'use strict';

import User from "./me/user";
import Modal from "./common/modal";
import EnrollList from "./enroll/list";
import EnrollDetail from "./enroll/detail";
import Pay from "./enroll/pay";
import CourseList from "./course/list";
import CourseStudy from "./course/study";
import TaskList from "./task/list";
import RankList from "./rank/list";
import TaskDetail from "./task/detail";
import CheckinCenter from "./checkin/center";
import CheckinList from "./checkin/list";
import CheckinDetail from "./checkin/detail";
import Promotion from "./promotion/index";
import Password from "./me/password";
import Setting from "./me/setting";
import Coin from "./me/coin";
import Coupon from "./me/coupon";
import SettingConfig from "./me/setting.config";
import Students from "./one/student";
import Chat from "./one/chat";
import Auth from "./auth";
import Materials from "./one/material";
import WithDraw from "./me/withdraw";
import Record from "./one/record";
import Passport from './me/passport';
import MorningCall from './game/mc';
import ActivityList from './activity/list';
import ActivityEnroll from './activity/enroll';
import ActivityDetail from './activity/detail';
import TeacherList from './teacher/list';
import TeacherDetail from './teacher/detail';
import GuideChat from "./guide/chat";
import CommonAudioStore from "./common/audio";
import CourseDetail from "./course/detail";
import ClazzExit from "./me/clazz-exit";
import SystemConfig from "./system/config";

const store = {
  User,
  Modal,
  EnrollList,
  EnrollDetail,
  Pay,
  CourseList,
  CourseDetail,
  CourseStudy,
  TaskList,
  RankList,
  TaskDetail,
  CheckinCenter,
  CheckinList,
  CheckinDetail,
  Promotion,
  Password,
  Setting,
  Coin,
  Coupon,
  SettingConfig,
  Students,
  Chat,
  Auth,
  Materials,
  WithDraw,
  Record,
  Passport,
  MorningCall,
  ActivityList,
  ActivityEnroll,
  ActivityDetail,
  TeacherList,
  TeacherDetail,
  GuideChat,
  CommonAudioStore,
  ClazzExit,
  SystemConfig
};

export default store;
