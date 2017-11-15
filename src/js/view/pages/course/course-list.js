'use strict';

import React, { Component } from "react";
import { browserHistory, Link } from "react-router";
import { observer, inject } from "mobx-react";
import WeUI from "react-weui";

import _ from "../../util";
import BottomTabBar from "../bottomTabBar";
import UbandHeader from "../ubandHeader";

const {
  Flex,
  FlexItem,
  Tab,
  TabBody,
  NavBar,
  NavBarItem
} = WeUI;

@inject("CourseList") @observer
class List extends Component {
  constructor(props) {
    super(props);

    this.list = this.props.CourseList;

    this.list.setCurrentPanel(this.props.location.query.status);
  }

  componentDidMount() {
    const { isLoaded, getList } = this.list;

    // 仅当数据未加载时才获取列表数据
    if (isLoaded === false) {
      getList();
    }
  }

  componentWillUnmount() {
    const { setCurrentPanel, PANEL } = this.list;

    setCurrentPanel(PANEL.PROCESSING);
  }

  render() {
    const { PANEL, currentPanel, processList, closeList, setCurrentPanel } = this.list;

    const courseList = currentPanel === PANEL.PROCESSING ? processList : closeList;

    return (
      <div className="page page-current course-page">
        <UbandHeader/>
        <div className="content">
          <Tab>
            <NavBar>
              <NavBarItem active={currentPanel === PANEL.PROCESSING}
                          onClick={() => setCurrentPanel(PANEL.PROCESSING)}>进行中</NavBarItem>
              <NavBarItem active={currentPanel === PANEL.CLOSE}
                          onClick={() => setCurrentPanel(PANEL.CLOSE)}>已结束</NavBarItem>
              <NavBarItem><Link to="/enroll/list">去选课</Link></NavBarItem>
            </NavBar>
            <TabBody className="course-item-list p-b-xxl">
              {
                _.chunk(courseList, 2)
                  .map((courses) => {
                    const key = courses.map((item) => item.id).join("-");
                    
                    return (
                      <Flex key={key}>
                        {
                          courses.map((item) => (
                            <FlexItem className="course-item-container" key={item.id} id={item.id}>
                              <div className="course-item" onClick={e => browserHistory.push(item.redirectUrl)}>
                                <div className="course-avatar">
                                  <img src={item.banner}/>
                                </div>
                                <div className="course-title text-overflow-hidden">
                                  {item.name}
                                </div>
                              </div>
                            </FlexItem>
                          ))
                        }
                      </Flex>
                    )
                  })
              }
            </TabBody>
          </Tab>
        </div>
        <BottomTabBar currentTab="course-list"/>
      </div>
    )
  }
}

export default List;
