import {
  createWebHistory,
  createRouter
} from 'vue-router'

const DatabaseConnection = () => import('@/components/DatabaseConnection.vue');
const Home = () => import('@/components/Home.vue');
const Appointments = () => import('@/components/Appointments.vue');
const AppointmentTable = () => import('@/components/AppointmentTable.vue');
const AppointmentImport = () => import('@/components/AppointmentImport.vue');
const EnqueueForm = () => import('@/components/EnqueueForm.vue');
const Queue = () => import('@/components/Queue.vue');

const history = createWebHistory();
const router = createRouter({
  history,
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'appointments',
          path: 'appointments',
          component: Appointments,
          children: [
            {
              name: 'view',
              path: 'view',
              component: AppointmentTable
            },
            {
              name: 'enqueue',
              path: 'enqueue',
              component: EnqueueForm
            }
          ]
        },
        {
          name: 'queue',
          path: 'queue',
          component: Queue
        },
        {
          name: 'settings',
          path: '/settings',
          component: DatabaseConnection
        },
        {
          name: 'import',
          path: '/import',
          component: AppointmentImport
        },
      ]
    },
  ]
});

export default router
