'use strict';

import { useStrict, observable, action } from "mobx";

useStrict(true);

class Toptip {
  @observable
  type = "primary";
  @observable
  show = false;
  @observable
  content = "";

  _timer = null;

  showToptip = ({ type = "", content, ms = 1200 }) => {
    this._setType(type);
    this._setContent(content);
    this._setShow(true);

    this._timer = window.setTimeout(
      this._hideToptip,
      ms
    )
  };

  @action
  _hideToptip = () => {
    this._timer = null;
    this._setShow(false);
  };

  @action
  _setContent = (content) => this.content = content;

  @action
  _setType = (type) => this.type = type;

  @action
  _setShow = (show) => this.show = show === true;
}

export default new Toptip();
