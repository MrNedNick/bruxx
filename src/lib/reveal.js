// v-reveal: adds `.is-in` once the element scrolls into view.
// `v-reveal` alone fades it up; `v-reveal="120"` delays it by 120 ms, which is
// how sibling cards stagger. The class is added once and never removed.

let observer

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in')
          observer.unobserve(e.target)
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )
  return observer
}

export const reveal = {
  mounted(el, binding) {
    if (!el.classList.contains('reveal-mask') && !el.classList.contains('rise-group')) {
      el.classList.add('reveal')
    }
    if (binding.value) el.style.setProperty('--d', `${binding.value}ms`)
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-in')
      return
    }
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}

// v-parallax="0.12": moves the element against the scroll by that fraction.
const items = new Set()
let ticking = false

function update() {
  ticking = false
  const vh = window.innerHeight
  for (const { el, speed } of items) {
    const r = el.parentElement.getBoundingClientRect()
    if (r.bottom < -100 || r.top > vh + 100) continue
    const offset = (r.top + r.height / 2 - vh / 2) * -speed
    el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(${1 + Math.abs(speed) * 1.6})`
  }
}

function onScroll() {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(update)
  }
}

const reduced = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

export const parallax = {
  mounted(el, binding) {
    const speed = Number(binding.value)
    if (!speed || reduced()) return
    items.add({ el, speed })
    if (items.size === 1) {
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll, { passive: true })
    }
    requestAnimationFrame(update)
  },
  unmounted(el) {
    for (const it of items) if (it.el === el) items.delete(it)
    if (!items.size) {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  },
}
