import React, {Component} from "react";
import {Link} from 'react-router';
import {observer, inject, PropTypes} from "mobx-react";

import WeUI from "react-weui";

const {
  CellsTitle,
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellFooter,
  Input
} = WeUI;

@inject("User") @observer
class Profile extends Component {
  constructor(props) {
    super(props);

    this.user = this.props.User;
  }

  updateBirthday = (event) => {
    this.user.setBirthday(event.target.value);
  };

  render() {
    const {info, cusBirthday} = this.user;

    return (
      <div className="page page-current me-page">
        <header className="bar bar-nav">
          <button className="button button-link button-nav pull-left" onClick={() => history.go(-1)}>
            <span className="icon icon-left"/>
          </button>
          <h1 className="title">我的资料</h1>
        </header>
        <div className="content">
          <CellsTitle>基本信息</CellsTitle>
          <Cells>
            <Cell className="profile-cell">
              <CellHeader>
                头像
              </CellHeader>
              <CellBody>
                <div className="avatar-wrap">
                  <img src={info.headImgUrl}/>
                </div>
              </CellBody>
            </Cell>
            <Cell className="profile-cell">
              <CellHeader>
                昵称
              </CellHeader>
              <CellBody>
                {info.name}
              </CellBody>
            </Cell>
            <Cell className="profile-cell">
              <CellHeader>
                出生日期
              </CellHeader>
              <CellBody>
                <Input type="date"
                       value={cusBirthday ? cusBirthday : info.birthday}
                       onChange={ this.updateBirthday }/>
              </CellBody>
            </Cell>
            <Cell className="profile-cell">
              <CellHeader>
                性别
              </CellHeader>
              <CellBody>
                {info.sex === 1 ? "男" : (info.sex === 2 ? "女" : "未知")}
              </CellBody>
            </Cell>
            <Cell className="profile-cell">
              <CellHeader>
                学号
              </CellHeader>
              <CellBody>
                {info.studentNumber}
              </CellBody>
            </Cell>
          </Cells>
          <Cells>
            <Cell component={Link} to="/me/password" access>
              <CellBody>
                修改密码
              </CellBody>
              <CellFooter/>
            </Cell>
          </Cells>
        </div>
      </div>
    )
  }
}

export default Profile;
