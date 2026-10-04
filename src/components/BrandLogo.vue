<script setup>
import logo from '../assets/logo.svg?raw'
</script>

<template>
  <span class="brand-logo" v-html="logo" />
</template>

<style scoped>
.brand-logo {
  display: inline-block;
  line-height: 0;
}

.brand-logo :deep(svg) {
  width: 100%;
  height: auto;
}
</style>
