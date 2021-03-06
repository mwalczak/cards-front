import Vue from 'vue';
import App from './app.vue';
import store from './store';
import router from './router';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import VueClipboard from 'vue-clipboard2';
import VueScrollTo from 'vue-scrollto';

Vue.config.productionTip = false;
Vue.use(Buefy);
Vue.use(VueClipboard);
Vue.use(VueScrollTo);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
