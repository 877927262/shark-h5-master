import React, {Component} from "react";

import {httpGet} from "../../../../service";

import util from "../../../../store/util";
const baseUrl = `${util.baseUrl}api/clazz`;

class MaterialDetailPage extends Component {

  constructor(props) {
    super(props);

    // todo 移除state, 好孩子不要学
    this.state = {
      content: ""
    };

    this.mid = this.props.params.materialId;
    this.cid = this.props.params.courseId;
  }

  componentDidMount() {
    // todo 移除setState, 好孩子不要学
    httpGet(`${baseUrl}/${this.cid}/feedback/material/${this.mid}`)
      .then(data => this.setState({content: data.content}))
  }


  render() {
    return (
      <div className="page page-current">
        <header className="bar bar-nav">
          <h1 className="title">素材详情</h1>
          <a className="button button-link button-nav pull-left chat-page-back" onClick={() => history.back()}>
            <span className="icon icon-left"/>
          </a>
        </header>
        <div className="content warp-detail">
          <div dangerouslySetInnerHTML={{__html: this.state.content}}/>
        </div>
      </div>
    )
  }
}

export default MaterialDetailPage;
