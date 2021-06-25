module.exports = {
  devServer: {
    proxy: {
      '^/plytic': {
        target: 'https://www.plytic.com/api/v1/authors/',
        pathRewrite: { '^/plytic': '' },
        changeOrigin: true,
        ws: true
      },
      '^/spur': {
        target: 'https://spur.us/context/',
        pathRewrite: { '^/spur': '' },
        changeOrigin: true,
        ws: true
      },
    }
  },
  transpileDependencies: [
    'vuetify'
  ]
}
