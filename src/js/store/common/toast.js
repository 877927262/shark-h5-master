import {observable, action} from "mobx";

class Toast {
  @observable show = false;
  @observable text = "操作成功";
  @observable toastTimer = null;
  @observable icon = "success";

  @action
  _setTimer = (ms, back) => {
    this.toastTimer = setTimeout(action(() => {
      this.show = false;
      back && history.back();
    }), ms);
  };

  @action
  _showToast = ({text = "操作成功", icon = "success", back = true, ms = 1200}) => {
    if (typeof text !== "string") {
      if (typeof text === "boolean")
        back = text;
      else if (typeof text === "number")
        ms = text;
      text = "操作成功"
    }
    this.text = text;
    this.icon = icon;
    this.show = true;
    this._setTimer(ms, back);
  }
}

export default Toast;

