import React, {Component, PropTypes} from "react";

export default class WeuiToast extends Component {

  constructor(props) {
    super(props);
  };

  static propTypes = {
    /**
     * Icon Value
     *
     */
    icon: PropTypes.string,
    /**
     * Icon Size
     *
     */
    iconSize: PropTypes.string,
    /**
     * display toast
     *
     */
    show: PropTypes.bool
  };

  static defaultProps = {
    icon: 'toast',
    iconSize: '',
    show: false,
  };

  render() {
    const {className, icon, show, children, iconSize, ...others} = this.props;

    const iconTypeClassName = (icon === 'loading') ? 'weui-loading' : `weui-icon-${ icon }`;
    const iconSizeClassName = (iconSize === 'large') ? 'weui-icon_msg' : '';

    return (
        <div style={{display: show ? 'block' : 'none'}}>
          <div className="weui-mask_transparent"></div>
          <div className={`weui-toast ${ className }`} {...others}>
            <i className={`weui-icon_toast ${ iconTypeClassName } ${ iconSizeClassName }`}/>
            <p className="weui-toast__content">{children}</p>
          </div>
        </div>
    );
  }
}
