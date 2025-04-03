<template>
  <div
    class="w-full bg-center bg-cover bg-[url('/backgrounds/program-bg1.jpeg')]"
  >
    <div
      class="bg-black/50 p-5 sm:p-20 flex pt-24 pb-10 flex-col gap-7 items-center justify-center w-full h-full"
    >
      <WidgetsJudulSection text="Kegiatan Program" :with-out-line="true" />
      <div v-if="pending">
        <h1>Loading . . .</h1>
      </div>
      <div v-else-if="error">
        <h1>{{ error }}</h1>
      </div>
      <div
        v-else-if="data"
        class="grid grid-cols-1 gap-10 md:px-64 items-center justify-center md:grid-cols-2"
      >
        <div
          class="cursor-pointer relative w-full sm:aspect-[359/461] border-2 border-yellow overflow-hidden"
          v-for="program in data"
          :key="program.id"
          @click="navigateTo(`/kegiatan/${program.id}`)"
        >
          <NuxtImg
            :src="`${baseURL}/kegiatan/program/thumbnail/${program.thumbnailPath}`"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute bottom-0 bg-gradient-to-t from-black via-black flex justify-end flex-col px-4 py-3 to-transparent w-full pt-20"
          >
            <h1 class="font-semibold">{{ program.judul }}</h1>
            <h1>{{ truncateHtml(program.deskripsi, 20) }}</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { truncateHtml } from "~/function/truncateHtml";

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

type Program = {
  id: string;
  judul: string;
  deskripsi: string;
  thumbnailPath: string;
};

const { data, pending, error } = await useMyFetch<Program[]>("/api/kegiatan", {
  lazy: true,
  query: {
    kategori: "program",
  },
});
</script>
