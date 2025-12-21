<template>
  <div class="night-sky" aria-hidden="true">
    <div class="stars layer-1"></div>
    <div class="stars layer-2"></div>
    <div class="stars layer-3"></div>
    <div class="snow layer-1"></div>
    <div class="snow layer-2"></div>
    <div class="snow layer-3"></div>
  </div>
</template>

<script setup lang="ts">
// Pure CSS decorative background; no script required
</script>

<style scoped>
/* Full-viewport gradient base */
.night-sky {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  z-index: -1;
  background: linear-gradient(to bottom, #05070a 0%, #0b1426 50%, #1a2c38 100%);
  overflow: hidden;
}

/* Star layers */
.stars {
  position: absolute;
  inset: 0;
  background-repeat: repeat;
  will-change: opacity;
}

/* Small, dense stars */
.layer-1 {
  background-image: radial-gradient(rgba(255, 255, 255, 0.85) 0.7px, rgba(255, 255, 255, 0) 0.7px);
  background-size: 3px 3px;
  background-position: 0 0;
  animation: twinkle 7s ease-in-out infinite;
  opacity: 0.7;
}

/* Medium, lighter density */
.layer-2 {
  background-image: radial-gradient(rgba(255, 255, 255, 0.75) 1px, rgba(255, 255, 255, 0) 1px);
  background-size: 5px 5px;
  background-position: 1px 2px;
  animation: twinkle 9s ease-in-out infinite;
  animation-delay: 1.5s;
  opacity: 0.6;
}

/* Largest, sparsest stars */
.layer-3 {
  background-image: radial-gradient(rgba(255, 255, 255, 0.65) 1.2px, rgba(255, 255, 255, 0) 1.2px);
  background-size: 8px 8px;
  background-position: 2px 1px;
  animation: twinkle 11s ease-in-out infinite;
  animation-delay: 0.8s;
  opacity: 0.5;
}

/* Twinkling via opacity */
@keyframes twinkle {
  0% { opacity: 0.2; }
  50% { opacity: 1; }
  100% { opacity: 0.2; }
}

/* Snow animation */
.snow {
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(rgba(255, 255, 255, 0.7) 1px, transparent 1px);
  background-repeat: repeat;
  animation: fall linear infinite;
}

.snow.layer-1 {
  background-size: 200px 200px;
  animation-duration: 15s;
  animation-delay: -2s;
}

.snow.layer-2 {
  background-size: 300px 300px;
  animation-duration: 20s;
  animation-delay: -5s;
  opacity: 0.6;
}

.snow.layer-3 {
  background-size: 400px 400px;
  animation-duration: 25s;
  animation-delay: -10s;
  opacity: 0.4;
}

@keyframes fall {
  to {
    transform: translateY(200vh);
  }
}

/* Responsiveness: reduce density on small screens */
@media (max-width: 768px) {
  .layer-1 {
    background-size: 4px 4px; /* fewer dots */
    opacity: 0.55;
  }
  .layer-2 {
    background-size: 7px 7px;
    opacity: 0.5;
  }
  .layer-3 {
    background-size: 10px 10px;
    opacity: 0.45;
  }
}

/* Accessibility: respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .layer-1,
  .layer-2,
  .layer-3 {
    animation: none;
  }
}
</style>
