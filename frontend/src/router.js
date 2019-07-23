import Vue from "vue";
import Router from "vue-router";
import Gallery from "./views/Gallery";
import Login from "./views/Login";
import Album from "./views/AlbumPage";


import store from "./store";
const C = require("./api/consts");

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import('./views/Home.vue')
    },
    {
      path: "/gallery",
      name: "gallery",
      component: () => import('./views/Gallery.vue')
    },
    {
      path: "/login",
      name: "login",
      component: () => import('./views/Login.vue')
    },
    {
      path: "/album_:id",
      name: "album",
      component: () => import('./views/AlbumPage.vue'),
      props: true
    },
    {
      path: "/about",
      name: "about",
      component: () => import("./views/About.vue")
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (store.getters.isAuthenticated) {
    store
      .dispatch(C.AUTH_CHECK)
      .then(() => {
        next();
      })
      .catch(() => {
        next("/");
      });
  } else next();
});

export default router;
