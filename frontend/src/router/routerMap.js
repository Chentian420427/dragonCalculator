/**
 * 基础路由
 * @type { *[] }
 */

const constantRouterMap = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/example/hello/login.vue')
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('@/views/example/hello/Index.vue')
  }
]

export default constantRouterMap