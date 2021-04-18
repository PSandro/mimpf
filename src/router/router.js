import {
  createWebHistory,
  createRouter
} from 'vue-router'

const Home = () => import('@/components/Home.vue');
const Reception = () => import('@/components/reception/Reception.vue');
const Appointments = () => import('@/components/Appointments.vue');

const history = createWebHistory();
const router = createRouter({
  history,
  routes: [{
    name: 'home',
    path: '/',
    component: Home
  },
  {
    name: 'reception',
    path: '/reception',
    component: Reception,
    children: [
      {
        name: 'appointments',
        path: 'appointments',
        component: Appointments
      }
    ]
  },
  ]
});

export default router
