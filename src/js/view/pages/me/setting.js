"use strict";

import React, { Component } from "react";
import { Link } from "react-router";
import { observer, inject, PropTypes } from "mobx-react";

import { timezoneEnum, getEnumByKey } from "../../enum";
import _ from "../../util"
import IMAGE_URL_MAP from "../../BigImageUrl";
import WeUI from "react-weui";

const {
  CellsTitle,
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellFooter,
  CellsTips,
  Form,
  FormCell,
  Picker,
  Input
} = WeUI;

@inject("Setting") @observer
class Setting extends Component {
  constructor(props) {
    super(props);
    this.setting = new this.props.Setting();
  }

  componentDidMount() {
    this.setting.setInfo();
    this.setting.bindToastWithAction();
  }

  render() {
    const { setting } = this.setting;
    return (
      <div className="page page-current me-page">
        <header className="bar bar-nav">
          <button className="button button-link button-nav pull-left" onClick={() => history.go(-1)}>
            <span className="icon icon-left"/>
          </button>
          <h1 className="title">个人设置</h1>
        </header>
        <div className="content">
          <Cells>
            <Cell className="setting-cell" component={Link} to={"/me/setting/phoneNumber"} access>
              <CellBody className="text-no-wrap setting-cell-primary-text">
                手机号
              </CellBody>
              <CellFooter className="text-overflow-hidden">
                {setting.phoneNumber ||
                (<span className="setting-label">
                  去设置
                </span>)}
              </CellFooter>
            </Cell>
            <Cell className="setting-cell" component={Link} to={"/me/setting/realName"} access>
              <CellBody className="text-no-wrap setting-cell-primary-text">
                真实姓名
              </CellBody>
              <CellFooter className="text-overflow-hidden">
                {setting.realName ||
                (<span className="setting-label">
                  去设置
                </span>)}
              </CellFooter>
            </Cell>
          </Cells>


          <Cells>
            <Cell className="setting-cell" component={Link} to={"/me/setting/wechat"} access>
              <CellHeader>
                <i className="icon-gb icon-gb-wechat"/>
              </CellHeader>
              <CellBody className="text-no-wrap setting-cell-primary-text">
                微信号
              </CellBody>
              <CellFooter className="text-overflow-hidden">
                {setting.wechat ||
                (<span className="setting-label">
                  去设置
                </span>)}
              </CellFooter>
            </Cell>
            <Cell className="setting-cell" component={Link} to={"/me/setting/alipay"} access>
              <CellHeader>
                {/*<i className="icon-gb icon-gb-alipay"/>*/}
                <img src={IMAGE_URL_MAP["ALIPAY"]} className="alipay-logo"/>
              </CellHeader>
              <CellBody className="text-no-wrap setting-cell-primary-text">
                支付宝
              </CellBody>
              <CellFooter className="text-overflow-hidden">
                {setting.alipay ||
                (<span className="setting-label">
                  去设置
                </span>)}
              </CellFooter>
            </Cell>
          </Cells>
          <CellsTips>完善信息以便我们可以多种渠道联系到您</CellsTips>

          <CellsTitle>时区设置</CellsTitle>
          <Form>
            <FormCell className="setting-cell zone-cell">
              <CellHeader>
                时区
              </CellHeader>
              <CellBody>
                <Input
                  type="text"
                  onClick={this.setting.clickInput}
                  placeholder=""
                  value={getEnumByKey(_.get(setting, "timezone", "UTC+8"), timezoneEnum).name}
                  readOnly={true}
                />
              </CellBody>
            </FormCell>
          </Form>
          <CellsTips>时区不同打卡时间不同，一个月只能改一次时区</CellsTips>
          <Picker
            onChange={this.setting.saveTimeZone}
            defaultSelect={[20]}
            groups={this.setting.timeZoneGroup}
            show={this.setting.showTimeZonePicker}
            onCancel={this.setting.cancelTimeZone}
            lang={{ leftBtn: "取消", rightBtn: "确定" }}
          />
        </div>
      </div>
    )
  }
}

export default Setting;
