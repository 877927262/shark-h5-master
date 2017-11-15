'use strict';

import React, { Component } from "react";
import { browserHistory } from 'react-router';
import { observer, inject, PropTypes } from "mobx-react";
import Weui from 'react-weui';
import httpToast from '../../../../store/common/httpToast';

import _ from '../../../util';

const {
  MediaBox,
  MediaBoxBody,
  MediaBoxTitle,
  MediaBoxDescription,
  Button,
  Panel,
  PanelBody
} = Weui;

@inject("Setting", "SettingConfig", "EnrollDetail") @observer
class EnrollPaySuccessPage extends Component {
  constructor(props) {
    super(props);

    const { Setting, SettingConfig, EnrollDetail, params, } = this.props;

    this.setting = new Setting();
    this.config = new SettingConfig('phoneNumber');
    this.courseId = params.courseId;

    this.detail = new EnrollDetail(this.courseId);
  }

  componentDidMount() {
    this.setting.setInfo();

    this.detail.fetchDetail(this.detail.setDetail);
  }

  render() {
    const { setting } = this.setting;
    const { value, saveConfig, handleChange } = this.config;

    const phoneNumber = value == null ? setting.phoneNumber : value;
    const isPhoneValid = _.isValidPhoneNumber(phoneNumber);
    const redirectUrl = `/redirect?target=/course/detail/${ this.courseId }`;

    return (
      <div className="page page-current enroll-page pay-success-page">
        <header className="bar bar-nav p-xxs pay-success-header">
          <i className="icon-gb icon-gb-share-tap pull-right"/>
          <span className="pull-right m-r-lg share-tip">点击上方，分享这门好课</span>
        </header>
        <main className="content pay-success-content">
          <MediaBox type="text" className="text-center p-n">
            <MediaBoxBody className="success-message">
              <MediaBoxTitle className="success-message-title p-m">
                课程报名成功！查看
                <span className="course-title"
                      onClick={ () => browserHistory.replace(redirectUrl)}>
                  我的课程
                </span>
              </MediaBoxTitle>
              <div className="divide-full"/>
              <MediaBoxDescription className="success-message-form">
                完善下方信息获取更多服务哦～
                <div className="phone-number m-t m-b-sm">
                  <span className="m-r-sm">手机号</span>
                  <input type="number" className="phone-number-input p-l-xs p-r-xs"
                         value={phoneNumber}
                         onChange={handleChange}/>
                </div>
                <Button size="small" disabled={isPhoneValid === false}
                        onClick={() => saveConfig()
                          .then(() => {
                            httpToast.showToast({ text: '设置成功', icon: 'success' });

                            setTimeout(() => browserHistory.replace(redirectUrl), 1200);
                          })
                        }>
                  提交
                </Button>
              </MediaBoxDescription>
            </MediaBoxBody>
          </MediaBox>

          <Panel className="m-t-md">
            <PanelBody className="text-center p-m subscribe-guide">
              <div className="subscribe-alarm"><i className="icon-gb icon-gb-alarm pull-left"/>关键一步</div>
              <img className="subscribe-info m-b-sm" src="http://qiniuprivate.gambition.cn/gGJ0Vv_subscribe_uband.png"/>
              <img className="subscribe-qrcode" src="http://qiniuprivate.gambition.cn/5V62W2_uband_qrcode.png"/>
            </PanelBody>
          </Panel>
        </main>
      </div>
    )
  }
}

EnrollPaySuccessPage.propTypes = {
  Setting: PropTypes.objectOrObservableObject,
  params: React.PropTypes.object
};

export default EnrollPaySuccessPage;
