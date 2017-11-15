/**
 * Created by violinsolo on 27/03/2017.
 */
import {observable, action} from "mobx";

class PopUp {
  @observable show = false;

  @action
  _showPopUp() {
    this.show = true;
  }

  @action
  _hidePopUp() {
    this.show = false;
  }
}

export default PopUp;