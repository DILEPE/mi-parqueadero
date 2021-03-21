import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// Pages
import NotFound from './views/NotFound'
import Login from './views/Login'
import Logout from './views/Logout'
import Dashboard from './views/Dashboard'
import Clients from   './views/Clients'
import Tariffs from './views/Tariffs'
import ParkingLots from './views/ParkingLots'
import Transactions from './views/transactions'



// Routes
const router = new VueRouter({
    mode: 'history',
    linkActiveClass: 'is-active',
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login,
        },
        {
            path: '/logout',
            name: 'logout',
            component: Logout,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/clients',
            name: 'clients',
            component: Clients,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/tariffs',
            name: 'tariffs',
            component: Tariffs,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/parking-lots',
            name: 'parking-lots',
            component: ParkingLots,
            meta: {
                requiresAuth: true,
            }
        },
        { 
            path: '/404', 
            name: '404', 
            component: NotFound,
        },
        { 
            path: '*', 
            redirect: '/404', 
        },
        {
            path: '/transactions',
            name: 'transactions',
            component: Transactions,
            meta: {
                requiresAuth: true,
            }
        },
    ],
         
});

export default router