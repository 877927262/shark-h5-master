'use strict';

import { observable, action, useStrict } from "mobx";

useStrict(true);

/**
 * 统一的toast调用方法，用于控制全局toast消息的展示
 * todo 重新命名
 */
class HttpToast {
  @observable
  show = false;   // 是否显示
  @observable
  text = "";      // 文本内容
  @observable
  icon = "warn";  // 图标

  _toastTimer = null;

  /**
   * 显示toast，并默认在1.5s后隐藏
   * @param text
   * @param icon
   * @param ms
   * @param cb
   */
  @action
  showToast = ({ text, icon = "warn", ms = 1500, cb = () => {} }) => {
    this._showToast(text, icon);
    this._setTimer(ms, cb);
  };

  /**
   * 隐藏toast
   */
  @action
  hideToast = () => {
    clearTimeout(this._toastTimer);

    this._hideToast();
  };

  /**
   * 粘滞toast
   *
   * @param text
   * @param icon
   */
  @action
  stickyToast = ({ text, icon = "warn" }) => this._showToast(text, icon);

  /**
   * 隐藏toast
   *   - 内部方法，请勿直接调用
   * @private
   */
  @action
  _hideToast = () => {
    this._toastTimer = null;
    this.show = false;
  };

  /**
   * 展示toast
   *   - 内部方法，请勿直接调用
   * @param text
   * @param icon
   * @private
   */
  @action
  _showToast = (text, icon) => {
    this.text = text;
    this.icon = icon;
    this.show = true;
  };

  /**
   * 清除之前的定时器，并设置新的定时器
   *
   * @param ms
   * @param cb
   * @private
   */
  _setTimer = (ms, cb) => {
    clearTimeout(this._toastTimer);

    this._toastTimer = setTimeout(
      () => {
        this._hideToast();

        cb();
      },
      ms
    );
  };
}

export default new HttpToast();
