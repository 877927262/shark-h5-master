'use strict';

import React, { Component } from "react";
import { browserHistory } from "react-router";
import { observer, inject } from "mobx-react";
import WeUI from "react-weui";
import IMAGE_URL_MAP from "../../BigImageUrl";

const {
  Button,
  Dialog
} = WeUI;

import "../../../../style/activity.scss";


@inject("ActivityDetail", "User") @observer
export default class ActivityDetailPage extends Component {
  constructor(props) {
    super(props);

    this.user = this.props.User;
    const { activityId, userId } = this.props.params;

    this.activityDetail = new this.props.ActivityDetail(activityId, userId);
  }

  fetchAndSetData = () => {
    const { fetchActivityInfo, setActivityInfo } = this.activityDetail;

    fetchActivityInfo().then(setActivityInfo);
  };

  getProcessRateImageUrl = (batterPercent) => {
    if (0 <= batterPercent && batterPercent < 0.2) {
      return IMAGE_URL_MAP["0_PERCENT"];
    } else if (0.2 <= batterPercent && batterPercent < 0.4) {
      return IMAGE_URL_MAP["20_PERCENT"];
    } else if (0.4 <= batterPercent && batterPercent < 0.6) {
      return IMAGE_URL_MAP["40_PERCENT"];
    } else if (0.6 <= batterPercent && batterPercent < 0.8) {
      return IMAGE_URL_MAP["60_PERCENT"];
    } else if (0.8 <= batterPercent && batterPercent < 1) {
      return IMAGE_URL_MAP["80_PERCENT"];
    } else if (batterPercent >= 1) {
      return IMAGE_URL_MAP["100_PERCENT"];
    } else {
      // default value
      return IMAGE_URL_MAP["0_PERCENT"];
    }
  };

  componentDidMount() {
    this.fetchAndSetData()
  }

  render() {
    const { modal, activityInfo, userInfo, activityId, favourUser } = this.activityDetail;
    const userTitle = activityInfo.isSelf ? '你' : '他';

    return (
      <div className="activity-page">

        <div className="content activity-detail">

          <div className="activity-detail-header">
            <img className="activity-img"
                 src={activityInfo.banner}
                 alt="..."/>
            <div className="info-cell">
              <div className="avatar-wrap">
                <img src={userInfo.headImgUrl}/>

                <div className="info-wrap">
                  <div>{userInfo.name}宣布</div>
                  <div>参加"<font color="#FF4060">{activityInfo.name}</font>"活动</div>
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <div className="battery">
              <img className="battery-img"
                   src={this.getProcessRateImageUrl(activityInfo.progressRate)}
                   alt="..."/>
            </div>

            <div className="flex-row flex-row-center plug-percent"><i className="icon-gb icon-gb-plug"/><span
              className="">{(activityInfo.progressRate * 100).toFixed(2)}%</span></div>

            {
              ((isFavour, isSelf, progressRate) => {
                if (isSelf === false && isFavour === false) {
                  return <Button className="btn-charging" onClick={() => {
                    favourUser()
                      .then(() => {
                        this.fetchAndSetData()
                      })
                      .catch(() => {
                      })
                  }}>
                    帮他一把
                  </Button>
                }

                if (isSelf === true && progressRate >= 1.00) {
                  return <Button className="btn-charging" onClick={() => {
                    browserHistory.push(`/course/${activityId}/detail`)
                  }}>
                    进入活动
                  </Button>
                }

                const buttonName = isSelf ? '充电中' : '帮好友助力成功';

                return <Button className="btn-charging">{buttonName}</Button>
              })(activityInfo.isFavour, activityInfo.isSelf, activityInfo.progressRate)
            }

            <div className="text-center text-charging-remain">
              {((progressRate) => {
                if (progressRate < 1.0) {
                  return <span>
                    {userTitle}只差<font color="red">{activityInfo.neededFavor}</font>个加油了
                  </span>
                }

                return '已助力成功'
              })(activityInfo.progressRate)}
            </div>

            {((progressRate) => {
              if (progressRate < 1.0) {
                return <div className="text-center text-charging-hint">把本页<font color="#FF4060">分享</font>给好友帮{userTitle}加油吧
                </div>
              }
            })(activityInfo.progressRate)}
          </div>

        </div>

        <div className="activity-detail-footer">
          <footer className="bar bar-tab footer">
            {
              ((isSelf) => {
                if (isSelf === false) {
                  return (
                    <div className="flex-all justify-center align-center end-bg">
                      <Button onClick={modal.open} className="btn-footer">我也要参加</Button>
                    </div>
                  );
                }
              })(activityInfo.isSelf)
            }
          </footer>
        </div>

        <Dialog buttons={modal.buttons} show={modal.state} title={modal.title} type="ios">
          {
            (() => {
              return (
                <div className="qrcode-wrap">
                  <img src={IMAGE_URL_MAP["QRCODE_FOR_PARTICIPATE"]} className="qrcode"
                       alt="qrcode"/>
                </div>
              );
            })()
          }
        </Dialog>
      </div>
    );
  }
}

