import React, {Component} from "react";
import {observer, inject, PropTypes} from "mobx-react";

@inject("Coupon") @observer
class Ticket extends Component {
  constructor(props) {
    super(props);

    this.coupon = this.props.Coupon;
  }

  componentDidMount() {
    this.coupon.setInfo();
  }


  render() {
    const {info} = this.coupon;
    return (
      <div className="page page-current me-page">
        <header className="bar bar-nav">
          <button className="button button-link button-nav pull-left" onClick={() => history.go(-1)}>
            <span className="icon icon-left"/>
          </button>
          <h1 className="title">我的优惠券</h1>
        </header>
        <div className="content">
          <div className="ticket-list">
            {
              (info && info.length > 0) ? info.map((item, idx)=>(
                <div className="ticket-item" key={idx}>
                  <div className="ticket-content-wrap">
                    <div className="ticket-title">
                      抵用券
                    </div>
                    <div className="ticket-range">
                      可以对所有课程使用
                    </div>
                    <div className="ticket-time">
                      有效期至{item.expireDate.slice(0, 10)}
                    </div>
                  </div>
                  <div className="ticket-number-wrap">
                    <span className="number">{item.money}</span>元
                  </div>
                </div>
              )) : <div className="ticket-empty"><i className="icon-gb icon-gb-content-empty ticket-empty-img"/><p className="text-center ticket-empty-text">空空如也，还没有可用的优惠券哦</p></div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Ticket;
