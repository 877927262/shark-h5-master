/**
 * Created by violinsolo on 20/07/2017.
 */
'use strict';

import React, { Component } from "react";
import { browserHistory, Link } from "react-router";
import { observer, inject } from "mobx-react";
import WeUI from "react-weui";
import EmptyTip from "../../EmptyTip";
import commonUtil from '../../../common-util';
import _ from '../../util';
import { clazzJoinTypeEnum } from "../../enum";

const {
  Button,
  Tab,
  TabBody,
  NavBar,
  NavBarItem,
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellFooter,
  Badge
} = WeUI;

@inject("TeacherDetail") @observer
export default class TeacherDetailPage extends Component {
  constructor(props) {
    super(props);

    const { teacherId } = this.props.params;

    this.teacherDetail = new this.props.TeacherDetail(teacherId);

  }

  onFollowTeacher = () => {
    const { processFollowingTeacherAction, toast, teacherBasicInfo} = this.teacherDetail;

    processFollowingTeacherAction().then(() => {
      toast.showToast({
        text: `已成功关注笃师${teacherBasicInfo.name}！将第一时间收到她的开课提示`,
        icon: "success-no-circle"
      });
      this.fetchAndSetTeacherBasicInfoData();
    });
  };

  // using to render main page
  fetchAndSetTeacherBasicInfoData = () => {
    const { fetchTeacherBasicInfo, setTeacherBasicInfo } = this.teacherDetail;
    fetchTeacherBasicInfo().then(setTeacherBasicInfo);
  };

  onViewCourseTabAction = () => {
    const { setCurrentTab, setBadgeVisible, TAB_INDEX } = this.teacherDetail;

    setCurrentTab(TAB_INDEX.COURSE);
    setBadgeVisible(false);
  };

  componentDidMount() {
    this.fetchAndSetTeacherBasicInfoData();

    const {
      fetchTeacherMeatySharings, setTeacherMeatySharings, fetchTeacherCommends, setTeacherCommends,
      fetchTeacherClazzOpen, setTeacherClazzOpen, fetchTeacherClazzClose, setTeacherClazzClose
    } = this.teacherDetail;

    // using to render real-stuff sharings page
    fetchTeacherMeatySharings().then(setTeacherMeatySharings);
    // using to render commends page
    fetchTeacherCommends().then(setTeacherCommends);

    fetchTeacherClazzOpen().then(setTeacherClazzOpen);
    fetchTeacherClazzClose().then(setTeacherClazzClose);
  }

