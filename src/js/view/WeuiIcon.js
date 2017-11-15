import React, { Component, PropTypes } from "react";

export default class WeuiIcon extends React.Component {
  static propTypes = {
    /**
     * types of [weui icons](https://github.com/weui/weui/wiki/Icon)
     *
     */
    value: PropTypes.string,
    /**
     * size of icon, options: small/large
     *
     */
    size: PropTypes.string
  };

  static defaultProps = {
    value: 'success',
    size: 'small'
  };

  render() {
    const { value, size, className, primary, ...others } = this.props;

    const iconType = (value === 'loading') ? 'weui-loading' : `weui-icon-${ value }`;
    const iconSize = (size === 'large')
            ? primary
              ? 'weui-icon_msg-primary'
              : 'weui-icon_msg'
            : '';

    return (
        <i {...others} className={`${ iconType } ${ iconSize } ${ className }`}/>
    );
  }
}
