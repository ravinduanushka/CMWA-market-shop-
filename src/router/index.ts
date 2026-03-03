import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/product/:id',
        name: 'product-detail',
        component: () => import('../views/ProductDetailView.vue'),
        props: true,
    },
    {
        path: '/cart',
        name: 'cart',
        component: () => import('../views/CartView.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    },
})

export default router
