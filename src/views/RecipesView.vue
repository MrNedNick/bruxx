<script setup>
import { reactive } from 'vue'
import { fmt, useContent } from '../i18n'
import { formatQty, scaleQty } from '../lib/recipes'
import BaseIcon from '../components/BaseIcon.vue'
import BasePhoto from '../components/BasePhoto.vue'
import PageHero from '../components/PageHero.vue'

const { c, intl } = useContent()

// Per-recipe state: chosen servings and ticked ingredients/steps.
const servings = reactive({})
const done = reactive({})
const serves = (r) => servings[r.id] ?? r.serves
const setServes = (r, n) => (servings[r.id] = Math.min(12, Math.max(1, n)))
const toggle = (key) => (done[key] = !done[key])

function qty(r, it) {
  if (it.qty == null) return ''
  const n = scaleQty(it.qty, serves(r) / r.serves, it.unit)
  return `${formatQty(n, intl.value)}${it.unit ? ` ${it.unit}` : ''}`
}

const print = () => window.print()
</script>

<template>
  <div class="recipes-page">
    <PageHero photo="duo-chef" :eyebrow="c.recipes.eyebrow" :title="c.recipes.title" :lead="c.recipes.lead" />

    <nav class="jump container" :aria-label="c.recipes.title">
      <a v-for="r in c.recipes.list" :key="r.id" :href="`#${r.id}`" class="chip">{{ r.title }}</a>
    </nav>

    <article v-for="(r, i) in c.recipes.list" :id="r.id" :key="r.id" class="section recipe" :class="{ alt: i % 2 }">
      <div class="container">
        <div v-reveal class="photo reveal-mask recipe-photo">
          <BasePhoto :name="r.photo" :alt="r.title" sizes="100vw" :parallax="0.06" />
        </div>
        <header class="recipe-head">
          <p v-reveal class="eyebrow">{{ String(i + 1).padStart(2, '0') }} / {{ String(c.recipes.list.length).padStart(2, '0') }}</p>
          <h2 v-reveal="60" class="display h2">{{ r.title }}</h2>
          <div v-reveal="120" class="facts">
            <div class="fact">
              <span class="fact-label">{{ c.recipes.servings }}</span>
              <span class="stepper">
                <button type="button" :aria-label="c.recipes.less" :disabled="serves(r) <= 1" @click="setServes(r, serves(r) - 1)">
                  <BaseIcon name="minus" />
                </button>
                <output aria-live="polite">{{ serves(r) }}</output>
                <button type="button" :aria-label="c.recipes.more" :disabled="serves(r) >= 12" @click="setServes(r, serves(r) + 1)">
                  <BaseIcon name="plus" />
                </button>
              </span>
            </div>
            <div class="fact">
              <span class="fact-label">{{ c.recipes.time }}</span>
              <span class="fact-value"><BaseIcon name="clock" /> {{ fmt(c.recipes.minutes, { n: r.minutes }) }}</span>
            </div>
            <button type="button" class="btn btn--ghost btn--sm print" @click="print"><BaseIcon name="print" /> {{ c.recipes.print }}</button>
          </div>
        </header>

        <div class="recipe-body">
          <section v-reveal class="ingredients">
            <h3 class="sub-title">{{ c.recipes.ingredients }}</h3>
            <div v-for="g in r.groups" :key="g.title" class="group">
              <p v-if="g.title" class="group-title">{{ g.title }}</p>
              <ul role="list">
                <li v-for="it in g.items" :key="it.name">
                  <label class="check" :class="{ done: done[`${r.id}:${it.name}`] }">
                    <input type="checkbox" :checked="done[`${r.id}:${it.name}`]" @change="toggle(`${r.id}:${it.name}`)" />
                    <span class="box" aria-hidden="true"><BaseIcon name="check" /></span>
                    <span class="qty">{{ qty(r, it) }}</span>
                    <span>{{ it.name }}</span>
                  </label>
                </li>
              </ul>
            </div>
          </section>
          <section v-reveal="100" class="steps">
            <h3 class="sub-title">{{ c.recipes.steps }}</h3>
            <ol role="list">
              <li v-for="(s, n) in r.steps" :key="n">
                <button type="button" class="step" :class="{ done: done[`${r.id}#${n}`] }" :aria-pressed="!!done[`${r.id}#${n}`]" @click="toggle(`${r.id}#${n}`)">
                  <span class="step-num display">{{ n + 1 }}</span>
                  <span class="step-text">{{ s }}</span>
                </button>
              </li>
            </ol>
          </section>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.jump {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 32px;
}

.recipe.alt {
  background: var(--paper-2);
}

.recipe {
  scroll-margin-top: var(--header-h);
}

.recipe-photo {
  aspect-ratio: 21 / 9;
  max-height: 560px;
  width: 100%;
}

.recipe-head {
  display: grid;
  gap: 16px;
  margin: clamp(32px, 4vw, 56px) 0 clamp(32px, 4vw, 48px);
}

.facts {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px 40px;
}

.fact {
  display: grid;
  gap: 6px;
}

.fact-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--brass);
}

.fact-value {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  font-weight: 600;
}

.fact-value svg {
  width: 18px;
}

.stepper {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 44px;
  padding: 0 4px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
}

.stepper button {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: transparent;
}

.stepper button:hover:not(:disabled) {
  background: var(--paper-2);
}

.stepper button:disabled {
  opacity: 0.3;
}

.stepper svg {
  width: 16px;
}

.stepper output {
  min-width: 2ch;
  text-align: center;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.print {
  margin-left: auto;
}

.print svg {
  width: 16px;
}

.recipe-body {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: clamp(32px, 6vw, 96px);
}

.sub-title {
  font-family: var(--font-display);
  font-stretch: 125%;
  font-weight: 800;
  text-transform: lowercase;
  font-size: 1.3rem;
  margin-bottom: 16px;
}

.group + .group {
  margin-top: 20px;
}

.group-title {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.1rem;
  margin-bottom: 6px;
}

.check {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
  transition: opacity 0.3s;
}

.check input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}

.box {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  flex: none;
  border: 1.5px solid var(--line-strong);
  border-radius: 6px;
  color: transparent;
  transition: all 0.25s var(--ease);
}

.box svg {
  width: 14px;
  stroke-width: 2.4;
}

.check input:focus-visible + .box {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.check.done {
  opacity: 0.5;
}

.check.done .box {
  background: var(--navy);
  border-color: var(--navy);
  color: #fff;
}

.check.done span:last-child {
  text-decoration: line-through;
}

.qty {
  min-width: 70px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--accent);
}

.steps ol {
  display: grid;
  gap: 8px;
  margin: 0;
}

.step {
  display: flex;
  gap: 18px;
  width: 100%;
  padding: 16px 18px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface);
  text-align: left;
  font-size: 1.02rem;
  line-height: 1.55;
  transition: opacity 0.3s, border-color 0.3s;
}

.step:hover {
  border-color: var(--line-strong);
}

.step-num {
  flex: none;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--navy);
  color: #f4eee3;
  font-size: 0.9rem;
}

.step.done {
  opacity: 0.45;
}

.step.done .step-num {
  background: var(--brass);
}

@media (max-width: 860px) {
  .recipe-body {
    grid-template-columns: 1fr;
  }

  .recipe-photo {
    aspect-ratio: 4 / 3;
  }

  .print {
    margin-left: 0;
  }
}

@media print {
  .recipe {
    break-inside: avoid;
  }
}
</style>
