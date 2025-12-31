<template>
  <div class="bg-[#1C2940] text-white">
    <UiLandingHeader />

    <slot />

    <UiLandingFooter />
  </div>
</template>

<script lang="ts" setup>
const axios = useAxios();

const catatPengunjung = async () => {
  try {
    await axios.post("/api/statistik/catat-pengunjung");
  } catch (error) {
    console.error("Gagal mencatat pengunjung:", error);
  }
};

onMounted(() => {
  const today = new Date().toISOString().slice(0, 10);
  const key = `visitor-${today}`;

  if (localStorage.getItem(key)) return;

  catatPengunjung();

  localStorage.setItem(key, "1");
});
</script>
