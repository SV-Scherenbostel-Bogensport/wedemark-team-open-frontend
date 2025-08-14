<template>
  <div class="navigation-collection">
    <div class="container">
      <div class="button-grid mt-20">
        <button
          v-for="button in buttons"
          :key="button.id"
          @click="navigateTo(button.route)"
          :class="['nav-button', button.gradient]"
        >
          <i :class="[button.icon, 'button-icon']"></i>
          <span class="button-text">{{ button.text }}</span>
        </button>
      </div>

      <!-- Info Panel -->
      <div v-if="lastNavigation" class="info-panel">
        <h2 class="info-title">Letzte Navigation:</h2>
        <p class="info-text">{{ lastNavigation }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'NavigationCollection',
  data() {
    return {
      lastNavigation: '',
      buttons: [
        {
          id: 1,
          text: 'Leaderboard Qualifikationsrunde',
          icon: 'pi pi-trophy',
          route: '/showcase/placement?qualification',
          gradient: 'gradient-indigo',
        },
        {
          id: 2,
          text: 'Leaderboard Finalrunde',
          icon: 'pi pi-trophy',
          route: '/showcase/placement?final',
          gradient: 'gradient-indigo',
        },
        {
          id: 3,
          text: 'Aktuelle Rundenergebnisse',
          icon: 'pi pi-star',
          route: '/showcase/results',
          gradient: 'gradient-cyan',
        },
        {
          id: 3,
          text: 'Leaderboard Runde 2',
          icon: 'pi pi-star',
          route: '/showcase/results',
          gradient: 'gradient-cyan',
        },
        {
          id: 3,
          text: 'Leaderboard Runde 2',
          icon: 'pi pi-star',
          route: '/showcase/results',
          gradient: 'gradient-cyan',
        },
        {
          id: 3,
          text: 'Leaderboard Runde 2',
          icon: 'pi pi-star',
          route: '/showcase/results',
          gradient: 'gradient-cyan',
        },
        {
          id: 3,
          text: 'Leaderboard Runde 2',
          icon: 'pi pi-star',
          route: '/showcase/results',
          gradient: 'gradient-cyan',
        },
        // {
        //   id: 3,
        //   text: 'Matches Runde 1',
        //   icon: 'pi pi-users',
        //   route: '/matches/round1',
        //   gradient: 'gradient-blue',
        // },
        // {
        //   id: 4,
        //   text: 'Matches Runde 2',
        //   icon: 'pi pi-play',
        //   route: '/matches/round2',
        //   gradient: 'gradient-green',
        // },
        // {
        //   id: 5,
        //   text: 'Turnier Statistiken',
        //   icon: 'pi pi-chart-bar',
        //   route: '/statistics',
        //   gradient: 'gradient-cyan',
        // },
        // {
        //   id: 6,
        //   text: 'Spieler Rankings',
        //   icon: 'pi pi-crown',
        //   route: '/rankings',
        //   gradient: 'gradient-gold',
        // },
        // {
        //   id: 7,
        //   text: 'Turnier Kalender',
        //   icon: 'pi pi-calendar',
        //   route: '/calendar',
        //   gradient: 'gradient-orange',
        // },
        // {
        //   id: 8,
        //   text: 'Top Performances',
        //   icon: 'pi pi-thumbs-up',
        //   route: '/performances',
        //   gradient: 'gradient-emerald',
        // },
        // {
        //   id: 9,
        //   text: 'Team Management',
        //   icon: 'pi pi-sitemap',
        //   route: '/teams',
        //   gradient: 'gradient-rose',
        // },
        // {
        //   id: 10,
        //   text: 'Finale Ergebnisse',
        //   icon: 'pi pi-flag',
        //   route: '/finals',
        //   gradient: 'gradient-violet',
        // },
      ],
    }
  },
  methods: {
    navigateTo(route: string): void {
      // Vue Router Navigation
      this.$router.push(route)

      this.lastNavigation = `Navigation zu: ${route}`
      console.log(`Navigating to: ${route}`)
    },
  },
}
</script>

<style scoped>
.navigation-collection {
  padding: 2rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #000000 100%);
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #60a5fa 0%, #a855f7 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.nav-button {
  position: relative;
  padding: 1.5rem;
  border-radius: 1rem;
  font-weight: 600;
  color: white;
  font-size: 1.125rem;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.nav-button:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.nav-button:active {
  transform: translateY(-2px) scale(1.02);
}

.nav-button::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: inherit;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
  filter: blur(8px);
}

.nav-button:hover::before {
  opacity: 0.7;
}

.nav-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.nav-button:hover::after {
  left: 100%;
}

.button-icon {
  font-size: 2rem;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
  z-index: 1;
}

.nav-button:hover .button-icon {
  transform: scale(1.1);
}

.button-text {
  text-align: center;
  line-height: 1.2;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  z-index: 1;
}

/* Gradient Classes */
.gradient-gold {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #dc2626 100%);
}

.gradient-purple {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #dc2626 100%);
}

.gradient-blue {
  background: linear-gradient(135deg, #60a5fa 0%, #a855f7 50%, #ec4899 100%);
}

.gradient-green {
  background: linear-gradient(135deg, #34d399 0%, #3b82f6 50%, #a855f7 100%);
}

.gradient-cyan {
  background: linear-gradient(135deg, #22d3ee 0%, #14b8a6 50%, #059669 100%);
}

.gradient-indigo {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
}

.gradient-orange {
  background: linear-gradient(135deg, #fb923c 0%, #dc2626 50%, #ec4899 100%);
}

.gradient-emerald {
  background: linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%);
}

.gradient-rose {
  background: linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #be185d 100%);
}

.gradient-violet {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%);
}

.info-panel {
  margin-top: 4rem;
  padding: 1.5rem;
  background: rgba(31, 41, 55, 0.5);
  border-radius: 0.75rem;
  border: 1px solid rgba(107, 114, 128, 1);
}

.info-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
}

.info-text {
  color: #10b981;
  font-size: 1.125rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .button-grid {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 2rem;
  }

  .nav-button {
    min-height: 120px;
  }
}
</style>
