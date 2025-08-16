<script lang="ts" setup>
function initScrollingText(): void {
  // Warte bis CSS geladen ist
  setTimeout(() => {
    const containers: NodeListOf<HTMLElement> = document.querySelectorAll('.tn')

    containers.forEach((container: HTMLElement) => {
      const textElement: HTMLElement | null = container.querySelector('.tn-text')

      if (!textElement) return // Null-Check

      const containerWidth: number = container.offsetWidth - 6 // Abzüglich padding

      // Temporär messen ohne Animation
      textElement.style.animation = 'none'
      const textWidth: number = textElement.scrollWidth

      console.log(`Container: ${containerWidth}px, Text: ${textWidth}px`)

      // Nur wenn Text breiter als Container ist
      if (textWidth > containerWidth) {
        container.classList.add('long-text')

        // Berechne wie viel der Text scrollen muss
        container.style.setProperty('--container-width', `${containerWidth}px`)

        // Animation wieder aktivieren
        textElement.style.animation = ''
      } else {
        // Kurze Texte: keine Animation
        container.classList.remove('long-text')
      }
    })
  }, 100)
}

// Beim Laden der Seite ausführen
document.addEventListener('DOMContentLoaded', initScrollingText)

// Auch bei Größenänderungen
window.addEventListener('resize', initScrollingText)
</script>

<style scoped>
table {
  table-layout: fixed; /* verhindert automatische Breite */
  border-collapse: collapse;
}

td,
th {
  /* border: 1px solid red; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 25px;
  max-height: 25px;
  position: relative;
}

.cell-xs {
  width: 25px;
  max-width: 25px;
}

.cell-lg {
  width: 150px;
  max-width: 150px;
}

.hr,
.hl,
.v,
.h {
  overflow: visible;
  position: relative;
}

.hr::before,
.hl::before,
.h::before {
  content: '';
  position: absolute;
  top: -1px;
  height: 2px;
  background-color: white;
}

.hr::before {
  width: 75%;
  right: -1px;
}

.hl::before {
  width: 75%;
  left: -1px;
}

.h::before {
  width: 100%; /* Ganze Breite */
  left: 0;
}

.v::after {
  content: '';
  position: absolute;
  top: 0;
  left: -1px;
  width: 2px;
  height: 100%;
  background-color: white;
}

.rn {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 2px;
  border: 1px solid black;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.Match {
  /* background-color: red; */
  font-weight: bold;
  color: silver;
}

.tc {
  background-color: rgba(0, 50, 255, 0.5);
  border-radius: 2px;
  text-align: center;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 50, 255, 0.4);
  height: 90%;
  width: 90%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid darkblue;
}

.tn {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 2px;
  text-align: center;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  height: 90%;
  width: 98%;
  margin: auto;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  border: 1px solid black;
}

.tn-text {
  white-space: nowrap;
  padding-left: 3px;
  position: relative;
}

.tn.long-text .tn-text {
  animation: scrollText 5s linear infinite;
  top: -1px;
}

@keyframes scrollText {
  0%,
  10% {
    transform: translateX(0); /* Start Position, kurz warten */
  }
  50%,
  85% {
    transform: translateX(calc(-100% + var(--container-width))); /* Dynamische Berechnung */
  }
  85.01% {
    transform: translateX(0); /* Instant zurückspringen */
  }
  100% {
    transform: translateX(0); /* Kurze Pause */
  }
}

.mp {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 2px;
  text-align: center;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  height: 90%;
  width: 90%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
}
</style>

