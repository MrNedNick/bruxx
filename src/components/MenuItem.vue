<script setup>
import { computed } from 'vue'
import { useContent } from '../i18n'

const props = defineProps({
  item: { type: Object, required: true },
  compact: { type: Boolean, default: false },
})

const { c, intl } = useContent()
const nf = computed(() => new Intl.NumberFormat(intl.value))
const price = (p) => `${nf.value.format(p)} ${c.value.menu.currency}`
const hasPrice = computed(() => props.item.variants.length > 0)
</script>

<template>
  <article class="item" :class="{ compact, 'no-price': !hasPrice }">
    <div class="head">
      <h4 class="name">
        <span class="serif">{{ item.name }}</span>
        <span v-if="item.isNew" class="badge">{{ c.menu.new }}</span>
      </h4>
      <span class="leader" aria-hidden="true" />
      <span v-if="hasPrice" class="prices">
        <span v-for="(v, i) in item.variants" :key="i" class="variant">
          <span v-if="v.size" class="size">{{ v.size }}</span>
          <span class="price">{{ price(v.price) }}</span>
        </span>
      </span>
    </div>
    <p v-if="item.sub" class="sub">{{ item.sub }}</p>
    <p v-if="item.desc" class="desc">{{ item.desc }}</p>
    <p v-if="item.abv || item.allergens.length" class="meta">
      <span v-if="item.abv" class="abv">{{ nf.format(item.abv) }} %</span>
      <span v-if="item.allergens.length" class="allergens">
        <span class="sr-only">{{ c.menu.allergens }}:</span>
        <abbr v-for="a in item.allergens" :key="a" :title="c.allergens[a]" class="allergen">
          {{ a }}<span class="sr-only"> ({{ c.allergens[a] }})</span>
        </abbr>
      </span>
    </p>
  </article>
</template>

<style scoped>
.item {
  padding-block: 18px;
  border-bottom: 1px solid var(--line);
}

.head {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.name {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 1.32rem;
  line-height: 1.2;
  font-weight: 400;
}

.name .serif {
  letter-spacing: -0.005em;
}

.compact .name {
  font-size: 1.15rem;
}

.leader {
  flex: 1;
  min-width: 16px;
  border-bottom: 1px dotted var(--line-strong);
  transform: translateY(-5px);
}

.no-price .leader {
  display: none;
}

.prices {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 4px 16px;
  text-align: right;
}

.variant {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  white-space: nowrap;
}

.size {
  font-size: 0.82rem;
  color: var(--muted);
}

.price {
  font-size: 1.02rem;
  color: var(--accent);
}

.sub {
  margin-top: 2px;
  font-weight: 600;
  font-size: 0.92rem;
  color: var(--ink-2);
}

.desc {
  margin-top: 6px;
  font-size: 0.94rem;
  line-height: 1.55;
  color: var(--muted);
  max-width: 64ch;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.abv {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 2px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--brass) 18%, transparent);
  color: var(--ink);
}

.allergens {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
}

.allergen {
  display: inline-grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  padding: 0 4px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  text-decoration: none;
  color: var(--muted);
  cursor: help;
}

@media (max-width: 520px) {
  .head {
    flex-wrap: wrap;
  }

  .leader {
    display: none;
  }

  .prices {
    width: 100%;
    justify-content: flex-start;
    text-align: left;
  }

  .name {
    font-size: 1.2rem;
  }
}
</style>
