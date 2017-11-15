/**
 * Created by violinsolo on 20/04/2017.
 */
import {observable, action} from "mobx";

class Dialog {
  @observable show = false;

  @action
  showDialog = () => {
    this.show = true;
  };

  @action
  dismissDialog = () => {
    this.show = false;
  };
}

export default Dialog;
