'use strict';

import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import WeUI from "react-weui";

import _ from "../../../util";

const {
  Switch,
  Dialog,
  FormCell,
  Label,
  CellBody,
  CellFooter,
  Select,
  Input
} = WeUI;

import "../../../../../style/enroll.scss";

@inject("Pay") @observer
class EnrollPayPage extends Component {
  constructor(props) {
    super(props);

    this.pay = new this.props.Pay(this.props.params.courseId);
  }

  componentDidMount() {
    this.pay.fetchPayInfo(this.pay.setPayment);
  }

  formatMoney(rawMoney) {
    if (rawMoney != null)
      return (Number(rawMoney) / 100).toFixed(2);
  }

  render() {
    const {
      showDialog, dialog, diaContent, diaButtons, coinState, changeSwitch, setFee, promotionCodeChangeHandler, alertInvalidPromotionCode,
      payment, fee,
      isFirstOffer, isFirstOfferCodeValid, firstOfferCode
    } = this.pay;

    const { promotionOffer } = payment;
    const promotionUserInfo = _.get(promotionOffer, 'promotionUserInfo', null);

    const { title, show } = dialog;
    return (
      <div className="enroll-page page">
        <header className="bar bar-nav">
          <a className="icon icon-left pull-left" onClick={() => history.go(-1)}/>
          <h1 className="title">报名付款</h1>
        </header>
        <div className="content pay-page">
          <div className="pay-head flex-row">
            <img className="pay-img"
                 src={payment.clazz ? payment.clazz.banner : null} alt="课程icon"/>
            <div className="flex-column text-content">
              <div className="pay-title">{payment.clazz ? payment.clazz.name : null}</div>
              <div className="pay-cost-txt">
                <div className="text-large">￥{this.formatMoney(fee.totalFee)}</div>
                <div className="text-small">（原价 <span className="font-red">￥{this.formatMoney(fee.originFee)}</span>）
                </div>
              </div>
            </div>
          </div>
          <div className="list-block m-t-md">
            <ul>
              <li className="item-content">
                <FormCell className="item-inner p-l-none">
                  <CellBody>
                    <Label>付款方式</Label>
                  </CellBody>
                  <CellFooter>
                    <Label className="font-green">微信</Label>
                  </CellFooter>
                </FormCell>
              </li>
              {
                payment.clazz && payment.clazz.clazzType === 'LONG_TERM' && (
                  <li className="item-content">
                    <FormCell select className="item-inner">
                      <CellBody>
                        套餐(点击可选)
                      </CellBody>
                      <CellFooter>
                        <Select onChange={(e) => setFee(payment.priceList[e.target.value])} defaultValue={0}>
                          {
                            payment.priceList.map((priceItem, index) =>
                              <option value={ index } key={`price_month_index_${ index }`}>
                                { priceItem.name }
                              </option>
                            )
                          }
                        </Select>
                      </CellFooter>
                    </FormCell>
                  </li>
                )
              }
              {
                fee.couponItem === null || (<li className="item-content">
                  <div className="item-inner">
                    <div className="item-title">使用优惠券
                      (￥<span className="font-red">{_.get(fee, "couponItem.money", 0)}</span>)？
                    </div>
                    <Switch onChange={(e) => changeSwitch("coupon")}/>
                  </div>
                </li>)
              }
              <li className="item-content">
                <div className="item-inner">
                  <div className="item-title">使用优币
                    <span className="font-red">{_.get(fee, "coinItem." + coinState, 0)}</span>枚？
                  </div>
                  <Switch onChange={(e) => changeSwitch("coin")}/>
                </div>
              </li>
              {
                isFirstOffer && (<li className="item-content">
                  <div className="item-inner">
                    <div className="item-title">优惠码</div>
                    <div className="item-after">
                      <Input className="promotion-code-input text-right" type="text" placeholder="输入优惠码"
                             maxLength="12" value={firstOfferCode}
                             onBlur = {alertInvalidPromotionCode}
                             onChange={(event) => promotionCodeChangeHandler(event.target.value)}/>
                    </div>
                  </div>
                </li>)
              }
              {
                isFirstOfferCodeValid && (<li className="item-content promoter-user-item">
                  <div className="item-inner">
                    <div className="item-title">
                      <img className="promoter-user-avatar"
                           src={_.get(promotionUserInfo, 'userInfo.headImgUrl', '')} alt="推荐人头像"/>
                      <span className="p-l-xs">
                        推荐人： {_.get(promotionUserInfo, 'userInfo.name', '')}
                      </span>
                    </div>
                    <div className="item-after font-green">
                      -{this.formatMoney(_.get(promotionOffer, 'offerPrice', 0))}
                    </div>
                  </div>
                </li>)
              }
              <li className="item-content">
                <div className="item-inner">
                  <div className="item-title">实付金额</div>
                  <div className="item-after font-red">￥{this.formatMoney(fee.amount)}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <footer className="bar bar-tab pay-end">
          <div className="button ensure-button" onClick={showDialog}>确定</div>
        </footer>
        <Dialog title={title} buttons={diaButtons} show={show}>{diaContent}</Dialog>
      </div>
    );
  }
}

export default EnrollPayPage;
