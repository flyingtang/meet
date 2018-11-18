const { injectBabelPlugin } = require('react-app-rewired');

// 用于修改默认配置
module.exports = function override(config, env) {
    // do stuff with the webpack config...
    config = injectBabelPlugin(['import', { libraryName: 'antd-mobile', style: 'css' }], config);
    return config;
  };