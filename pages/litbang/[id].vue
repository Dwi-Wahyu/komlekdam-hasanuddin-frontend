<template>
  <div v-if="pending">Loading . . .</div>
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
            <source :src="`${baseURL}/litbang/video/${data.videoPath}`" />
            Browser tidak mendukung pemutaran video.
          </video>
        </div>
      </div>
    </div>
    <div class="p-5 sm:p-10 pb-16">
      <div v-html="data.detail"></div>

      <div class="mt-10">
        <WidgetsJudulSection text="Dokumentasi" />

        <div class="grid grid-cols-3 items-center gap-5">
          <NuxtImg
            v-for="dokumentasi in data.dokumentasi"
            :src="`${baseURL}/litbang/dokumentasi/${dokumentasi.path}`"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "landing",
});

type TDokumentasi = {
  id: number;
  path: string;
};

type TEachLitbangType = {
  judul: string;
  tanggal: string;
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

const { data, pending, error } = await useMyFetch<TEachLitbangType>(
  `/api/litbang/${id}`
);
</script>
