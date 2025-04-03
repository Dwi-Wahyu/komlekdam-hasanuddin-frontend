<template>
  <div class="min-h-screen w-full p-5 pt-20 md:p-20">
    <WidgetsJudulSection :text="`Dokumentasi ${data?.nama}`" />

    <div v-if="pending">
      <h1>Loading . . .</h1>
    </div>
    <div v-else-if="error">
      {{ error }}
    </div>

    <div
      v-if="data?.dokumentasi.length"
      class="grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      <div
        class="relative group cursor-pointer"
        v-for="(dokumentasi, dokumentasiIdx) in data?.dokumentasi"
        :key="dokumentasiIdx"
      >
        <div
          class="bg-gradient-to-t group-hover:opacity-0 transition-all duration-300 ease-in-out w-full bottom-0 h-36 px-5 py-4 flex flex-col justify-end from-black via-black to-transparent absolute"
        >
          <h1 class="font-semibold">
            {{ dokumentasi.judul_keterangan }}
          </h1>
          <h1 class="text-sm">
            {{ truncateHtml(dokumentasi.narasi_keterangan, 50) }}
          </h1>
        </div>
        <img
          :src="`${baseURL}/profil/mitra/dokumentasi/${dokumentasi.dokumentasiPath}`"
          alt=""
        />
      </div>
    </div>
    <div v-else class="flex flex-col items-center gap-3 justify-center">
      <h1>Belum Ada Dokumentasi Mitra</h1>
      <IconsEmpty />
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
