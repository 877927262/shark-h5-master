"use strict";

import React, { Component } from "react";
import { browserHistory } from "react-router";
import WeUI from "react-weui";

const {
  Tab,
  TabBar,
  TabBarItem
} = WeUI;

class BottomTabBar extends Component {
  _tabBarList = [
    {
      key: "course-list",
      labelName: "友学习",
      iconName: "icon-gb-tab-course-list",
      activeIconName: "icon-gb-tab-course-list-active",
      urlRedirect: "/course/list"
    },
    {
      key: "enroll-list",
      labelName: "去选课",
      iconName: "icon-gb-tab-enroll-list",
      activeIconName: "icon-gb-tab-enroll-list-active",
      urlRedirect: "/enroll/list"
    },
    {
      key: "teacher-list",
      labelName: "看笃师",
      iconName: "icon-gb-tab-teacher-list",
      activeIconName: "icon-gb-tab-teacher-list-active",
      urlRedirect: "/teacher/list"
    },
    {
      key: "me",
      labelName: "个人库",
      iconName: "icon-gb-tab-me",
      activeIconName: "icon-gb-tab-me-active",
      urlRedirect: "/me/index"
    }
  ];

  render() {
    const { currentTab } = this.props;

    return (
      <nav className="bar bar-tab">
        <Tab>
          <TabBar>
            {
              this._tabBarList && this._tabBarList.map(
                (tabBar) => {
                  const isCurrent = currentTab === tabBar.key;

                  return <TabBarItem
                    key={tabBar.key}
                    label={tabBar.labelName}
                    icon={<i className={`icon-gb ${isCurrent ? tabBar.activeIconName : tabBar.iconName}`}/>}
                    onClick={() => {
                      if (isCurrent === false && tabBar.urlRedirect != null) {
                        browserHistory.push(tabBar.urlRedirect);
                      }
                    }}>
                  </TabBarItem>;
                }
              )
            }
          </TabBar>
        </Tab>
      </nav>
    );

  }

}

export default BottomTabBar
