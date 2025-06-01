<template>
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="width"
      :height="height"
      viewBox="0 0 24 24"
    >
      <rect width="24" height="24" fill="none" />
      <path
        fill="none"
        stroke="#fff"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M20.5 3.5L3.5 9l6.5 3l7-5l-5 7l3 6.5z"
        stroke-width="1"
      />
    </svg>
  </div>
</template>

<script setup>
defineProps({
  width: {
    type: String,
    default: "20",
  },
  height: {
    type: String,
    default: "20",
  },
});
</script>
