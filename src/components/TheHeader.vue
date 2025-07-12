<script setup>
import { Icon } from '@iconify/vue';
</script>

<template>
  <header class="header">
    <h1>クラロワ マージタクティクス チームビルダー</h1>
    <a href="https://github.com/wai-doi/merge-tactics-vue" target="_blank" rel="noopener noreferrer" class="github-link">
      <Icon icon="fa:github" />
    </a>
  </header>
</template>

<style scoped>
.header {
  background-color: #fff;
  color: #333;
  padding: 10px 20px;
  text-align: center;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
h1 {
  font-size: 1.8em;
  margin: 0;
}
.github-link {
  position: absolute;
  right: 20px;
  font-size: 2em;
  color: #333;
}
</style>
