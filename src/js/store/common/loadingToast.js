/**
 * Created by violinsolo on 29/03/2017.
 */
import {observable, action} from "mobx";

// todo 移除
class LoadingToast {
  @observable show = false;
  @observable text = "";
  @observable icon = "loading";

  @action
  _showToast = ({ text = "Loading...", icon = "loading" }) => {
    this.text = text;
    this.icon = icon;
    this.show = true;
  };

  @action
  _hideToast = () => {
    this.show = false;
  };
}

export default LoadingToast;
