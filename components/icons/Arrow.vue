<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 24 24"
  >
    <rect width="24" height="24" fill="none" />
    <path
      fill="#fff"
      d="M11.47 5.47a.753.753 0 0 1 1.06 0l5 5a.75.75 0 1 1-1.06 1.06l-3.72-3.72V18a.75.75 0 0 1-1.5 0V7.81l-3.72 3.72a.75.75 0 0 1-1.06-1.06z"
    />
  </svg>
</template>

<script setup>
defineProps({
  width: {
    type: String,
    default: "25",
  },
  height: {
    type: String,
    default: "24",
  },
});
</script>
