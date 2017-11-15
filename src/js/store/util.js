import util from "../config";
import _ from "../view/util";

export const curry = f => {
  return function () {
    let args = Array.prototype.slice.call(arguments, 0);

    if (args.length < f.length) {
      return function () {
        let _args = args.concat(Array.prototype.slice.call(arguments, 0));
        return curry(f).apply(this, _args);
      }
    }
    else return f.apply(this, args);
  }
};

util.get = _.get;

/**
 * 清除html标签中的class及style
 *
 * @param nodeElement
 */
util.clearNodeClazzAndStyle = (nodeElement) => {
  return nodeElement.replace(/class\s*=\s*"[^"]*"/g, "").replace(/style\s*=\s*"[^"]*"/g, "");
};

util.formatAudioTimer = (num) => {
  const s = 0 | Number(num) % 60,
    m = 0 | Number(num) / 60;

  return `${("0" + m).slice(-2)}:${("0" + s).slice(-2)}`;
};

export default util;
