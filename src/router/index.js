import { createRouter, createWebHashHistory } from 'vue-router'
import AppHome from '../views/AppHome.vue'
import { getAuth } from "firebase/auth";

const routes = [
  {
    path: '/',
    name: 'AppHome',
    component: AppHome
  },
  {
        path: '/about',
        name: 'AppAbout',
        meta: {requiresAuth: true},
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/AppAbout.vue')
  }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
  })
  
  router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)){
      const auth = getAuth();
      const usuario = auth.currentUser;
      console.log ('usuario desde router', usuario)
      if(!usuario){
        next({path: '/'})
      }else{
        next()
      }
    } else {
      next()
    }
  })

export default router
