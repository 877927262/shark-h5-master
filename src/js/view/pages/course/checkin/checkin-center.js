import React, { Component } from "react";
import { Link } from "react-router";
import { observer, inject } from "mobx-react";

import WeUI from "react-weui";
import EmptyTip from "../../../EmptyTip";
import "../../../../../style/checkin-center.scss";

const {
  Cells,
  Cell,
  CellHeader,
  CellBody,
  Badge
} = WeUI;

@inject("CheckinCenter") @observer
class CheckinCenter extends Component {
  constructor(props) {
    super(props);

    this.center = new this.props.CheckinCenter();
  }

  componentDidMount() {
    this.center.getList()
  }

  render() {
    return (
      <div className="page page-current checkin-center-page">
        <header className="bar bar-nav">
          <h1 className="title">打卡中心</h1>
        </header>
        <div className="content">
          <Cells className="m-t-none">
            {
              this.center.courseList.length > 0
                ? this.center.courseList.map(item => (
                  <Cell className="course-list-cell" component={Link}
                        to={`/course/${ item.id }/detail?tabIndex=1`}
                        key={item.id}>
                    <CellHeader>
                      <div className="course-cover">
                        <img src={item.banner}/>
                      </div>
                    </CellHeader>
                    <CellBody>
                      <div className="course-title">
                        {item.name}
                      </div>
                      <div className="checkin-center-course-desc">
                        <div className="course-desc course-desc-flexible">
                          {item.description}
                        </div>
                        <Badge dot preset="footer" className={`indicator ${item.hasCheckin ? "icon-has-checkin": "icon-not-checkin"}`}/>
                      </div>
                    </CellBody>
                  </Cell>
                ))
                : <EmptyTip tip="打卡中心为空？可能你还没有报名课程哦～"/>
            }
          </Cells>
        </div>
      </div>
    )
  }
}

export default CheckinCenter;
