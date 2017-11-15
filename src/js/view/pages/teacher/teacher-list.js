'use strict';

import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Link } from "react-router";
import WeUI from "react-weui";
import UbandHeader from "../ubandHeader";
import BottomTabBar from "../bottomTabBar";
import EmptyTip from "../../EmptyTip";
import _  from '../../util';
import { genderEnum } from "../../enum";

const {
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellFooter
} = WeUI;

@inject("TeacherList") @observer
export default class TeacherListPage extends Component {
  constructor(props) {
    super(props);

    this.teacherList = new this.props.TeacherList();
  }

  componentDidMount() {
    const { fetchList, setTeachers } = this.teacherList;

    // fetch teacher list
    fetchList().then(setTeachers);
  }

  render() {
    const { teacherList } = this.teacherList;

    return (
      <div className="teacher-page">
        <UbandHeader/>
        <div className="teacher-classification">全部 | 口译 | 编程</div>

        <div className="content">

          <Cells className="m-t-none teacher-list">
            {
              (_.get(teacherList, 'length', 0) > 0)
              ? teacherList.map((item) => {
                const { id, name, headImgUrl, description, followUserCount, clazzStudentCount, gender, tags } = item;

                return <Cell className="teacher-cell" component={Link} to={`/redirect?target=/teacher/${ id }`} key={ id }>
                  <CellHeader>
                    <div className="avatar-wrap">
                      <img src={headImgUrl}/>
                    </div>
                  </CellHeader>
                  <CellBody className="teacher-info">
                    <div className="teacher-header">
                      <span className="teacher-name long-text-should-ellipsis">{name}</span>
                      <span className="header-text-hint long-text-should-ellipsis header-text-hint-gap ">关注 {followUserCount}</span>
                      <span className="header-text-hint long-text-should-ellipsis">学生 {clazzStudentCount}</span>
                    </div>
                    <div className="teacher-desc text-overflow-hidden">
                      {description}
                    </div>
                    <div className="teacher-label text-overflow-hidden">
                      {
                        tags.map((tagItem) => {
                          return <span className={`badge label-${(_.get(genderEnum, gender, '0')).key}`} key={ id + tagItem }>{tagItem}</span>
                        })
                      }
                    </div>
                  </CellBody>
                  <CellFooter>
                  </CellFooter>
                </Cell>
              })
              : <EmptyTip tip="空空如也"/>
            }
          </Cells>
        </div>
        <BottomTabBar currentTab="teacher-list"/>
      </div>
    );
  }
}