<template>
  <div style="width: 95%" class="text-white">
    <table class="border-collapse table-fixed" style="width: 100%">
      <colgroup>
        <col class="w-1/68" />
        <col class="w-6/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-6/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-6/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-6/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-6/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-6/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-1/68" />
        <col class="w-6/68" />
        <col class="w-1/68" />
      </colgroup>

      <tbody>
        <tr>
          <th colspan="3"><div class="rn">Grün</div></th>
          <th colspan="2"></th>
          <th colspan="3"><div class="rn">Gelb</div></th>
          <th colspan="2"></th>
          <th colspan="3"><div class="rn">Grau</div></th>
          <th colspan="2"></th>
          <th colspan="3"><div class="rn">Orange</div></th>
          <th colspan="2"></th>
          <th colspan="3"><div class="rn">Rosa</div></th>
          <th colspan="2"></th>
          <th colspan="3"><div class="rn">Rot</div></th>
          <th colspan="2"></th>
          <th colspan="3"><div class="rn">Rot</div></th>
        </tr>

        <tr>
          <th colspan="33"></th>
        </tr>

        <tr>
          <td colspan="3"><div class="Match">Match 1</div></td>
        </tr>

        <tr>
          <td class="cell-xs"><div class="tc">1</div></td>
          <td class="cell-lg">
            <div class="tn">
              <span class="tn-text">SV name ssssssssssssa</span>
            </div>
          </td>
          <td class="cell-xs"><div class="mp">6</div></td>
        </tr>

        <tr>
          <td class="cell-xs"><div class="tc">2</div></td>
          <td class="cell-lg">
            <div class="tn"><span class="tn-text">Kurzer Name</span></div>
          </td>
          <td class="cell-xs"><div class="mp">2</div></td>

          <td class="cell-xs hr" />
          <td class="cell-xs v" />

          <td colspan="3"><div class="Match">Match 5</div></td>
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
          <td class="cell-xs"><div class="tc">TC5</div></td>
          <td class="cell-lg"><div class="tn">TN5</div></td>
          <td class="cell-xs"><div class="mp">MP5</div></td>
        </tr>

        <tr>
          <td colspan="3"><div class="Match">Match 2</div></td>

          <td class="cell-xs" />
          <td class="cell-xs v hl" />

          <td class="cell-xs"><div class="tc">TC5</div></td>
          <td class="cell-lg"><div class="tn">TN5</div></td>
          <td class="cell-xs"><div class="mp">MP5</div></td>

          <td class="cell-xs hr" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs"><div class="tc">TC2</div></td>
          <td class="cell-lg"><div class="tn">TN2</div></td>
          <td class="cell-xs"><div class="mp">MP2</div></td>

          <td class="cell-xs" />
          <td class="cell-xs v" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs"><div class="tc">TC2</div></td>
          <td class="cell-lg"><div class="tn">TN2</div></td>
          <td class="cell-xs"><div class="mp">MP2</div></td>

          <td class="cell-xs hr" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td colspan="3"><div class="Match">Match 12</div></td>
        </tr>

        <tr>
          <td class="cell-xs" />

          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs"><div class="tc">TC12</div></td>
          <td class="cell-lg"><div class="tn">TN12</div></td>
          <td class="cell-xs"><div class="mp">MP12</div></td>
        </tr>

        <tr>
          <td colspan="3"><div class="Match">Match 3</div></td>

          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs h v" />
          <td class="cell-xs h" />
          <td class="cell-xs h" />
          <td class="cell-xs h" />
          <td class="cell-xs h" />
          <td class="cell-xs hl" />

          <td class="cell-xs"><div class="tc">TC12</div></td>
          <td class="cell-lg"><div class="tn">TN12</div></td>
          <td class="cell-xs"><div class="mp">MP12</div></td>

          <td class="cell-xs hr" />
          <td class="cell-xs h" />
          <td class="cell-xs h" />
          <td class="cell-xs h" />
          <td class="cell-xs h" />
          <td class="cell-xs h" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs"><div class="tc">TC3</div></td>
          <td class="cell-lg"><div class="tn">TN3</div></td>
          <td class="cell-xs"><div class="mp">MP3</div></td>

          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs"><div class="tc">TC3</div></td>
          <td class="cell-lg"><div class="tn">TN3</div></td>
          <td class="cell-xs"><div class="mp">MP3</div></td>

          <td class="cell-xs hr" />
          <td class="cell-xs v" />

          <td colspan="3"><div class="Match">Match 6</div></td>
          <td class="cell-xs" />
          <td class="cell-xs v" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />

          <td class="cell-xs"><div class="tc">TC6</div></td>
          <td class="cell-lg"><div class="tn">TN6</div></td>
          <td class="cell-xs"><div class="mp">MP6</div></td>
          <td class="cell-xs" />
          <td class="cell-xs v" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td colspan="3"><div class="Match">Match 4</div></td>

          <td class="cell-xs" />
          <td class="cell-xs hl v" />

          <td class="cell-xs"><div class="tc">TC6</div></td>
          <td class="cell-lg"><div class="tn">TN6</div></td>
          <td class="cell-xs"><div class="mp">MP6</div></td>
          <td class="cell-xs hr" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs"><div class="tc">TC4</div></td>
          <td class="cell-lg"><div class="tn">TN4</div></td>
          <td class="cell-xs"><div class="mp">MP4</div></td>

          <td class="cell-xs" />
          <td class="cell-xs v" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />

          <td colspan="3"><div class="Match">Match 16</div></td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td colspan="3"><div class="Match">Match 17</div></td>
        </tr>

        <tr>
          <td class="cell-xs"><div class="tc">TC4</div></td>
          <td class="cell-lg"><div class="tn">TN4</div></td>
          <td class="cell-xs"><div class="mp">MP4</div></td>

          <td class="cell-xs hr" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />

          <td class="cell-xs"><div class="tc">TC16</div></td>
          <td class="cell-lg"><div class="tn">TN16</div></td>
          <td class="cell-xs"><div class="mp">MP16</div></td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs"><div class="tc">TC17</div></td>
          <td class="cell-lg"><div class="tn">TN17</div></td>
          <td class="cell-xs"><div class="mp">MP17</div></td>
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs hl v" />

          <td class="cell-xs"><div class="tc">TC16</div></td>
          <td class="cell-lg"><div class="tn">TN16</div></td>
          <td class="cell-xs"><div class="mp">MP16</div></td>

          <td class="cell-xs hr" />
          <td class="cell-xs hl" />

          <td class="cell-xs"><div class="tc">TC17</div></td>
          <td class="cell-lg"><div class="tn">TN17</div></td>
          <td class="cell-xs"><div class="mp">MP17</div></td>
        </tr>
        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>
        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td colspan="3"><div class="Match">Match 7</div></td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td colspan="3"><div class="Match">Match 9</div></td>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs"><div class="tc">TC7</div></td>
          <td class="cell-lg"><div class="tn">TN7</div></td>
          <td class="cell-xs"><div class="mp">MP7</div></td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs"><div class="tc">TC9</div></td>
          <td class="cell-lg"><div class="tn">TN9</div></td>
          <td class="cell-xs"><div class="mp">MP9</div></td>

          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs"><div class="tc">TC7</div></td>
          <td class="cell-lg"><div class="tn">TN7</div></td>
          <td class="cell-xs"><div class="mp">MP7</div></td>

          <td class="cell-xs hr" />
          <td class="cell-xs hl" />

          <td class="cell-xs"><div class="tc">TC9</div></td>
          <td class="cell-lg"><div class="tn">TN9</div></td>
          <td class="cell-xs"><div class="mp">MP9</div></td>

          <td class="cell-xs hr" />
          <td class="cell-xs v" />

          <td colspan="3"><div class="Match">Match 13</div></td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td colspan="3"><div class="Match">Match 15</div></td>

          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs v" />

          <td class="cell-xs"><div class="tc">TC13</div></td>
          <td class="cell-lg"><div class="tn">TN13</div></td>
          <td class="cell-xs"><div class="mp">MP13</div></td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs"><div class="tc">TC15</div></td>
          <td class="cell-lg"><div class="tn">TN15</div></td>
          <td class="cell-xs"><div class="mp">MP15</div></td>

          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td colspan="3"><div class="Match">Match 8</div></td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td colspan="3"><div class="Match">Match 10</div></td>

          <td class="cell-xs" />
          <td class="cell-xs hl v" />

          <td class="cell-xs"><div class="tc">TC13</div></td>
          <td class="cell-lg"><div class="tn">TN13</div></td>
          <td class="cell-xs"><div class="mp">MP13</div></td>

          <td class="cell-xs hr" />
          <td class="cell-xs hl" />

          <td class="cell-xs"><div class="tc">TC15</div></td>
          <td class="cell-lg"><div class="tn">TN15</div></td>
          <td class="cell-xs"><div class="mp">MP15</div></td>

          <td class="cell-xs hr" />
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs"><div class="tc">TC8</div></td>
          <td class="cell-lg"><div class="tn">TN8</div></td>
          <td class="cell-xs"><div class="mp">MP8</div></td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs"><div class="tc">TC10</div></td>
          <td class="cell-lg"><div class="tn">TN10</div></td>
          <td class="cell-xs"><div class="mp">MP10</div></td>

          <td class="cell-xs" />
          <td class="cell-xs v" />
        </tr>
        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs"><div class="tc">TC8</div></td>
          <td class="cell-lg"><div class="tn">TN8</div></td>
          <td class="cell-xs"><div class="mp">MP8</div></td>

          <td class="cell-xs hr" />
          <td class="cell-xs hl" />

          <td class="cell-xs"><div class="tc">TC10</div></td>
          <td class="cell-lg"><div class="tn">TN10</div></td>
          <td class="cell-xs"><div class="mp">MP10</div></td>

          <td class="cell-xs hr" />
        </tr>

        <tr>
          <td class="cell-xs" />
        </tr>
        <tr>
          <td class="cell-xs" />
        </tr>
        <tr>
          <td class="cell-xs" />
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td colspan="3"><div class="Match">Match 11</div></td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td colspan="3"><div class="Match">Match 14</div></td>
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs"><div class="tc">TC11</div></td>
          <td class="cell-lg"><div class="tn">TN11</div></td>
          <td class="cell-xs"><div class="mp">MP11</div></td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs"><div class="tc">TC14</div></td>
          <td class="cell-lg"><div class="tn">TN14</div></td>
          <td class="cell-xs"><div class="mp">MP14</div></td>
        </tr>

        <tr>
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs"><div class="tc">TC11</div></td>
          <td class="cell-lg"><div class="tn">TN11</div></td>
          <td class="cell-xs"><div class="mp">MP11</div></td>

          <td class="cell-xs" />
          <td class="cell-xs" />

          <td class="cell-xs"><div class="tc">TC14</div></td>
          <td class="cell-lg"><div class="tn">TN14</div></td>
          <td class="cell-xs"><div class="mp">MP14</div></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
