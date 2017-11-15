import React, { Component } from "react";
import { Link } from "react-router";
import { observer, inject } from "mobx-react";
import WeUI from "react-weui";
import BottomTabBar from "../bottomTabBar";
import UbandHeader from "../ubandHeader";

const {
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellFooter
} = WeUI;

@inject("User") @observer
class Index extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { info } = this.props.User;
    return (
      <div className="page page-current me-page">
        <UbandHeader/>
        <div className="content profile-center">
          <div className="info-cell">
            <div className="avatar-wrap">
              <img src={info.headImgUrl}/>

              <div className="info-wrap">
                <div className="info-name">{info.name}</div>
                <div className="info-number">{info.studentNumber}</div>
              </div>
            </div>
          </div>

          <Cells>
            <Cell component={Link} to="/promotion/home">
              <CellHeader>
                <i className="icon-gb icon-gb-promotion-center"/>
              </CellHeader>
              <CellBody>
                伙伴中心
              </CellBody>
              <CellFooter/>
            </Cell>

            <Cell component={Link} to="/course/list">
              <CellHeader>
                <i className="icon-gb icon-gb-course"/>
              </CellHeader>
              <CellBody>
                学习记录
              </CellBody>
              <CellFooter/>
            </Cell>

            <Cell component={Link} to="/me/coin">
              <CellHeader>
                <i className="icon-gb icon-gb-coin"/>
              </CellHeader>
              <CellBody>
                我的优币
              </CellBody>
              <CellFooter/>
            </Cell>

            <Cell component={Link} to="/me/ticket">
              <CellHeader>
                <i className="icon-gb icon-gb-coupon"/>
              </CellHeader>
              <CellBody>
                我的优惠券
              </CellBody>
              <CellFooter/>
            </Cell>

            <Cell component={Link} to="/me/setting">
              <CellHeader>
                <i className="icon-gb icon-gb-account"/>
              </CellHeader>
              <CellBody>
                个人信息
              </CellBody>
              <CellFooter/>
            </Cell>

            <Cell component={Link} to="/me/clazzExit">
              <CellHeader>
                <i className="icon-gb icon-me-exit-clazz"/>
              </CellHeader>
              <CellBody>
                申请退班
              </CellBody>
              <CellFooter/>
            </Cell>
          </Cells>

          {/*<Cells>*/}
          {/*<Cell component={Link} to="/me/setting">*/}
          {/*<CellBody>*/}
          {/*获取帮助？*/}
          {/*</CellBody>*/}
          {/*<CellFooter/>*/}
          {/*</Cell>*/}
          {/*<Cell component={Link} to="/me/setting">*/}
          {/*<CellBody>*/}
          {/*发送反馈给我们*/}
          {/*</CellBody>*/}
          {/*<CellFooter/>*/}
          {/*</Cell>*/}
          {/*</Cells>*/}
        </div>

        <BottomTabBar currentTab="me"/>
      </div>
    )
  }
}

export default Index;
