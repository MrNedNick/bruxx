import { createApp } from 'vue'
import '@fontsource-variable/archivo/standard.css'
import '@fontsource-variable/hanken-grotesk'
import '@fontsource-variable/fraunces/standard-italic.css'
import './style.css'
import App from './App.vue'
import router from './router'
import { parallax, reveal } from './lib/reveal'

createApp(App).use(router).directive('reveal', reveal).directive('parallax', parallax).mount('#app')
