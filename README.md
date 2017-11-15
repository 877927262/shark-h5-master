# shark-h5
注意：前端采用的gulp为gulp4，如果npm install出现问题需要单独从github上下载


## 使用方式
----------

1.找到`src/js/config.js.back` 复制为 `src/js/config.js`，然后更新`config.js`文件中的`token`和`baseUrl`

  其中 `token` 更新为paw中auth的最新token就好，其中`baseUrl`的return的url改为`//h5test.gambition.cn/`

2.在项目根目录打开终端，输入`npm install`,安装所有依赖包。

  `$ npm install`

3.输入`npm run wpdll`来编译打包所有的第三方依赖。

  `$ npm run wpdll`

4.输入`npm start`来启动`gulp`,在浏览器中输入`localhost:5000`来观察效果。

  `$ npm start`
  
## 开发规范
---------------
### 命名：
1. js变量命名: 名词短语，采用驼峰法；最多5个单词，不推荐缩写；复数在后面增加List，而不是复数形式; 如 `courseList`，`currentPanel` 
2. css类名: 采用`-`分隔，名词短语；最多5个单词，不推荐缩写。如`bar-tab`， `course-title`
3. 函数名： 动词短语，采用驼峰法；最多5个单词，不推荐缩写。如`hideCancelCheckinDialog`， `setCheckinList`
4. 私有函数： 以`_`开头，其他参见`3. 函数名`。如`_fetchCourseList`
5. class名，采用大写驼峰法，即每个单词首字母均采用大写，最多5个单词，不推荐缩写。如`CheckinCenter`, `ActivityEnroll`


### react
因采用`mbox`进行`state`的管理，不推荐直接使用`this.state`及`this.setState`来申明或更新`state`

## UI 库
---------------
本项目使用了如下两个UI库
1. [SUI Mobile](http://m.sui.taobao.org/components/): 使用其样式
2. [React WeUI](https://weui.github.io/react-weui/docs/#/react-weui/docs/page/1/articles/0)： 使用其元素


## 添加新的Image
---------------

当添加了新的img之后，需要做的是：

1.在项目根目录，输入`npm run refresh-img`，更新雪碧图并刷新`style/icons-sprite.scss`;

  `npm run refresh-img`

2.手动在`style/icons.scss`中引入新的`style/icons-sprite.scss`图。


## Reference
------------

1. Mobx @computed 和直接 get 的区别的解读：[MobX中@computed和自定义get函数的区别](http://blog.csdn.net/cqm1994617/article/details/53271494) 以及 [What's difference between @computed decorator and getter function](https://github.com/mobxjs/mobx/issues/161)
2. [微信开发常见问题](http://kf.qq.com/faq/140225MveaUz150413VNj6nm.html)
3. [駝峰式大小寫](https://zh.wikipedia.org/wiki/%E9%A7%9D%E5%B3%B0%E5%BC%8F%E5%A4%A7%E5%B0%8F%E5%AF%AB)
