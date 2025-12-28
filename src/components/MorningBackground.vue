<template>
  <div class="morning-sky" aria-hidden="true"></div>
</template>

<script setup lang="ts">
  // Pure CSS decorative background; no script required
</script>

<style scoped>
  .morning-sky {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100vh;
    background-image: url('/img/morning-background.jpg');
    background-size: cover;
    background-position: center;
    z-index: -1;
  }
</style>
