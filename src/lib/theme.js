import { ref } from 'vue'

// The inline script in index.html sets data-theme before the first paint;
// this keeps it in sync and remembers the visitor's choice.
const KEY = 'bruxx-theme'

export const theme = ref(
  typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
)

export function setTheme(value) {
  theme.value = value
  document.documentElement.dataset.theme = value
  try {
    localStorage.setItem(KEY, value)
  } catch {
    // Private mode or blocked storage: the theme still applies for this visit.
  }
}

export const toggleTheme = () => setTheme(theme.value === 'dark' ? 'light' : 'dark')
