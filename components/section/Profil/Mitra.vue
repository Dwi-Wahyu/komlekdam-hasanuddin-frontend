<template>
  <div class="px-5 sm:p-10 pb-14 sm:px-20">
    <WidgetsJudulSection text="MITRA" />

    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div
        v-for="mitra in data"
        @click="navigateTo(`/dokumentasi-mitra/${mitra.id}`)"
        class="shadow-yellow cursor-pointer p-4 flex justify-center items-center shadow hover:shadow-lg hover:shadow-yellow transition-all duration-300"
      >
        <NuxtImg
          :src="`${baseURL}/profil/mitra/logo/${mitra.logoPath}`"
          class="h-40 w-40 object-contain"
          alt="Logo Mitra"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

type TMitra = {
  id: number;
  logoPath: string;
};

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;
const { data } = useMyFetch<TMitra[]>("/api/mitra");
</script>
