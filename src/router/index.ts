import Index from '@/views/Index.vue'
import Mytest from '@/views/Mytest.vue'
// import Login from '@/views/Login.vue'
// import Select from '@/views/Select.vue'
import NotFound from '@/views/NotFound.vue'
import Logo from '@/views/Logo/index.vue'
import LogoSelect from '@/views/Logo/select.vue'
import LogoView from '@/views/Logo/result.vue'

// import Pack from '@/views/Pack/index.vue'
// import PackView from '@/views/Pack/imgView.vue'

// import Poster from '@/views/Poster/index.vue'
// import PosterView from '@/views/Poster/imgView.vue'
import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Index
    },
   
   
    {
      path: '/logo',
      name: 'logo',
      component: Logo
    },
    {
      path: '/logo/view',
      name: 'result',
      component: LogoView
    },
    {
      path: '/logo/select',
      name: 'select',
      component: LogoSelect
    }, {
      path: '/test',
      name: 'test',
      component: Mytest
    },
   
   

    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
