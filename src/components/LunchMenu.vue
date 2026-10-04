<script setup>
import { computed } from 'vue'
import { useContent } from '../i18n'
import { useMenu } from '../lib/live-menu'
import MenuItem from './MenuItem.vue'
import SubscribeForm from './SubscribeForm.vue'

defineProps({ showSubscribe: { type: Boolean, default: true } })

const { c, locale } = useContent()
const menu = computed(() => useMenu(locale.value))
const daily = computed(() => menu.value.data.value?.daily)
</script>

<template>
  <div class="lunch">
    <div class="list">
      <p class="day display">
        <span v-if="daily?.day">{{ daily.day }}</span>
        <span v-else class="skeleton" />
      </p>
      <template v-if="daily?.categories?.length">
        <section v-for="cat in daily.categories" :key="cat.title" class="cat">
          <h3 v-if="cat.title" class="cat-title">{{ cat.title }}</h3>
          <MenuItem v-for="item in cat.items" :key="item.name" :item="item" compact />
        </section>
      </template>
      <p v-else-if="daily" class="muted">{{ c.home.lunch.empty }}</p>
      <div v-else class="loading" aria-hidden="true">
        <span v-for="n in 4" :key="n" class="skeleton line" />
      </div>
      <p class="note">{{ c.home.lunch.weekend }}</p>
    </div>
    <aside v-if="showSubscribe && daily?.subscribe && daily.live" class="aside">
      <SubscribeForm :subscribe="daily.subscribe" />
    </aside>
  </div>
</template>

<style scoped>
.lunch {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: clamp(32px, 5vw, 72px);
  align-items: start;
}

.day {
  font-size: clamp(1.4rem, 2.6vw, 2rem);
  color: var(--accent);
  margin-bottom: 8px;
}

.cat + .cat {
  margin-top: 20px;
}

.cat-title {
  margin-top: 16px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--brass);
}

.note {
  margin-top: 20px;
  font-size: 0.88rem;
  color: var(--muted);
  max-width: 60ch;
}

.aside {
  position: sticky;
  top: calc(var(--header-h) + 24px);
  padding: clamp(24px, 3vw, 36px);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.skeleton {
  display: inline-block;
  width: 10ch;
  height: 0.9em;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--paper-2), var(--line), var(--paper-2));
  background-size: 200% 100%;
  animation: shimmer 1.4s linear infinite;
}

.loading {
  display: grid;
  gap: 18px;
  margin-top: 16px;
}

.line {
  width: 100%;
  height: 46px;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

@media (max-width: 860px) {
  .lunch {
    grid-template-columns: 1fr;
  }

  .aside {
    position: static;
  }
}
</style>
