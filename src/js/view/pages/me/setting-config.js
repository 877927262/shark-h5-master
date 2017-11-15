"use strict";

import React, { Component } from "react";
import { observer, inject } from "mobx-react";

import WeUI from "react-weui";
import { settingTypeEnum, getEnumByKey } from "../../enum";

const {
  CellBody,
  Form,
  FormCell,
  Input
} = WeUI;

@inject("SettingConfig") @observer
class SettingConfig extends Component {
  constructor(props) {
    super(props);

    this.config = new this.props.SettingConfig(this.props.params.config);

    this.configType = getEnumByKey(this.config.type, settingTypeEnum).name;
  }

  saveConfig = () => {
    const { value, saveConfig, showWarnToptip } = this.config;

    if (value == null) {
      return showWarnToptip(`${ this.configType }不能为空`);
    }

    return saveConfig(value);
  };

  render() {
    const { value, handleChange } = this.config;

    return (
      <div className="page page-current me-page">
        <header className="bar bar-nav">
          <button className="button button-link button-cancel button-nav pull-left" onClick={() => history.go(-1)}>
            <span style={{ marginLeft: ".5rem" }}>取消</span>
          </button>
          <button className="button button-link button-save button-nav pull-right">
            <span style={{ marginRight: ".5rem" }}
                  onClick={this.saveConfig}>
              保存
            </span>
          </button>
          <h1 className="title">{this.configType}设置</h1>
        </header>
        <div className="content">
          <Form>
            <FormCell>
              <CellBody>
                <Input
                  type="text"
                  defaultValue={value}
                  onChange={handleChange}
                  placeholder={`请输入你的${ this.configType }`}/>
              </CellBody>
            </FormCell>
          </Form>
        </div>
      </div>
    )
  }
}

export default SettingConfig;
