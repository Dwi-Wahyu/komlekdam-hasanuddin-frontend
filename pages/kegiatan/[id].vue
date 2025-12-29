<template>
  <div v-if="pending" class="animate-pulse w-full min-h-screen">
    <div
      class="h-screen w-full bg-gray-900 flex flex-col items-center justify-center gap-7 p-20"
    >
      <div class="h-10 w-3/4 md:w-1/2 bg-gray-700 rounded"></div>

      <div
        class="w-full sm:w-[30vw] aspect-video bg-gray-800 rounded-lg border border-gray-700"
      >
        <div class="w-full h-full flex items-center justify-center">
          <div class="h-12 w-16 bg-gray-700 rounded"></div>
        </div>
      </div>

      <div class="h-10 w-40 bg-gray-700 rounded"></div>
    </div>

    <div class="p-5 sm:p-10 pb-16 bg-[#1a202c]">
      <div class="space-y-4 max-w-4xl mx-auto">
        <div class="h-4 bg-gray-700 rounded w-full"></div>
        <div class="h-4 bg-gray-700 rounded w-11/12"></div>
        <div class="h-4 bg-gray-700 rounded w-full"></div>
        <div class="h-4 bg-gray-700 rounded w-4/5"></div>
        <div class="h-4 bg-gray-700 rounded w-full"></div>
      </div>

      <div class="mt-16 flex flex-col items-center gap-6">
        <div class="h-8 w-48 bg-gray-700 rounded"></div>

        <div class="grid grid-cols-1 md:grid-cols-3 items-center gap-5 w-full">
          <div
            v-for="i in 3"
            :key="i"
            class="aspect-[4/3] bg-gray-700 rounded-lg w-full"
          ></div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="error">
    {{ error }}
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
              :src="`${baseURL}/kegiatan/${data.kategori}/video/${data.videoPath}`"
            />
            Browser tidak mendukung pemutaran video.
          </video>
        </div>

        <WidgetsButtonBaseButton
          class="rounded flex py-2 items-center gap-2"
          variant="secondary"
          size="sm"
          @click="copyVideoLink"
        >
          <IconsCopy />
          {{ buttonText }}
        </WidgetsButtonBaseButton>
      </div>
    </div>
    <div class="p-5 sm:p-10 pb-16">
      <div v-html="data.detail"></div>

      <div class="mt-10">
        <WidgetsJudulSection text="Dokumentasi" />

        <div class="grid grid-cols-1 md:grid-cols-3 items-center gap-5">
          <NuxtImg
            v-for="dokumentasi in data.dokumentasi"
            :key="dokumentasi.id"
            :src="`${baseURL}/kegiatan/${data.kategori}/dokumentasi/${dokumentasi.path}`"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

definePageMeta({
  layout: "landing",
});

type TDokumentasi = {
  id: number;
  path: string;
};

type TEachKegiatanType = {
  judul: string;
  tanggal: string;
  kategori: string;
  detail: string;
  videoPath: string;
  thumbnailPath: string;
  id: number;
  dokumentasi: TDokumentasi[];
};

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

const route = useRoute();
const { id } = route.params;

const { data, pending, error } = await useMyFetch<TEachKegiatanType>(
  `/api/kegiatan/${id}`,
  {
    server: false,
    lazy: true,
  }
);

// --- State & Fungsi Copy Link ---
const buttonText = ref("Salin Link Video");

const copyVideoLink = async () => {
  if (!data.value) return;

  const videoUrl = `${baseURL}/kegiatan/${data.value.kategori}/video/${data.value.videoPath}`;

  try {
    await navigator.clipboard.writeText(videoUrl);
    buttonText.value = "Link Tersalin!";
    setTimeout(() => {
      buttonText.value = "Salin Link Video";
    }, 2000);
  } catch (err) {
    console.error("Gagal menyalin link: ", err);
    buttonText.value = "Gagal Menyalin";
    setTimeout(() => {
      buttonText.value = "Salin Link Video";
    }, 2000);
  }
};
</script>
