import "@fortawesome/fontawesome-free/css/all.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import VueGoogleCharts from "vue-google-charts";

Vue.use(Vuetify);
Vue.use(VueGoogleCharts);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#183153",
        secondary: "#af0000",
        accent: "#01579B",
        error: "#F44336",
        info: "#2196F3",
        success: "#00BFA5",
        warning: "#FF8F00"
      }
    }
  },
  icons: {
    iconfont: "md" || "fa"
  }
});
