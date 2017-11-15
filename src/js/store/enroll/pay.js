'use strict';

import { observable, useStrict, action, computed } from "mobx";
import { browserHistory } from 'react-router';
import uniqueToast from '../common/httpToast';

useStrict(true);

import util from "../util";

const baseUrl = `${util.baseUrl}api`;

import { httpGet, httpPost } from "../../service";

class Pay {
  @observable payment = {
    promotionOffer: null
  };
  @observable dialog = { title: "提示", content: "", show: false };
  @observable fee = {
    coupon: false,
    coin: false,
    couponItem: null,
    coinItem: null,
    amount: 0,
    totalFee: 0,
    originFee: 0,
    priceItemName: '免费'
  };
  // 首单优惠码
  @observable firstOfferCode = null;
  // 首单优惠码是否合法
  @observable isFirstOfferCodeValid = false;


  constructor(cid) {
    this.cid = cid;
    this.diaButtons = [
      {
        type: "default",
        label: "取消",
        onClick: this.hideDialog
      },
      {
        type: "primary",
        label: "确认",
        onClick: this.prePay
      }
    ];
  }

  @action
  setFee = (priceItem) => {
    this.fee.totalFee = priceItem.totalFee;
    this.fee.originFee = priceItem.originFee;
    this.fee.months = priceItem.months;
    this.fee.couponItem = priceItem.coupon;
    this.fee.coinItem = priceItem.coin;
    this.fee.priceItemName = priceItem.name;

    this.calculateActualAmount();
  };

  @action
  setPayment = (data) => {
    this.payment = { ...data };

    this.firstOfferCode = util.get(data, 'promotionOffer.promotionUserInfo.key', null)

    if (this.isFirstOffer && this.firstOfferCode) {
      this.isFirstOfferCodeValid = true;
    }

    this.setFee(data.priceList[0]);
  };

  fetchPayInfo = (scb) =>
    httpGet(`${baseUrl}/clazz/${this.cid}/payment`)
      .then(scb);

  @action
  hideDialog = () => this.dialog.show = false;

  @action
  showDialog = () => this.dialog.show = true;

  formatMoney = (rawMoney) => {
    return (rawMoney != null ? Number(rawMoney) / 100 : 0).toFixed(2);
  };

  @computed
  get coinState() {
    return this.fee.coupon ? "min" : "max";
  }

  @computed
  get diaContent() {
    return `您还要支付${this.formatMoney(this.fee.amount)}元， 是否前往支付？`
  }

  /**
   * 是否为首单
   *
   * @returns {boolean}
   */
  @computed
  get isFirstOffer() {
    return util.get(this.payment, 'promotionOffer.joinedClazzCount', 0) === 0;
  }

  @action
  calculateActualAmount = () => {
    const coupon = (this.fee.couponItem != null && this.fee.coupon)
      ? this.fee.couponItem.money
      : 0;

    const coin = this.fee.coin ? this.fee.coinItem[this.coinState] : 0;

    const offerPrice = this.isFirstOfferCodeValid
      ? util.get(this.payment, 'promotionOffer.offerPrice', 0)
      : 0;

    this.fee.amount = Math.max(this.fee.totalFee - (coupon + coin) * 100 - offerPrice, 0);
  };

  @action
  changeSwitch = (type) => {
    this.fee[type] = !this.fee[type];

    this.calculateActualAmount();
  };

  /**
   * 优惠码更新事件处理器
   *
   * @param promotionCode
   */
  @action
  promotionCodeChangeHandler = (promotionCode) => {
    // 优惠码不合法
    this.isFirstOfferCodeValid = false;
    // 设置新值
    this.firstOfferCode = promotionCode;
    // 更新优惠价格为0
    this.payment.promotionOffer.offerPrice = 0;

    this.calculateActualAmount();

    if (promotionCode.length >= 6) {
      this._fetchPromotionOffer(promotionCode)
        .then(action((promotionOffer) => {
          const promotionUser = promotionOffer.promotionUser;

          if (promotionUser != null) {
            // 更新推荐人信息
            this.payment.promotionOffer.promotionUserInfo = promotionUser;
            // 更新优惠价格
            this.payment.promotionOffer.offerPrice = promotionOffer.offerPrice;
            // 优惠码合法
            this.isFirstOfferCodeValid = true;
            // 重新计算价格
            this.calculateActualAmount();
          }
        }));
    }
  };


  alertInvalidPromotionCode = () => {
    if (this.isFirstOfferCodeValid !== true) {
      uniqueToast.showToast({ text: '无效的优惠码' });
    }
  };

  // 调用远端API，获取优惠码详情
  _fetchPromotionOffer = (promotionCode) => httpGet(`${baseUrl}/clazz/${ this.cid }/promotion/offer?promotionCode=${ promotionCode }`);

  prePay = () => {
    uniqueToast.stickyToast({ text: "订单生成中...", icon: 'loading' });
    const { amount, priceItemName, months, coupon, coin, couponItem, coinItem } = this.fee;

    const body = {
      money: amount,
      priceItemName: priceItemName,
      months: months,
      coupon: {
        selected: coupon,
        id: coupon ? couponItem.id : undefined
      },
      coin: {
        selected: coin,
        coin: coin ? coinItem[this.coinState] : 0
      }
    };

    // 如果优惠码合法，则增加之
    if (this.isFirstOfferCodeValid) {
      body.promotionCode = this.firstOfferCode;
    }

    httpPost(`${baseUrl}/clazz/${this.cid}/payment`, body)
      .then(data => {
        uniqueToast.hideToast();
        this.hideDialog();

        const { action, clazzInfo, redirectToPassport } = data;

        const redirectUrl = `/redirect?target=/enroll/pay/${ this.cid }/success`;

        switch (action) {
          case "ALREADY_JOIN":
            browserHistory.replace(redirectUrl);
            break;
          case "SUCCESS":
            uniqueToast.showToast({ text: "成功加入班级", icon: "success" });

            window.setTimeout(() => browserHistory.replace(redirectUrl), 1500);
            break;
          case "TOPAY":
            this.invokeWXPay(data.signData, redirectUrl);
            break;
          default:
            uniqueToast.showToast({ text: "业务处理失败", icon: "warn" });
            break;
        }
      })
      .catch((error) => {
        uniqueToast.hideToast();
        uniqueToast.showToast({ text: "业务处理失败", icon: "warn" });
      })
  };

  invokeWXPay = (signData, redirectUrl) => {
    const jsApiCall = () => {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
          appId: signData.appid,
          timeStamp: `${ signData.timeStamp }`,
          nonceStr: signData.nonceStr,
          package: signData.package,
          signType: signData.signType,
          paySign: signData.paySign
        },
        (res) => {
          this.hideDialog();
          //判断支付返回的参数是否支付成功并跳转
          if (res.err_msg === "get_brand_wcpay_request:ok") {
            // 支付成功后的回调函数
            uniqueToast.showToast({ text: "支付成功", icon: "success" });

            window.setTimeout(() => browserHistory.replace(redirectUrl), 1500);
          } else {
            uniqueToast.showToast({ text: "支付失败", icon: "warn" });
          }
        }
      );
    };

    if (typeof WeixinJSBridge === "undefined") {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', jsApiCall);
        document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
      }
    } else {
      jsApiCall();
    }
  }
}

export default Pay;
