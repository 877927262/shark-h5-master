"use strict";

/**
 * 1. 页面入口
 * 2. 定义页面路由
 */
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { Router, Route, IndexRedirect, browserHistory, Redirect } from "react-router";

import "weui";
import "react-weui/lib/react-weui.min.css";

import "../../style/icons.scss";
import "../../style/reset.scss";

import store from "../store/main";

import Me from "./pages/me/me";
import Index from "./pages/me/index";
import Profile from "./pages/me/profile";
import Coin from "./pages/me/coin";
import Withdraw from "./pages/me/withdraw";
import Ticket from "./pages/me/ticket";
import Password from "./pages/me/password";
import Setting from "./pages/me/setting";
import SettingConfig from "./pages/me/setting-config";
import ClazzExit from "./pages/me/clazz-exit";

import CourseIndex from "./pages/course/index";
import CourseList from "./pages/course/course-list";
import CourseItem from "./pages/course/course-item";
import CourseDetail from "./pages/course/course/course-detail";
import CheckinDetail from "./pages/course/checkin/checkin-detail";
import CheckinCenter from "./pages/course/checkin/checkin-center";
import TaskDetail from "./pages/course/task/task-detail";
import TaskDetailPublic from "./pages/course/task/task-detail-public";
import LeadOne from "./pages/course/one";
import StudentPage from "./pages/course/one/student";
import ChatPage from "./pages/course/one/chat";
import MaterialPage from "./pages/course/one/material";
import MaterialDetailPage from "./pages/course/one/material-detail";

import Enroll from "./pages/enroll";
import EnrollListPage from "./pages/enroll/list";
import EnrollDetailPage from "./pages/enroll/detail";
import EnrollPayPage from "./pages/enroll/pay";
import EnrollPaySuccessPage from "./pages/enroll/pay/success";

import Game from './pages/game/index';

import GameMcIndexPage from './pages/game/mc/index';
import GameMcJoinPage from './pages/game/mc/join';
import GameMcRoomPage from './pages/game/mc/room';
import GameMcSharePage from './pages/game/mc/share';

import Auth from "./pages/auth";
import NotFound from "./pages/notFound";
import SubscribeGuide from "./pages/subscribeGuide";
import RedirectPage from "./pages/redirect";

import Activity from "./pages/activity/activity";
import ActivityList from "./pages/activity/activity-list";
import ActivityDetails from "./pages/activity/activity-detail";
import ActivityEnroll from "./pages/activity/activity-enroll";

import Teacher from "./pages/teacher/teacher";
import TeacherListPage from "./pages/teacher/teacher-list";
import TeacherDetailPage from "./pages/teacher/teacher-detail";

import Promotion from "./pages/promotion";
import PromotionHome from "./pages/promotion/home";
import PromotionInviteeList from "./pages/promotion/invitee/list";
import PromotionInviteeDetail from "./pages/promotion/invitee/detail";
import PromotionIncome from "./pages/promotion/income/index";
import PromotionIncomeList from "./pages/promotion/income/list";
import PromotionShare from "./pages/promotion/share";
import PromotionRecommend from "./pages/promotion/recommend";
import PromotionHelp from "./pages/promotion/help";

import InteractiveGuidePage from "./pages/guide/interactive-guide";

/**
 * React Router Hash Link Scroll
 * source: https://github.com/rafrex/react-router-hash-link/tree/react-router-v2/3
 */
const hashLinkScroll = () => {
  const { hash } = window.location;
  if (hash !== '') {
    // Push onto callback queue so it runs after the DOM is updated,
    // this is required when navigating from a different page so that
    // the element is rendered on the page before trying to getElementById.
    setTimeout(() => {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) element.scrollIntoView();
    }, 0);
  }
};

// 存放全局初始地址
localStorage.originUrl = `${ location.pathname }${ location.search }`;

