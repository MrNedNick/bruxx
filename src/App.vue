<script setup>
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContent } from './i18n'
import { openReservation, reservationOpen, RESERVATION_HASHES } from './lib/reservation'
import ReservationDialog from './components/ReservationDialog.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'

const { c } = useContent()
const route = useRoute()
const router = useRouter()

// Old links such as bruxx.cz/#rezervace open the booking dialog straight away.
watch(
  () => route.hash,
  (hash) => {
    if (RESERVATION_HASHES.includes(hash)) openReservation()
  },
  { immediate: true },
)

watch(reservationOpen, (open) => {
  if (!open && RESERVATION_HASHES.includes(route.hash)) router.replace({ ...route, hash: '' })
})
</script>

<template>
  <a class="skip-link" href="#main">{{ c.nav.skip }}</a>
  <ScrollProgress />
  <SiteHeader />
  <main id="main" tabindex="-1">
    <RouterView v-slot="{ Component, route: r }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="String(r.name)" />
      </Transition>
    </RouterView>
  </main>
  <SiteFooter />
  <ReservationDialog />
</template>
