<template>
  <div class="bg-[#1C2940] text-white">
    <UiLandingHeader />

    <slot />

    <UiLandingFooter />
  </div>
</template>

<script lang="ts" setup>
const axios = useAxios();
const timer = ref<NodeJS.Timeout>();

const catatPengunjung = async () => {
  try {
    await axios.post("/api/statistik/catat-pengunjung");
  } catch (error) {
    console.error("Gagal mencatat pengunjung:", error);
  }
};

onMounted(() => {
  catatPengunjung();

  timer.value = setInterval(catatPengunjung, 600000);
});

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>