ReactDOM.render((
    <Provider {...store}>
      <Router history={browserHistory} onUpdate={hashLinkScroll}>
        <Route path="/redirect" component={RedirectPage}/>
        <Route path="/course/:courseId/task/:taskId/public" component={TaskDetailPublic}/>
        <Route path="/promotion/:promoterUserId/share" component={PromotionShare}/>
        <Route path="/" component={Auth}>
          <IndexRedirect to="me/index"/>
          <Route path="me" component={Me}>
            <IndexRedirect to="index"/>
            <Route path="index" component={Index}/>
            <Route path="profile" component={Profile}/>
            <Route path="coin" component={Coin}/>
            <Route path="withdraw" component={Withdraw}/>
            <Route path="ticket" component={Ticket}/>
            <Route path="password" component={Password}/>
            <Route path="setting" component={Setting}/>
            <Route path="setting/:config/:value" component={SettingConfig}/>
            <Route path="setting/:config" component={SettingConfig}/>
            <Route path="clazzExit" component={ClazzExit}/>
          </Route>
          <Route path="enroll" component={Enroll}>
            <IndexRedirect to="list"/>
            <Route path="list" component={EnrollListPage}/>
            <Route path="pay/:courseId" component={EnrollPayPage}/>
            <Route path="pay/:courseId/success" component={EnrollPaySuccessPage}/>
            <Route path=":courseId" component={EnrollDetailPage}/>
          </Route>
          <Route path="course" component={CourseIndex}>
            <IndexRedirect to="list"/>
            <Route path="list" component={CourseList}/>
            <Route path="checkin/center" component={CheckinCenter}/>
            <Route path=":courseId" component={CourseItem}>
              <Route path="detail" component={CourseDetail}/>
              <Route path="checkin(/:checkinId)" component={CheckinDetail}/>
              <Route path="task/:taskId" component={TaskDetail}/>
              <Route path="one" component={LeadOne}>
                <Route path="student" component={StudentPage}/>
              </Route>
              <Route path="one/chat(/:feedbackId)" component={ChatPage}/>
              <Route path="one/material/:feedbackId" component={MaterialPage}/>
              <Route path="one/detail/:materialId" component={MaterialDetailPage}/>
            </Route>

            <Redirect from="detail/:courseId" to=":courseId/detail"/>
            <Redirect from="one/:courseId/student" to=":courseId/one/student"/>
            <Redirect from="one/:courseId/chat(/:feedbackId)" to=":courseId/one/chat(/:feedbackId)"/>
            <Redirect from="one/:courseId/material/:feedbackId" to=":courseId/one/material/:feedbackId"/>
            <Redirect from="one/:courseId/detail/:materialId" to=":courseId/one/detail/:materialId"/>
          </Route>
          <Route path="game" component={Game}>
            <IndexRedirect to="mc/index"/>
            <Route path="mc/index" component={GameMcIndexPage}/>
            <Route path="mc/join" component={GameMcJoinPage}/>
            <Route path="mc/room" component={GameMcRoomPage}/>
            <Route path="mc/share" component={GameMcSharePage}/>
          </Route>
          <Route path="activity" component={Activity}>
            <IndexRedirect to="list"/>
            <Route path="list" component={ActivityList}/>
            <Route path=":activityId" component={ActivityEnroll}/>
            <Route path=":activityId/user/:userId" component={ActivityDetails}/>
          </Route>
          <Route path="teacher" component={Teacher}>
            <IndexRedirect to="list"/>
            <Route path="list" component={TeacherListPage}/>
            <Route path=":teacherId" component={TeacherDetailPage}/>
          </Route>
          <Route path="promotion" component={Promotion}>
            <IndexRedirect to="home"/>
            <Route path="home" component={PromotionHome}/>
            <Route path="invitees" component={PromotionInviteeList}/>
            <Route path="invitee/:inviteeId" component={PromotionInviteeDetail}/>
            <Route path="income" component={PromotionIncome}/>
            <Route path="incomes" component={PromotionIncomeList}/>
            <Route path="recommend" component={PromotionRecommend}/>
            <Route path="help" component={PromotionHelp}/>
          </Route>
          <Route path="guide/chats" component={InteractiveGuidePage}/>
        </Route>
        <Route path="subscribe" component={SubscribeGuide}/>
        <Route path="*" component={NotFound}/>
      </Router>
    </Provider>),
  document.getElementById("content")
);
