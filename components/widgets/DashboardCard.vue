<template>
  <div
    class="flex justify-between bg-[#30394a] rounded-2xl px-4 py-3 shadow-[7px_7px_0px_0px_rgba(0,0,0,0.2)]"
  >
    <div>
      <h1 class="font-semibold">{{ title }}</h1>
      <h1 class="text-yellow mb-2 text-lg font-semibold">{{ value }}</h1>
      <div v-if="change !== null">
        <h1 class="text-xs">{{ change }}</h1>
      </div>
    </div>
    <div>
      <component :is="icon" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: Number,
  change: {
    type: String,
    default: null,
  },
  icon: {
    type: Object,
    default: null,
  },
});
</script>
