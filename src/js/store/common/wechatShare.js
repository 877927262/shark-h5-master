/**
 * Created by violinsolo on 25/04/2017.
 */
"use strict";

import { httpGet } from "../../service";
import util from "../util";

const baseUrl = `${util.baseUrl}api`;

export default class WechatShare {

  constructor(title, // 分享标题
              desc, // 分享描述
              link, // 分享链接
              imgUrl, // 分享图标
              type, // 分享类型,music、video或link，不填默认为link
              dataUrl// 如果type是music或video，则要提供数据链接，默认为空
  ) {
    this.title = title;
    this.desc = desc;
    this.link = link;
    this.imgUrl = imgUrl;
    this.type = type;
    this.dataUrl = dataUrl;
    this.hasInitWeixinSDK = false;
    this.url = null;

    wx.ready(() => {
      this.hasInitWeixinSDK = true;
      this._handleOnMenuShareAppMessage();
      this._handleOnMenuShareTimeline();
      this._handleOnMenuShareQQ();
      this._handleOnMenuShareWeibo();
      this._handleOnMenuShareQZone();
    });

    wx.error(() => {
      this.hasInitWeixinSDK = false;

      if (this.url !== localStorage.originUrl) {
        this.initWeixinSDK(localStorage.originUrl);
      }
    });

    this.initWeixinSDK(`${ location.pathname }${ location.search }`);
  }

  initWeixinSDK = (url) => {
    // 使用额外变量存储当前url，因在wx方法中url为最初值
    this.url = url;

    httpGet(`${baseUrl}/wechat/jsSdkAuth?url=${ encodeURIComponent(url) }`)
      .then((data) => {
        const params = {
          ...data,
          jsApiList: [
            "onMenuShareTimeline",
            "onMenuShareAppMessage",
            "onMenuShareQQ",
            "onMenuShareWeibo",
            "onMenuShareQZone"
          ]
        };

        delete params.jsapi_ticket;
        delete params.url;

        wx.config(params);
      })
  };

  //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
  _handleOnMenuShareTimeline = () => {
    wx.onMenuShareTimeline({
      title: `${ this.desc } #${ this.title }#`, // 分享标题
      link: this.link, // 分享链接
      imgUrl: this.imgUrl, // 分享图标
      success: () => {
        // 用户确认分享后执行的回调函数
      },
      cancel: () => {
        // 用户取消分享后执行的回调函数
      }
    });
  };

  //获取“分享给朋友”按钮点击状态及自定义分享内容接口
  _handleOnMenuShareAppMessage = () => {
    wx.onMenuShareAppMessage({
      title: this.title, // 分享标题
      desc: this.desc, // 分享描述
      link: this.link, // 分享链接
      imgUrl: this.imgUrl, // 分享图标
      type: this.type, // 分享类型,music、video或link，不填默认为link
      dataUrl: this.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
      success: () => {
        // 用户确认分享后执行的回调函数
      },
      cancel: () => {
        // 用户取消分享后执行的回调函数
      }
    });
  };

  //获取“分享到QQ”按钮点击状态及自定义分享内容接口
  _handleOnMenuShareQQ = () => {
    wx.onMenuShareQQ({
      title: this.title, // 分享标题
      desc: this.desc, // 分享描述
      link: this.link, // 分享链接
      imgUrl: this.imgUrl, // 分享图标
      success: () => {
        // 用户确认分享后执行的回调函数
      },
      cancel: () => {
        // 用户取消分享后执行的回调函数
      }
    });
  };

  //获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
  _handleOnMenuShareWeibo = () => {
    wx.onMenuShareWeibo({
      title: this.title, // 分享标题
      desc: this.desc, // 分享描述
      link: this.link, // 分享链接
      imgUrl: this.imgUrl, // 分享图标
      success: () => {
        // 用户确认分享后执行的回调函数
      },
      cancel: () => {
        // 用户取消分享后执行的回调函数
      }
    });
  };

  //获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
  _handleOnMenuShareQZone = () => {
    wx.onMenuShareQZone({
      title: this.title, // 分享标题
      desc: this.desc, // 分享描述
      link: this.link, // 分享链接
      imgUrl: this.imgUrl, // 分享图标
      success: () => {
        // 用户确认分享后执行的回调函数
      },
      cancel: () => {
        // 用户取消分享后执行的回调函数
      }
    });
  };
}
