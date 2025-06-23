<template>
  <div class="w-full">
    <div
      class="bg-black/50 p-5 sm:p-20 flex pt-24 pb-10 flex-col gap-7 items-center justify-center w-full h-full"
    >
      <WidgetsJudulSection
        text="Cerita Inspiratif Komlekdam XIV/Hasanuddin"
        :with-out-line="true"
      />
      <div v-if="pending">
        <h1>Loading . . .</h1>
      </div>
      <div v-else-if="error">
        <h1>{{ error }}</h1>
      </div>
      <div
        v-else-if="data?.length"
        class="grid grid-cols-1 gap-10 md:px-64 items-center justify-center md:grid-cols-2"
      >
        <div
          class="cursor-pointer relative w-full sm:aspect-[359/461] border-2 border-yellow overflow-hidden"
          v-for="cerita in data"
          :key="cerita.id"
          @click="navigateTo(`/cari-tenar/cerita-inspiratif/${cerita.id}`)"
        >
          <NuxtImg
            :src="`${baseURL}/cerita-inspiratif/thumbnail/${cerita.thumbnailPath}`"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute bottom-0 bg-gradient-to-t from-black via-black flex justify-end flex-col px-4 py-3 to-transparent w-full pt-20"
          >
            <h1 class="font-semibold">{{ cerita.judul }}</h1>
            <h1>{{ truncateHtml(cerita.deskripsi, 20) }}</h1>
          </div>
        </div>
      </div>
      <div v-else>
        <h1>Belum Ada Cerita Inspiratif</h1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { truncateHtml } from "~/function/truncateHtml";

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

type CeritaInspiratif = {
  id: string;
  judul: string;
  deskripsi: string;
  thumbnailPath: string;
};

const { data, pending, error } = await useMyFetch<CeritaInspiratif[]>(
  "/api/cerita-inspiratif",
  {
    lazy: true,
    server: false,
  }
);
</script>
