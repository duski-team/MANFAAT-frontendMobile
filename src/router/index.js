import { createRouter, createWebHistory } from '@ionic/vue-router';
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
  {
    path: '/tabs/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: 'order'
      },
      {
        path: 'order',
        component: () => import('@/views/Tab1Order.vue')
      },
      {
        path: 'order/details',
        component: () => import('@/components/pages/CreatePO.vue')
      },
      
      {
        path: 'retur',
        component: () => import('@/views/Tab2Retur.vue')
      },
      {
        path: 'retur/create',
        component: () => import('@/components/pages/CreateRetur.vue')
      },
      
      {
        path: 'toko',
        component: () => import('@/views/Tab3Toko.vue')
      },
      {
        path: 'toko/tambah',
        component: () => import('@/components/pages/TambahToko.vue')
      },
    ]
  },
  {
    path: '/detailToko',
    component: () => import('@/components/pages/DetailToko.vue')
  },
  {
    path: '/detailListPO',
    component: () => import('@/components/pages/DetailPO.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
