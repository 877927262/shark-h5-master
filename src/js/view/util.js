let _ = {};

_.get = (object, key = "", defaultValue = "") => {
  if (object == null) {
    return defaultValue;
  }

  const keyList = key.split(".");

  let nextValue = object;
  for (let nextKey of keyList) {
    nextValue = nextValue[nextKey];

    if (nextValue == null) {
      return defaultValue;
    }
  }

  return nextValue;
};

/**
 * 移除url中search中的特定key
 *
 * @param url
 * @param parameter
 * @returns {*}
 */
_.removeUrlParameter = (url, parameter) => {
  const urlParts = url.split('?');

  if (urlParts.length >= 2) {
    // Get first part, and remove from array
    const urlBase = urlParts.shift();

    // Join it back up
    const queryString = urlParts.join('?');

    const prefix = encodeURIComponent(parameter) + '=';
    const parts = queryString.split(/[&;]/g);

    // Reverse iteration as may be destructive
    for (let i = parts.length - 1; i >= 0; i--) {
      // Idiom for string.startsWith
      if (parts[i].lastIndexOf(prefix, 0) !== -1) {
        parts.splice(i, 1);
      }
    }

    url = urlBase + '?' + parts.join('&');
  }

  return url;
};

_.isValidPhoneNumber = (phoneNumber = "") => /^1[34578]\d{9}$/.test(phoneNumber);

/**
 * 检验是否为ios设备
 */
_.isIOS = () => /ip(hone|od|ad)/i.test(navigator.userAgent);

/**
 * 设置document的title
 * source： https://github.com/miaolz123/vue-helmet/issues/3
 *
 * @param title
 */
_.setDocumentTitle = (title) => {
  document.title = title;
  // 仅在iphone下生效
  if (_.isIOS()) {
    const i = document.createElement('iframe');
    i.src = '/favicon.ico';
    i.style.display = 'none';
    i.onload = () => {
      setTimeout(() => {
        i.remove();
      }, 9)
    };
    document.body.appendChild(i);
  }
};

/**
 * 将数组按照size分割成多个小数组
 *
 * _.chunk(['a', 'b', 'c', 'd'], 3) => [['a', 'b', 'c'], ['d']]
 * @param array
 * @param size
 * @returns {Array}
 */
_.chunk = (array, size) => {
  const result = [];

  for (let idx = 0, len = array.length; idx < len; idx += size) {
    result.push(array.slice(idx, idx + size))
  }

  return result;
};

export default _;
