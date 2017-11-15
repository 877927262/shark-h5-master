import {observable, useStrict, action, computed} from "mobx";

import Toast from "../common/toast";
import {httpGet, httpPost} from "../../service";
import util from "../util";

import {AudioItem} from "./chat";

const baseUrl = `${util.baseUrl}api`;

useStrict(true);

const STATUS = {
  start: {
    tip: "",
    status: "点击开始录音",

  },
  record: {
    tip: "满45s自动停止",
    status: "录音中"
  },
  send: {
    tip: "满45s自动停止",
    status: "点击发送"
  }
};

export default class Record {
  @observable state = "start";
  @observable timer = null;

  constructor(cid, list, chat, isTeacher, feedbackId) {
    this.toast = new Toast();

    this.hasInitWeixinSDK = false;
    this.cid = cid;
    this.list = list;
    this.chat = chat;
    this.localId = 0;
    this.isTeacher = isTeacher;
    this.fid = feedbackId;
    this.url = null;
  }

  initWeixinSDK = (url) => {
    if (this.hasInitWeixinSDK === false) {
      // 使用额外变量存储当前url，因在wx方法中url为最初值
      this.url = url;
      // 初始化WexxinSDK失败
      this.hasInitWeixinSDK = false;

      httpGet(`${baseUrl}/wechat/jsSdkAuth?url=${ encodeURIComponent(url) }`)
        .then(data => {
          const params = {
            ...data,
            jsApiList: [
              "startRecord",
              "stopRecord",
              "onVoiceRecordEnd",
              "playVoice",
              "pauseVoice",
              "stopVoice",
              "onVoicePlayEnd",
              "uploadVoice",
              "downloadVoice"
            ]
          };

          delete params.jsapi_ticket;
          delete params.url;

          wx.error(() => {
            if (this.url !== localStorage.originUrl) {
              return void this.initWeixinSDK(localStorage.originUrl);
            }

            // 标记录音失败
            this.hasInitWeixinSDK = false;
            // 提示授权失败
            this.toast._showToast({text: "微信鉴权失败", icon: "warn", back: false});
          });

          wx.config(params);

          /**
           * 注意：该函数会在声明的时候立即调用
           */
          wx.ready(() => {
            // 初始化WeixinSDK成功
            this.hasInitWeixinSDK = true;
          });
        });
    }
  };


  @computed
  get active() {
    return this.state === "start" ? "" : "active"
  }

  @computed
  get content() {
    return STATUS[this.state];
  }

  @action
  handleClick = () => {
    if (this.hasInitWeixinSDK) {
      switch (this.state) {
        case "start":
          this._handleStart();
          break;
        case "record":
          this._handleRecord();
          break;
        case "send":
          this._handleSend();
          break;
        default:
          this.state = "start";
      }
    } else {
      this.toast._showToast({text: "微信授权中", icon: "loading", back: false});
      this.initWeixinSDK(`${ location.pathname }${ location.search }`);
    }
  };

  _handleStart = () => {
    let self = this;
    wx.startRecord({
      success: action(() => {
        self.state = "record";
        self.timer = setTimeout(function () {
          self._handleRecord();
        }, 44000);
      }),
      fail:  action(() => {
        self.state = "start";
        self.hasInitWeixinSDK = false;

        self.toast._showToast({text: "开始录音失败", icon: "warn", back: false});
      })
    });
  };

  _handleRecord = () => {
    let self = this;
    wx.stopRecord({
      success: action((res) => {
        self.state = "send";
        self.localId = res.localId;

        self.timer && clearTimeout(self.timer);
      }),
      fail: action(() => {
        self.state = "start";
        self.hasInitWeixinSDK = false;

        self.toast._showToast({text: "结束录音失败", icon: "warn", back: false});
      })
    });
  };

  _handleSend = () => {
    let self = this;
    wx.uploadVoice({
      localId: self.localId,
      isShowProgressTips: 1,
      success: action((res) => {
        self.localId = res.serverId;
        self.sendRecord()
          .then(action(item => {
            item["audio"] = new AudioItem(self.chat, item.id);
            self.list.push(item);
            // self.list.push(data);  <-错误用法！！！
            self.handleCancel();
          }))
      }),
      fail: () => {
        self.hasInitWeixinSDK = false;

        self.toast._showToast({text: "上传语音失败", icon: "warn", back: false});
      }
    });
  };

  @action
  handleCancel = () => {
    let self = this;

    if (this.state === "record") {
      wx.stopRecord({
        success: action((res) => {
          self.state = "start";

          self.timer && clearTimeout(self.timer);
        }),
        fail: action(() => {
          self.hasInitWeixinSDK = false;
          self.state = "start";

          self.toast._showToast({text: "结束录音失败", icon: "warn", back: false});
        })
      })
    } else {
      self.state = "start";

      self.timer && clearTimeout(self.timer);
    }

  };

  sendRecord = () => {
    let targetUrl;
    if (this.fid) {
      targetUrl = `${baseUrl}/clazz/${this.cid}/feedback/${this.fid}`
    } else {
      targetUrl = `${baseUrl}/clazz/${this.cid}/feedback`;
    }
    return httpPost(targetUrl, {
      replyType: "VOICE",
      mediaId: this.localId
    })
  }

}
