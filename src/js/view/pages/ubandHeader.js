'use strict';

import React, { Component } from "react";
import IMAGE_URL_MAP from "../BigImageUrl";

import '../../../style/uband-header.scss'

class UbandHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <header className="bar bar-nav uband-header">
        <h1 className="title header-title">
          <span>
            <img src={IMAGE_URL_MAP["LOGO"]} className="logo-img" />
          </span>
        </h1>
      </header>
    )
  }
}

export default UbandHeader;
