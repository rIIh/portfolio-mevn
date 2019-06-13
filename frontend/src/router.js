import Vue from "vue";
import Router from "vue-router";
import Gallery from "./views/Gallery";
import Login from "./views/Login";
import Album from "./views/AlbumPage";
import Home from "./views/Home";

import store from "./store";
const C = require("./api/consts");

Vue.use(Router);

// // ? Maybe not
// const ifNotAuthenticated = (to, from, next) => {
//   if (!store.getters.isAuthenticated) {
//     next()
//     return
//   }
//   next('/')
// }

// const ifAuthenticated = (to, from, next) => {
//   if (store.getters.isAuthenticated) {
//     next()
//     return
//   }
//   next('/login')
// }

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/gallery",
      name: "gallery",
      component: Gallery
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/album_:id",
      name: "album",
      component: Album,
      props: true
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
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
