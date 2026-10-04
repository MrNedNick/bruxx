<script setup>
import { useContent } from '../i18n'
import BaseIcon from '../components/BaseIcon.vue'

const { c, pathFor } = useContent()
</script>

<template>
  <section class="nf container">
    <p class="code display" aria-hidden="true">404</p>
    <h1 class="display h2">{{ c.notFound.title }}</h1>
    <p class="lead">{{ c.notFound.text }}</p>
    <div class="actions">
      <RouterLink class="btn" :to="pathFor('home')">{{ c.notFound.home }} <BaseIcon name="arrow" /></RouterLink>
      <RouterLink class="btn btn--ghost" :to="pathFor('menu')">{{ c.nav.menu }}</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.nf {
  display: grid;
  gap: 20px;
  justify-items: start;
  min-height: 80vh;
  align-content: center;
  padding-top: calc(var(--header-h) + 48px);
  padding-bottom: 96px;
}

.code {
  font-size: clamp(6rem, 22vw, 16rem);
  line-height: 0.8;
  color: transparent;
  -webkit-text-stroke: 2px var(--accent);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
