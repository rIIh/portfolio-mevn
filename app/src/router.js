import Vue from "vue";
import Router from "vue-router";

import store from "./store";
const C = require("./api/consts");

Vue.use(Router);

const title = 'Yura Taralov'

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [{
      path: "/",
      name: "home",
      component: () => import('./views/Home.vue'),
      meta: {
        title
      }
    },
    {
      path: "/gallery",
      name: "gallery",
      component: () => import('./views/Gallery.vue'),
      meta: {
        title: `${title} - Gallery`,
      }
    },
    {
      path: "/login",
      name: "login",
      component: () => import('./views/Login.vue'),
      meta: {
        title: `${title} - Login Page`,
      }
    },
    {
      path: "/album_:id",
      name: "album",
      component: () => import('./views/AlbumPage.vue'),
      props: true,
      meta: {
        title: `${title} - Album Page`,
      }
    },
    {
      path: "/about",
      name: "about",
      component: () => import("./views/About.vue"),
      meta: {
        title: `${title} - About`,
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (store.getters.isAuthenticated) {
    store
      .dispatch(C.AUTH_CHECK)
      .then(() => {
        next();
        if (router.app.$gtm) {
          router.app.$gtm.trackEvent({
            event: "auth_success",
            category: "Internal"
          });
        }
      })
      .catch((err) => {
        console.error("Failed authentication check", err)
        next("/");
      });
  } else next();
});

export default router;