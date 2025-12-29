<template>
  <div class="min-h-screen w-full p-5 pt-20 md:p-20">
    <div v-if="pending" class="animate-pulse w-full">
      <div class="flex justify-center mb-10">
        <div class="h-10 w-1/2 md:w-1/3 bg-gray-700 rounded"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          v-for="i in 4"
          :key="i"
          class="relative w-full aspect-video bg-gray-700 rounded-lg overflow-hidden"
        >
          <div
            class="absolute bottom-0 w-full p-5 flex flex-col gap-2 bg-gradient-to-t from-gray-900 via-gray-800/50 to-transparent"
          >
            <div class="h-6 w-3/4 bg-gray-600 rounded"></div>
            <div class="h-4 w-1/2 bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="error">
      {{ error }}
    </div>

    <div v-else-if="data">
      <WidgetsJudulSection :text="`Dokumentasi ${data.nama}`" />

      <div
        v-if="data.dokumentasi.length"
        class="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <div
          class="relative group cursor-pointer overflow-hidden rounded-lg"
          v-for="(dokumentasi, dokumentasiIdx) in data.dokumentasi"
          :key="dokumentasiIdx"
        >
          <div
            class="bg-gradient-to-t z-10 group-hover:opacity-0 transition-all duration-300 ease-in-out w-full bottom-0 h-36 px-5 py-4 flex flex-col justify-end from-black via-black/80 to-transparent absolute"
          >
            <h1 class="font-semibold text-white">
              {{ dokumentasi.judul_keterangan }}
            </h1>
            <h1 class="text-sm text-gray-200">
              {{ truncateHtml(dokumentasi.narasi_keterangan, 50) }}
            </h1>
          </div>
          <img
            :src="`${baseURL}/profil/mitra/dokumentasi/${dokumentasi.dokumentasiPath}`"
            alt=""
            class="w-full h-full object-cover aspect-video hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      <div v-else class="flex flex-col items-center gap-3 justify-center mt-10">
        <h1 class="font-semibold text-lg">Belum Ada Dokumentasi Mitra</h1>
        <IconsEmpty />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { truncateHtml } from "~/function/truncateHtml";
import { type TEachMitraType } from "~/store/mitra";

definePageMeta({
  layout: "landing",
});

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

const route = useRoute();
const { id } = route.params;

const { data, pending, error } = await useMyFetch<TEachMitraType>(
  `/api/mitra/${id}`,
  {
    lazy: true,
  }
);
</script>
