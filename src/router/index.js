import { createRouter, createWebHistory } from 'vue-router'
import BlocklyView from '@/views/BlocklyView.vue'

const routes = [
  {
    path: '/',
    redirect: '/workspace'
  },
  {
    path: '/workspace',
    name: 'Workspace',
    component: BlocklyView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
