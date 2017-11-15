'use strict';

import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import WeUI from "react-weui";

const {
  Form,
  FormCell,
  CellHeader,
  CellBody,
  CellFooter,
  Label,
  Input,
  ButtonArea,
  Button
} = WeUI;

@inject("Password") @observer
class Password extends Component {
  constructor(props) {
    super(props);

    this.password = new this.props.Password();
  }

  componentDidMount() {
    this.password.fetchHasSetPassword();
  }

  /**
   * 更新旧密码
   * @param event
   */
  changeOldPassword = event => this.password.setOldPassword(event.target.value);

  /**
   * 更新新密码
   * @param event
   */
  changeNewPassword = event => this.password.setNewPassword(event.target.value);

  /**
   * 确认修改密码
   * @returns {*}
   */
  updatePassword = () => {
    const { updatePassword, isPasswordValid, showInvalidPasswordTip } = this.password;

    if (isPasswordValid === true) {
      return void updatePassword();
    }

    showInvalidPasswordTip();
  };

  render() {
    const {
      hasSetPassword, oldPassword, newPassword, showOldPassword, showNewPassword, isUpdating, isPasswordValid,
      toggleOldPassword, toggleNewPassword,
    } = this.password;

    return (
      <div className="page page-current me-page">
        <header className="bar bar-nav">
          <button className="button button-link button-nav pull-left" onClick={() => history.go(-1)}>
            <span className="icon icon-left"/>
          </button>
          <h1 className="title">修改密码</h1>
        </header>
        <div className="content">
          <Form>
            {
              hasSetPassword &&
              ( <FormCell className="password-cell">
                <CellHeader>
                  <Label>旧密码</Label>
                </CellHeader>
                <CellBody>
                  <Input
                    value={oldPassword}
                    type={showOldPassword ? "text" : "password"}
                    onChange={this.changeOldPassword}/>
                </CellBody>
                <CellFooter>
                  <div className="toggle-password" onClick={toggleOldPassword}>
                    {showOldPassword ? "隐藏" : "显示"}
                  </div>
                </CellFooter>
              </FormCell>)
            }
            <FormCell className="password-cell">
              <CellHeader>
                <Label>新密码</Label>
              </CellHeader>
              <CellBody>
                <Input
                  value={newPassword}
                  type={showNewPassword ? "text" : "password"}
                  placeholder="8~20位数字和字母组合"
                  onChange={this.changeNewPassword}/>
              </CellBody>
              <CellFooter>
                <div className="toggle-password" onClick={toggleNewPassword}>
                  {showNewPassword ? "隐藏" : "显示"}
                </div>
              </CellFooter>
            </FormCell>
          </Form>
          <ButtonArea>
            <Button disabled={!isPasswordValid || isUpdating} onClick={this.updatePassword}>
              确认修改
            </Button>
          </ButtonArea>
        </div>
      </div>
    )
  }
}

Password.propTypes = {
  oldPassword: React.PropTypes.string,
  newPassword: React.PropTypes.string,
  showOldPassword: React.PropTypes.bool,
  showNewPassword: React.PropTypes.bool
};

export default Password;
