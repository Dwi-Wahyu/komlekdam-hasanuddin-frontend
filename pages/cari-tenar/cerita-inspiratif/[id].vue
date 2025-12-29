<template>
  <div v-if="pending" class="animate-pulse w-full min-h-screen">
    <div
      class="h-screen w-full bg-gray-900 flex flex-col items-center justify-center gap-7 p-20"
    >
      <div class="h-10 w-3/4 md:w-1/2 bg-gray-700 rounded"></div>

      <div
        class="w-full sm:w-[30vw] aspect-video bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center"
      >
        <div class="h-16 w-16 bg-gray-700 rounded-full opacity-50"></div>
      </div>
    </div>

    <div class="p-5 sm:p-10 pb-16 bg-[#1a202c]">
      <div class="space-y-3 max-w-4xl">
        <div class="h-4 bg-gray-700 rounded w-full"></div>
        <div class="h-4 bg-gray-700 rounded w-11/12"></div>
        <div class="h-4 bg-gray-700 rounded w-full"></div>
        <div class="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
  </div>
  <div v-else-if="error">
    <h1>{{ error }}</h1>
  </div>

  <div v-else-if="data">
    <div
      class="w-full h-screen min-h-screen bg-center bg-cover bg-[url('/backgrounds/berita-bg1.jpeg')]"
    >
      <div
        class="bg-black/50 h-full p-20 flex flex-col gap-7 items-center justify-center w-full"
      >
        <WidgetsJudulSection :text="data.judul" />

        <div class="relative">
          <video controls preload="none" class="w-full sm:w-[30vw]">
            <source
              :src="`${baseURL}/cerita-inspiratif/video/${data.videoPath}`"
            />
            Browser tidak mendukung pemutaran video.
          </video>
        </div>
      </div>
    </div>
    <div class="p-5 sm:p-10 pb-16">
      <h1 class="whitespace-pre-line">{{ data.deskripsi }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "landing",
});

const route = useRoute();
const { id } = route.params;

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

type CeritaInspiratif = {
  id: string;
  judul: string;
  deskripsi: string;
  thumbnailPath: string;
  videoPath: string;
};

const { data, pending, error } = await useMyFetch<CeritaInspiratif>(
  `/api/cerita-inspiratif/${id}`,
  {
    lazy: true,
  }
);
</script>
