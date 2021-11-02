import { createRouter, createWebHistory } from '@ionic/vue-router';
import { Storage } from "@capacitor/storage";
import Tabs from '../views/Tabs.vue'
import SignUp from '../views/SignUp.vue'
import SignIn from '../views/SignIn.vue'

const routes = [
  {
    path: '/',
    redirect: '/signin',
  },
  {
    path: '/signup',
    component: SignUp
  },
  {
    path: '/signin',
    component: SignIn
  },
  // required auth
  {
    path: '/tabs/',
    component: Tabs,
    meta: { requiredAuth: true },
    children: [
      {
        path: '',
        redirect: 'dashboard'
      },
      {
        path: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: 'order',
        component: () => import('@/views/Tab1Order.vue'),
      },
      {
        path: 'order/details',
        component: () => import('@/components/pages/order/CreatePO.vue'),
      },
      {
        path: 'retur',
        component: () => import('@/views/Tab2Retur.vue'),
      },
      {
        path: 'retur/create',
        component: () => import('@/components/pages/retur/CreateRetur.vue'),
      },
      {
        path: 'toko',
        component: () => import('@/views/Tab3Toko.vue'),
      },
      {
        path: 'toko/tambah',
        component: () => import('@/components/pages/toko/TambahToko.vue'),
      },
    ]
  },
  {
    path: '/detailToko',
    component: () => import('@/components/pages/toko/DetailToko.vue'),
    meta: { requiredAuth: true }
  },
  {
    path: '/detailListPO',
    component: () => import('@/components/pages/order/DetailPO.vue'),
    meta: { requiredAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach( async (to, from, next) => {
  
  if (to.matched.some(record => record.meta.requiredAuth)) {
    const dataToken = await Storage.get({ key: "token" })
    if (!dataToken.value || dataToken.value == '' || dataToken.value == 'undefined' || dataToken.value == null) {
      next({ path: '/', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }

})

export default router