  render() {
    const {
      teacherBasicInfo, teacherMeatySharings, teacherCommends, teacherClazzOpen, teacherClazzClose,
      currentTabIndex, TAB_INDEX, isBadgeVisible,
      setCurrentTab
    } = this.teacherDetail;

    const openClazzCount = _.get(teacherClazzOpen, 'length', 0);

    return (
      <div className="teacher-page">
        <div className="content teacher-detail">

          <div className="teacher-detail-header">
            <a className="icon icon-left back-btn" onClick={() => browserHistory.replace('/teacher/list')}/>
            <Button className="follow-btn" type="primary"
                    disabled={teacherBasicInfo.isCurrentUserFollowed}
                    onClick={this.onFollowTeacher}>
              {teacherBasicInfo.isCurrentUserFollowed ? '已关注' : '关注'}
            </Button>

            <img className="teacher-detail-header-banner"
                 src={teacherBasicInfo.backgroundUrl}
                 alt="..."/>

            <div className="teacher-detail-header-teacher-info-box">
              <div className="avatar-wrap">
                <img src={teacherBasicInfo.headImgUrl}/>

                <div className="info-wrap">
                  <span className="teacher-name text-overflow-hidden">{teacherBasicInfo.name}</span>
                  <div className="teacher-social-info">
                    <span>关注 {teacherBasicInfo.followUserCount}</span>
                    <span>  |  </span>
                    <span>学生 {teacherBasicInfo.clazzStudentCount}</span>
                  </div>
                  <span className="teacher-desc text-overflow-hidden">{teacherBasicInfo.description}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="teacher-detail-content">
            <Tab>
              <NavBar className="teacher-detail-content-navbar">
                <NavBarItem active={currentTabIndex === TAB_INDEX.BASIC_INFO}
                            onClick={e => setCurrentTab(TAB_INDEX.BASIC_INFO)}>笃师简介</NavBarItem>
                <NavBarItem active={currentTabIndex === TAB_INDEX.MEATY_SHARE}
                            onClick={e => setCurrentTab(TAB_INDEX.MEATY_SHARE)}>干货分享</NavBarItem>
                <NavBarItem active={currentTabIndex === TAB_INDEX.COMMEDNS}
                            onClick={e => setCurrentTab(TAB_INDEX.COMMEDNS)}>笃友评价</NavBarItem>
                <NavBarItem active={currentTabIndex === TAB_INDEX.COURSE}
                            onClick={this.onViewCourseTabAction}>
                  开设课程
                  {
                    (openClazzCount > 0 && isBadgeVisible === true)
                      ? <Badge className="clazz-open-badge">{openClazzCount}</Badge>
                      : null
                  }
                </NavBarItem>
              </NavBar>
              <TabBody className="teacher-detail-content-navcontent">
                {
                  (() => {
                    switch (currentTabIndex) {
                      case TAB_INDEX.MEATY_SHARE:
                        // 干货分享
                        return <div className="nav-teacher-meaty-sharings-wrap">
                          <Cells className="nav-teacher-meaty-sharings-cells m-t-none">
                            {
                              (_.get(teacherMeatySharings, 'length', 0) > 0)
                                ? teacherMeatySharings.map((realStuffSharingItem) => {
                                  return <Cell className="nav-teacher-meaty-sharings-cell"
                                               component={Link} to={`/redirect?target=${ realStuffSharingItem.url }`}
                                               key={realStuffSharingItem.id}>
                                    <CellBody className="cell-body-all text-overflow-hidden">
                                      <div className="cell-body-wrap">
                                        <span className="sharing-name">{realStuffSharingItem.name}</span>
                                        <span
                                          className="sharing-time">{commonUtil.format(realStuffSharingItem.shareAt ? new Date(realStuffSharingItem.shareAt) : new Date(), 'yyyy/MM')}</span>
                                      </div>
                                    </CellBody>
                                    <CellFooter className="cell-footer-all">
                                      <div className="cell-footer-wrap">
                                        <i className="icon-gb icon-gb-has-read"/>
                                        <span className="read-count">{realStuffSharingItem.readCount}</span>
                                      </div>
                                    </CellFooter>
                                  </Cell>
                                })
                                : <EmptyTip tip="空空如也"/>
                            }
                          </Cells>
                        </div>;
                      case TAB_INDEX.COMMEDNS:
                        // 笃友评价
                        return <div className="nav-teacher-commends-wrap">
                          <span className="nav-teacher-commends-hint">只有上过课的同学才能进行评价哦～</span>
                          <div className="nav-teacher-commends">
                            <div className="commend-list">
                              {
                                (_.get(teacherCommends, 'length', 0) > 0)
                                  ? teacherCommends.map(item => {
                                    return <div className="commend-item" key={item.id}>
                                      <div className="commend-avatar">
                                        <img src={item.userInfo.headImgUrl}/>
                                      </div>
                                      <div className="commend-content-wrap">
                                        <div className="commend-user">
                                          <span className="user-info">{item.userInfo.name}
                                            - {item.userInfo.studentNumber}</span>
                                          <span className="clazz-info">{item.clazzName}</span>
                                        </div>
                                        <div className="commend-content">
                                          {item.commend}
                                        </div>
                                      </div>
                                    </div>
                                  })
                                  : <EmptyTip tip="空空如也"/>
                              }
                            </div>
                          </div>
                        </div>;
                      case TAB_INDEX.COURSE:
                        // 开设课程
                        return <div className="nav-teacher-clazzes-wrap">
                          <Cells className="m-t-none teacher-course-list">
                            {
                              (() => {
                                if ((openClazzCount === 0) && (_.get(teacherClazzClose, 'length', 0) === 0)) {
                                  return <EmptyTip tip="空空如也"/>
                                } else {
                                  let resultClazzOpen = [], resultClazzClose = [];
                                  if (openClazzCount > 0) {
                                    resultClazzOpen = teacherClazzOpen.map((item, idx) => {
                                      return <Cell className="teacher-course-cell" component={Link}
                                                   to={`/redirect?target=/enroll/${item.id}`} key={item.id}>
                                        <CellHeader>
                                          <div className="course-cover">
                                            <img src={item.banner}/>
                                          </div>
                                        </CellHeader>
                                        <CellBody className="course-info">
                                          <div className="course-title text-overflow-hidden">
                                            {item.name}
                                            | {_.get(clazzJoinTypeEnum, `${item.clazzJoinType}.name`, '友班课程')}
                                          </div>
                                          <div className="course-extra text-overflow-hidden">
                                        <span className="course-desc">报名人数   <span
                                          className="course-student-num">{item.studentCount}</span></span>
                                          </div>
                                        </CellBody>
                                        <CellFooter>
                                          <div className="course-status">
                                            <i className="icon-gb icon-gb-tag-open"/>
                                          </div>
                                        </CellFooter>
                                      </Cell>
                                    })
                                  }

                                  if (_.get(teacherClazzClose, 'length', 0) > 0) {
                                    resultClazzClose = teacherClazzClose.map((item, idx) => {
                                      return <Cell className="teacher-course-cell" key={item.id}>
                                        <CellHeader>
                                          <div className="course-cover">
                                            <img src={item.banner}/>
                                          </div>
                                        </CellHeader>
                                        <CellBody className="course-info">
                                          <div className="course-title text-overflow-hidden">
                                            {item.name}
                                            | {_.get(clazzJoinTypeEnum, `${item.clazzJoinType}.name`, '友班课程')}
                                          </div>
                                          <div className="course-extra text-overflow-hidden">
                                        <span className="course-desc">报名人数   <span
                                          className="course-student-num">{item.studentCount}</span></span>
                                          </div>
                                        </CellBody>
                                        <CellFooter>
                                          <div className="course-status">
                                            <i className="icon-gb icon-gb-tag-close"/>
                                          </div>
                                        </CellFooter>
                                      </Cell>
                                    })
                                  }

                                  return resultClazzOpen.concat(resultClazzClose);
                                }
                              })()
                            }
                          </Cells>
                        </div>;
                      case TAB_INDEX.BASIC_INFO:
                      default:
                        // 笃师简介
                        return <div className="nav-teacher-introduction-wrap">
                          <div className="nav-teacher-introduction-content">
                            <div dangerouslySetInnerHTML={{ __html: `${teacherBasicInfo.introduction}` }}/>
                          </div>
                        </div>

                    }
                  })()
                }
              </TabBody>
            </Tab>
          </div>
        </div>
      </div>
    );
  }
}

