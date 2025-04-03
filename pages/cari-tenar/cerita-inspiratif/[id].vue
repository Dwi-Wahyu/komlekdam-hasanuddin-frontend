<template>
  <div v-if="pending">
    <h1>Loading . . .</h1>
  </div>
  <div v-else-if="error">
    <h1>{{ error }}</h1>
  </div>
  <div v-if="data">
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
      <h1>{{ data.deskripsi }}</h1>
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
