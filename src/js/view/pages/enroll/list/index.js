'use strict';

import React, { Component } from "react";
import ReactSwipe from "react-swipe";
import { observer, inject, PropTypes } from "mobx-react";
import {Link} from "react-router";
import WeUI from "react-weui";

import BottomTabBar from "../../bottomTabBar";
import UbandHeader from "../../ubandHeader";
import _  from '../../../util';
import { clazzJoinTypeEnum } from "../../../enum";

import "../../../../../style/enroll.scss";

const {
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellFooter
} = WeUI;

@inject("EnrollList") @observer
class EnrollListPage extends Component {
  constructor(props) {
    super(props);

    this.enrollList = new this.props.EnrollList();
  }

  componentDidMount() {
    this.enrollList.fetchList(data => this.enrollList.setCourses(data));
  }

  render() {
    return (
      <div className="enroll-page">
        <UbandHeader/>
        {/*<ReactSwipe className="carousel" swipeOptions={swipeOptions}>*/}
          {/*<div>PANE 1</div>*/}
          {/*<div>PANE 2</div>*/}
          {/*<div>PANE 3</div>*/}
        {/*</ReactSwipe>*/}
        <div className="content enroll-list">
          <Cells className="m-t-none enroll-course-list">
            {
              this.enrollList.list.map((item) => {
                return <Cell className="enroll-course-cell" component={Link} to={"/enroll/" + item.id} key={item.id}>
                  <CellHeader>
                    <div className="course-cover">
                      <img src={item.banner}/>
                    </div>
                  </CellHeader>
                  <CellBody className="course-info">
                    <div className="course-title">
                      {item.name} | {_.get(clazzJoinTypeEnum, `${item.clazzJoinType}.name`, '友班课程')}
                    </div>
                    <div className="course-extra">
                      <span className="course-author">{item.author}</span>
                      <span className="course-desc">{item.description}</span>
                    </div>
                  </CellBody>
                  <CellFooter/>
                </Cell>
              })
            }
          </Cells>
        </div>
        <BottomTabBar currentTab="enroll-list"/>
      </div>
    );
  }
}

EnrollListPage.propTypes = {
  EnrollList: PropTypes.observableObject
};

// const swipeOptions = {
//   startSlide: 0,
//   speed: 500,
//   auto: 3000,
//   continuous: true,
//   disableScroll: false,
//   stopPropagation: true,
// };

export default EnrollListPage;
