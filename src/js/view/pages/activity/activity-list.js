'use strict';

import React, { Component } from "react";
import { observer, inject  } from "mobx-react";
import { Link } from "react-router";
import WeUI from "react-weui";
import UbandHeader from "../ubandHeader";
import IMAGE_URL_MAP from "../../BigImageUrl";

const {
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellFooter
} = WeUI;

import _  from '../../util';
import commonUtil from '../../../common-util';
import { clazzStatusEnum } from "../../enum";

@inject("ActivityList") @observer
export default class ActivityListPage extends Component {
  constructor(props) {
    super(props);

    this.activityList = new this.props.ActivityList();
  }

  componentDidMount() {
    const { fetchList, setActivities } = this.activityList;

    fetchList().then(setActivities);
  }

  render() {
    const { activityList } = this.activityList;
    return (
      <div className="activity-page">
        <UbandHeader/>

        <div className="content margin-head">
          <div className="top-banner">
            <img src={IMAGE_URL_MAP["ACTIVITY_TITLE"]}/>
          </div>

          <Cells className="m-t-none activity-list">
            {
              activityList.map((item) => {
                const { status, id } = item;

                return <Cell className="activity-cell" component={Link} to={`/redirect?target=/activity/${ id }`} key={ id }>
                  <CellHeader>
                    <div className="activity-cover">
                      <img src={item.banner}/>
                    </div>
                  </CellHeader>
                  <CellBody className="activity-info">
                    <div className="activity-title">
                      {item.name}
                    </div>
                    <div className="activity-extra">
                      <span className="activity-date">
                        {commonUtil.format(new Date(item.startDate), 'MM-dd')}
                        ~
                        {commonUtil.format(new Date(item.endDate), 'MM-dd')}
                      </span>
                      <span className="activity-desc">{item.description}</span>
                    </div>
                  </CellBody>
                  <CellFooter>
                    <div className={`activity-status activity-status-${status.toLowerCase()}`}>
                      {_.get(clazzStatusEnum, `${ status }.name`, '未知状态')}
                    </div>
                  </CellFooter>
                </Cell>
              })
            }
          </Cells>
        </div>
      </div>
    );
  }
}
