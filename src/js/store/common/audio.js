'use strict';

import { observable, action } from "mobx";
import util from "../util";

export default class AudioItem {
  @observable
  duration = "00:00";
  @observable
  current = "00:00";
  @observable
  isPlaying = false;

  constructor() {
  }

  @action
  setDuration = (duration) => {
    this.duration = util.formatAudioTimer(duration);
  };

  @action
  setCurrent = (current) => {
    this.current = util.formatAudioTimer(current);
  };

  @action
  setIsPlaying = (isPlaying) => {
    this.isPlaying = isPlaying === true;
  };
}
