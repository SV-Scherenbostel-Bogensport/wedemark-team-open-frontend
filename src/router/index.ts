import HomeView from '@/views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import AttendeesView from '@/views/AttendeesView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import RoundResultView from '@/views/RoundResultView.vue'
import TargetTeamName from '@/overlays/TargetTeamName.vue'
import QualificationPlacementView from '@/views/QualificationPlacementView.vue'
import FinalPlacementView from '@/views/FinalPlacementView.vue'
import TargetCode from '@/overlays/TargetCode.vue'
import ShowcaseRoundResultView from '@/views/ShowcaseRoundResultView.vue'
import ShowCaseView from '@/views/ShowCaseView.vue'
import ShowcasePlacement from '@/views/ShowcasePlacementView.vue'

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
      path: '/results/rounds/:id',
      name: 'results by round TODO: auf /results ändern später',
      component: RoundResultView,
    },
    {
      path: '/showcase/results',
      name: 'showcase: results by round',
      component: ShowcaseRoundResultView,
    },
    {
      path: '/showcase/placement',
      name: 'showcase: current placement',
      component: ShowcasePlacement,
    },
    {
      path: '/showcase',
      name: 'showcase overview',
      component: ShowCaseView,
    },
    {
      path: '/placement',
      redirect: { name: 'qualification placement' },
    },
    {
      path: '/placement/qualification',
      name: 'qualification placement',
      component: QualificationPlacementView,
    },
    {
      path: '/placement/final',
      name: 'final placement',
      component: FinalPlacementView,
    },
    {
      path: '/overlay/target/:targetCode/teamname',
      name: 'OVERLAY target-teamname',
      component: TargetTeamName,
      props: true,
    },
    {
      path: '/overlay/target/:targetCode/target',
      name: 'OVERLAY target-code',
      component: TargetCode,
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
