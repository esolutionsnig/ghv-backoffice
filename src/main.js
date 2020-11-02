import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { firestorePlugin } from "vuefire";
import AuthLayout from "./layouts/AuthLayout.vue";
import GeneralLayout from "./layouts/GeneralLayout.vue";
import VTooltip from "v-tooltip";
import { auth } from "./firebase/db";
import VueLocalStorage from "vue-localstorage";
import numeral from "numeral";
import VueMoment from "vue-moment";
import moment from "moment-timezone";
import VueHtmlToPaper from "vue-html-to-paper";
import VueClipboard from "vue-clipboard2";

const options = {
  name: "_blank",
  specs: ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
  styles: [
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
    "https://unpkg.com/kidlat-css/css/kidlat.css"
  ]
};

Vue.use(VueHtmlToPaper, options);

Vue.component("auth-layout", AuthLayout);
Vue.component("general-layout", GeneralLayout);
Vue.use(firestorePlugin);
Vue.use(VueLocalStorage);
Vue.use(VTooltip);
Vue.use(VueClipboard);

Vue.filter("formatNumber", function(value) {
  return numeral(value).format("0,0");
});
Vue.use(VueMoment, {
  moment
});

Vue.config.productionTip = false;

let app;

// Ensure the authStateChanged fires before the app is loaded
// If user is not logged in create new app
auth.onAuthStateChanged(function() {
  if (!app) {
    new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount("#app");
  }
});

// new Vue({
//   router,
//   store,
//   vuetify,
//   render: h => h(App)
// }).$mount("#app");
