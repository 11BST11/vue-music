const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 解决跨域问题
  devServer: {
    proxy: {
      '/api': {
        target: 'https://autumnfish.cn/', // 后端接口
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/api': 'https://autumnfish.cn/'
        }
      }
    }
  }
})
