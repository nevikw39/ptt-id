module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/ptt-id/'
    : '/',
  transpileDependencies: [
    'vuetify'
  ]
}
