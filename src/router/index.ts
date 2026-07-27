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
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/RegisterView.vue'),
    },
    {
        path: '/checkout',
        redirect: '/checkout/cod',
    },
    {
        path: '/checkout/cod',
        name: 'checkout-cod',
        component: () => import('../views/CheckoutCodView.vue'),
    },
    {
        path: '/checkout/online',
        name: 'checkout-online',
        component: () => import('../views/CheckoutOnlineView.vue'),
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/AboutView.vue'),
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
