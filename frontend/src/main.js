import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

import "./assets/sass/app.sass";
import "./assets/sass/main.scss";

import "vue2-scrollbar/dist/style/vue2-scrollbar.css";

import ScrollBar from "vue2-scrollbar";

const context = {
  store,
  router
};

import VuetifyDialog from "vuetify-dialog";
Vue.use(VuetifyDialog, {
  context: context
});

// import Quill from 'quill';
// var SizeStyle = Quill.import('attributors/style/size');
// Quill.register(SizeStyle, true);

import VueQuillEditor from "vue-quill-editor";

// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

Vue.use(VueQuillEditor /* { default global options } */);

Vue.use(Vuetify);
Vue.use(ScrollBar);

import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";

const requireComponent = require.context(
  // Относительный путь до каталога компонентов
  "./components",
  // Обрабатывать или нет подкаталоги
  false,
  // Регулярное выражение для определения файлов базовых компонентов
  /R[A-Z]\w+\.(vue|js)$/
);

requireComponent.keys().forEach(fileName => {
  // Получение конфигурации компонента
  const componentConfig = requireComponent(fileName);

  // Получение имени компонента в PascalCase
  const componentName = upperFirst(
    camelCase(
      // Получаем имя файла независимо от глубины вложенности
      fileName
        .split("/")
        .pop()
        .replace(/\.\w+$/, "")
    )
  );

  // Глобальная регистрация компонента
  Vue.component(
    componentName,
    // Поиск опций компонента в `.default`, который будет существовать,
    // если компонент экспортирован с помощью `export default`,
    // иначе будет использован корневой уровень модуля.
    componentConfig.default || componentConfig
  );
});

Vue.prototype.$axios = require("axios").create();
Vue.config.productionTip = false;

import Axios from "axios";

const token = localStorage.getItem("user-token");
if (token) {
  Axios.defaults.headers.common["x-access-token"] = token;
}

export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
