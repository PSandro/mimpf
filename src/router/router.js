import {
    createWebHistory,
    createRouter
} from 'vue-router'

const Home = () => import('@/components/Home.vue');
const Reception = () => import('@/components/reception/Reception.vue');

const history = createWebHistory();
const router = createRouter({
    history,
    routes: [{
            path: '/',
            component: Home
        },
        {
            path: '/reception/',
            component: Reception
        }
    ]
});

export default router
