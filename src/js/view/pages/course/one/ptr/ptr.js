import React, {Component, PropTypes} from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import {LoadMore} from "react-weui";

import {scroll} from "../../../../../store/one/chat";
import WeuiIcon from "../../../../WeuiIcon";

import "./ptr.scss";
class PullToRefresh extends Component {

  static propTypes = {

    height: PropTypes.string,

    loaderHeight: PropTypes.number,

    loaderDefaultIcon: PropTypes.func,

    loaderLoadingIcon: PropTypes.any,

    onRefresh: PropTypes.func,
  };

  static defaultProps = {
    height: "100%",
    loaderHeight: 100,
    loaderDefaultIcon: (progress) => {
      let style = {
        transform: `rotate(-${progress !== 100 ? progress * 1.8 : 0}deg)`,
        color: progress !== 100 ? "#5f5f5f" : "#1AAD19"
      };
      return (
        <div style={{flex: 1, padding: "5px"}}>
          <WeuiIcon value={ progress !== 100 ? "download" : "success" } style={style}/>
        </div>
      )
    },
    loaderLoadingIcon: <LoadMore loading/>,
    onRefresh: (resolve, reject) => setTimeout(() => resolve(), 1000)
  };

  constructor(props) {
    super(props);

    // todo 移除state, 好孩子不要学
    this.state = {
      pullPercent: 0,
      touching: false,
      ogY: 0,
      touchId: undefined,
      animating: false,
      loading: false,
      initScrollTop: 0
    };

    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.resolveRefresh = this.resolveRefresh.bind(this)

  }

  resolveRefresh() {
    // todo 移除setState, 好孩子不要学
    this.setState({
      loading: false,
      animating: true,
      pullPercent: 0
    }, () => {
      // todo 移除setState, 好孩子不要学
      setTimeout(() => this.setState({animating: false}), 500)
    })
  }

  handleTouchStart(e) {
    if (this.state.touching || this.state.loading) return;

    let $content = ReactDOM.findDOMNode(this.refs.content)

    // todo 移除setState, 好孩子不要学
    this.setState({
      touching: true,
      touchId: e.targetTouches[0].identifier,
      ogY: this.state.pullPercent == 0 ? e.targetTouches[0].pageY : e.targetTouches[0].pageY - this.state.pullPercent,
      animating: false,
      initScrollTop: $content.scrollTop
    })
  }

  handleTouchMove(e) {
    if (!this.state.touching || this.state.loading) return;
    if (e.targetTouches[0].identifier !== this.state.touchId) return;


    const pageY = e.targetTouches[0].pageY;
    let diffY = pageY - this.state.ogY;

    //if it"s scroll
    if (diffY < 0) return;

    //if it"s not at top
    let $content = ReactDOM.findDOMNode(this.refs.content)
    if ($content.scrollTop > 0) return;

    //prevent move background
    e.preventDefault();

    diffY = ( diffY - this.state.initScrollTop ) > 100 ? 100 : ( diffY - this.state.initScrollTop )

    // todo 移除setState, 好孩子不要学
    this.setState({
      pullPercent: diffY
    })
  }

  handleTouchEnd(e) {
    if (!this.state.touching || this.state.loading) return;

    let pullPercent = this.state.pullPercent;
    let loading = false;

    if (pullPercent === 100) {
      loading = true
    } else {
      pullPercent = 0
    }

    // todo 移除setState, 好孩子不要学
    this.setState({
      touching: false,
      ogY: 0,
      touchId: undefined,
      initScrollTop: 0,
      animating: loading,
      pullPercent,
      loading
    }, () => {
      if (loading) this.props.onRefresh(this.resolveRefresh)
    })
  }

  componentDidUpdate() {
    scroll.getNode(this.refs.content);
  }

  render() {
    const {className, children, height, loaderHeight, loaderDefaultIcon, loaderLoadingIcon, onRefresh, ...domProps} = this.props
    let cls = classNames("react-weui-ptr", className);

    let containerStyle = {
      height,
    };

    let loaderStyle = {
      //transform: `translate(0, ${this.state.pullPercent / 2}px)`,
      height: loaderHeight,
      marginTop: `${ -loaderHeight + (this.state.pullPercent / (100 / loaderHeight))}px`,
      transition: this.state.animating ? "all .5s" : "none"
    };

    return (
      <div className={cls} style={ containerStyle } {...domProps}>
        <div
          className="react-weui-ptr__loader"
          style={loaderStyle}
        >
          {
            this.state.loading
              ? loaderLoadingIcon
              : loaderDefaultIcon(this.state.pullPercent)
          }
        </div>
        <div
          className="react-weui-ptr__content"
          ref="content"
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
        >
          { children }
        </div>
      </div>
    )
  }

}

export default PullToRefresh;
