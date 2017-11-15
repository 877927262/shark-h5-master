"use strict";

import React, { Component, PropTypes } from "react";
import IMAGE_URL_MAP from "./BigImageUrl";

import '../../style/empty-tip.scss';

export default class EmptyTip extends Component {

  constructor(props) {
    super(props);
  };

  static propTypes = {
    /**
     * tip content
     *
     */
    tip: PropTypes.string
  };

  static defaultProps = {
    tip: '空空如也'
  };

  render() {
    const { tip, ...others } = this.props;

    return (
      <div className="empty-tip" {...others}>
        <img className="empty-photo" src={IMAGE_URL_MAP.EMPTY}/>
        <p className="empty-text">{`${ tip }`}</p>
      </div>
    );
  }
}
