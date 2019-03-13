import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import fastclick from 'fastclick'
import notifycation from './components/notification'
import vueLazyLoad from 'vue-lazyload'
import 'common/scss/index.scss'

const notify = notifycation(Vue)
fastclick.attach(document.body)
Vue.config.productionTip = false
Vue.use(vueLazyLoad, {
  error: require('common/image/default.png'),
  loading: require('common/image/default.png')
})
new Vue({
  router,
  store,
  notify,
  render: h => h(App)
}).$mount('#app')
