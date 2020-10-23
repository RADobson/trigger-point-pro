import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Sessions from "../views/Sessions.vue";
import CheckIn from "../views/Checkin.vue";
import Client from "../views/Client.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/register",
    name: "register",
    component: Register
  },
  {
    path: "/sessions",
    name: "sessions",
    component: Sessions
  },
  {
    path: "/checkin/:userID/:sessionID",
    name: "CheckIn",
    component: CheckIn
  },
  {
    path: "/client/:userID/:sessionID",
    name: "Client",
    component: Client
  },
  {
    path: "*",
    redirect: '/'
  },
]

const router = new VueRouter({
  routes
});

export default router;
