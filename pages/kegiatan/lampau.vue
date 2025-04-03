<template>
  <div class="min-h-[100vh] pt-24 pb-10 md:pb-24 px-5 md:px-64">
    <div class="flex mb-5 gap-2 justify-between flex-col md:flex-row">
      <WidgetsJudulSection text="Kegiatan Lampau" :with-out-line="true" />
      <div class="flex gap-4 flex-col md:flex-row">
        <WidgetsDataInputBaseInput placeholder="Cari Judul" v-model="judul" />
        <WidgetsDataInputBaseSelect
          :options="kategoriOptions"
          v-model="kategori"
        />
      </div>
    </div>
    <div v-if="pending">
      <h1>Loading . . .</h1>
    </div>
    <div v-else-if="error">
      <h1>{{ error }}</h1>
    </div>
    <div
      v-else-if="data"
      class="grid grid-cols-1 gap-10 items-center justify-center md:grid-cols-2"
    >
      <div
        class="cursor-pointer relative w-full sm:aspect-[359/461] border-2 border-yellow overflow-hidden"
        v-for="kegiatan in data"
        :key="kegiatan.id"
        @click="navigateTo(`/kegiatan/${kegiatan.id}`)"
      >
        <NuxtImg
          :src="`${baseURL}/kegiatan/${kegiatan.kategori}/thumbnail/${kegiatan.thumbnailPath}`"
          class="w-full h-full object-cover"
        />
        <div class="bg-yellow text-white px-2 py-1 absolute right-0 top-0">
          <h1>{{ kegiatan.kategori }}</h1>
        </div>
        <div
          class="absolute bottom-0 bg-gradient-to-t from-black via-black flex justify-end flex-col px-4 py-3 to-transparent w-full pt-20"
        >
          <h1 class="font-semibold">{{ kegiatan.judul }}</h1>
          <h1>{{ truncateHtml(kegiatan.deskripsi, 20) }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { truncateHtml } from "~/function/truncateHtml";
import type { TEachKegiatanType } from "~/store/kegiatan";

definePageMeta({
  layout: "landing",
});

const kategoriOptions = [
  { label: "Pilih Kategori", value: "" },
  { label: "Program", value: "program" },
  { label: "Non Program", value: "non-program" },
];

const kategori = ref("");
const judul = ref("");

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

const queryParams = computed(() => ({
  kategori: kategori.value,
  judul: judul.value,
}));

const { data, pending, error, refresh } = await useMyFetch<TEachKegiatanType[]>(
  "/api/kegiatan/lampau",
  {
    lazy: true,
    query: queryParams,
  }
);

watch([kategori, judul], () => {
  refresh();
});
</script>
