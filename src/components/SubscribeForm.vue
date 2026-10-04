<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useContent } from '../i18n'

// Posts to the same Menubot endpoint as the restaurant's current form, with
// the one-time fields Menubot put into its own form. The response lands in a
// hidden frame; Menubot redirects to /subscribed.html?mail=added (or ?email=
// for a bad address), which we can read because it is our own page.
const props = defineProps({ subscribe: { type: Object, required: true } })
const { c, pathFor } = useContent()
let timeout
onUnmounted(() => clearTimeout(timeout))

const email = ref('')
const consent = ref(false)
const touched = ref('')
const status = ref('')
const busy = ref(false)
const frame = ref(null)
const landing = `${import.meta.env.BASE_URL}subscribed.html`

function onSubmit() {
  busy.value = true
  status.value = ''
  clearTimeout(timeout)
  timeout = setTimeout(() => { busy.value = false; status.value = 'unknown' }, 15000)
}

function onFrameLoad() {
  if (!busy.value) return
  busy.value = false
  clearTimeout(timeout)
  let search = ''
  try {
    search = frame.value.contentWindow.location.search
  } catch {
    // Cross-origin responses cannot confirm whether the subscription succeeded.
  }
  if (/mail=added/.test(search)) status.value = 'added'
  else if (/email=/.test(search)) status.value = 'invalid'
  else status.value = 'unknown'
  if (status.value === 'added') email.value = ''
}

// The old site linked back here with these flags after a redirect.
onMounted(() => {
  const q = new URLSearchParams(location.search)
  if (q.has('e')) status.value = 'removed'
  else if (q.get('mail') === 'added') status.value = 'added'
})
</script>

<template>
  <form
    class="subscribe"
    method="post"
    :action="props.subscribe.action"
    target="subscribe-frame"
    @submit="onSubmit"
  >
    <h3 class="title">{{ c.subscribe.title }}</h3>
    <p class="text">{{ c.subscribe.text }}</p>
    <input
      v-for="(value, name) in props.subscribe.fields"
      :key="name"
      type="hidden"
      :name="name"
      :value="name === 'mburl' ? landing : name === 'mbevent' ? touched : value"
    />
    <!-- Menubot's bot trap: a field people never see and never fill in. -->
    <input class="trap" type="text" name="email" tabindex="-1" autocomplete="off" aria-hidden="true" />
    <div class="row">
      <label class="sr-only" for="subscribe-email">{{ c.subscribe.label }}</label>
      <input
        id="subscribe-email"
        v-model="email"
        type="email"
        name="mbtext"
        maxlength="50"
        required
        autocomplete="email"
        :placeholder="c.subscribe.placeholder"
        @focus="touched = 'ok'"
        @keyup="touched = 'ok'"
      />
      <button class="btn" type="submit" :disabled="busy">{{ c.subscribe.submit }}</button>
    </div>
    <label class="consent">
      <input v-model="consent" type="checkbox" name="mbgdpr" required />
      <span>{{ c.subscribe.consent }}</span>
    </label>
    <RouterLink class="privacy-link" :to="pathFor('privacy')">{{ c.footer.privacy }}</RouterLink>
    <p class="status" role="status" aria-live="polite">
      <template v-if="status">{{ status === 'unknown' ? c.visitTools.unknown : c.subscribe[status] }}</template>
    </p>
    <iframe ref="frame" name="subscribe-frame" class="sr-only" tabindex="-1" title="subscribe" @load="onFrameLoad" />
  </form>
</template>

<style scoped>
.subscribe {
  display: grid;
  gap: 12px;
}

.title {
  font-family: var(--font-display);
  font-stretch: 125%;
  font-weight: 800;
  font-size: 1.05rem;
  text-transform: lowercase;
}

.text {
  font-size: 0.94rem;
  color: var(--muted);
}

.row {
  display: flex;
  gap: 8px;
}

.row input {
  flex: 1;
  min-width: 0;
  height: 52px;
  padding: 0 18px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: var(--surface);
  transition: border-color 0.2s;
}

.row input:focus {
  outline: none;
  border-color: var(--accent);
}

.consent {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 0.85rem;
  color: var(--muted);
}

.consent input {
  width: 18px;
  height: 18px;
  accent-color: var(--navy);
}

.privacy-link { font-size: 0.85rem; }

.status {
  min-height: 1.4em;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--accent);
}

.trap {
  position: absolute;
  left: -9999px;
  opacity: 0;
}

@media (max-width: 420px) {
  .row {
    flex-direction: column;
  }
}
</style>
