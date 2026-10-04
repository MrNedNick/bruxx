<script setup>
import { computed } from 'vue'
import { useContent } from '../i18n'
import { privacy } from '../content/privacy'
import PageHero from '../components/PageHero.vue'

const { c, locale } = useContent()
// The operator publishes the policy in Czech and English.
const html = computed(() => (locale.value === 'cs' ? privacy.cs : privacy.en))
</script>

<template>
  <div class="privacy-page">
    <PageHero :eyebrow="c.privacy.eyebrow" :title="c.privacy.title" :lead="c.privacy.note" />
    <section class="section section--tight">
      <div class="container">
        <!-- Static text from the operator's own policy, bundled at build time. -->
        <div class="policy" v-html="html" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.policy {
  max-width: 78ch;
  color: var(--ink-2);
}

.policy :deep(h2) {
  margin: 48px 0 16px;
  font-family: var(--font-display);
  font-stretch: 112%;
  font-weight: 800;
  font-size: 1.25rem;
  color: var(--ink);
}

.policy :deep(h2:first-child) {
  margin-top: 0;
}

.policy :deep(ol),
.policy :deep(ul) {
  display: grid;
  gap: 10px;
  padding-left: 1.4em;
}

.policy :deep(ul) {
  margin-top: 10px;
}

.policy :deep(p) {
  margin-top: 24px;
}
</style>
