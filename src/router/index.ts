import HomeView from '@/views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import AttendeesView from '@/views/AttendeesView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ResultView from '@/views/ResultView.vue'
import TargetTeamName from '@/overlays/TargetTeamName.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/attendees',
      name: 'attendees',
      component: AttendeesView,
    },
    {
      path: '/results/round/:id',
      name: 'results by round',
      component: ResultView,
    },
    {
      path: '/overlay/target/:targetCode/teamname',
      name: 'OVERLAY target-teamname',
      component: TargetTeamName,
      props: true,
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

export default router
