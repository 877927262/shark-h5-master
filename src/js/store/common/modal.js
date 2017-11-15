import {observable, action} from "mobx";

class Modal {
  @observable state = false;

  constructor(title, ...buttonslabel) {
    this.title = title;
    this.buttons = this._getButtons(buttonslabel);
  }

  _getButtons = (label) => {
    return label.map(item => ({
      label: item,
      onClick: this.close
    }))
  };

  @action
  open = () => this.state = true;

  @action
  close = () => this.state = false;
}

export default Modal;
