<template>
  <div class="animated-icon">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="150"
      height="150"
      viewBox="0 0 24 24"
    >
      <rect width="24" height="24" fill="none" />
      <g
        fill="none"
        stroke="#ef4444"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="10" class="draw" />
        <path d="m15 9l-6 6m0-6l6 6" class="draw" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.draw {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: draw 2s ease forwards;
}
.draw:nth-child(2) {
  animation-delay: 0.1s;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
