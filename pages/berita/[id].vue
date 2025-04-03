<template>
  <div class="w-full text-white px-5 pb-5 md:px-11 md:pb-10 pt-20">
    <div v-if="pending">
      <h1>Loading . . .</h1>
    </div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="flex flex-col gap-5">
      <div class="grid grid-cols-3 gap-8">
        <div class="gap-3 md:col-span-2 col-span-3 flex flex-col">
          <div>
            <h1 class="font-semibold text-2xl text-yellow">
              {{ data?.judul }}
            </h1>
            <h1 class="text-sm text-gray-400 mt-1">
              {{ data?.lokasi }}, {{ data?.tanggal }} - {{ data?.penulis }} -
              {{ data?.kategori }}
            </h1>
          </div>

          <img
            :src="`${baseURL}/berita/thumbnail/${data?.thumbnailPath}`"
            alt=""
          />
        </div>
        <div class="hidden flex-col gap-5 md:flex">
          <div class="flex items-center gap-4">
            <h1>Berita Populer</h1>
            <div class="flex-grow border border-white"></div>
          </div>
          <div v-if="pendingBeritaPopuler">
            <h1>Loading berita populer . . .</h1>
          </div>
          <div v-else-if="errorBeritaPopuler">
            <h1>Loading berita populer . . .</h1>
          </div>
          <div
            v-else-if="beritaPopuler"
            v-for="berita in beritaPopuler"
            class="flex cursor-pointer items-center bg-[#303949] rounded-l-full"
            :key="berita.id"
            @click="navigateTo(`/berita/${berita.id}`)"
          >
            <img
              :src="`${baseURL}/berita/thumbnail/${berita.thumbnailPath}`"
              class="rounded-full w-20 h-20"
            />
            <div class="p-3">
              <h1 class="text-sm">
                {{ truncateHtml(berita.judul, 110) }}
              </h1>
            </div>
          </div>
          <div v-else>
            <h1>Belum ada berita lainnya</h1>
          </div>
        </div>
      </div>

      <div v-html="data?.detail"></div>

      <div class="flex flex-col gap-5 md:hidden">
        <div class="flex items-center gap-4">
          <h1>Berita Populer</h1>
          <div class="flex-grow border border-white"></div>
        </div>
        <div
          v-for="berita in beritaPopuler"
          class="flex cursor-pointer items-center bg-[#303949] rounded-l-full"
          :key="berita.id"
          @click="navigateTo(`/berita/${berita.id}`)"
        >
          <img
            :src="`${baseURL}/berita/thumbnail/${berita.thumbnailPath}`"
            class="rounded-full w-20 h-20"
          />
          <div class="p-3">
            <h1 class="text-sm">
              {{ truncateHtml(berita.judul, 100) }}
            </h1>
          </div>
        </div>
      </div>

      <PageKomentar :id="data?.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
import { truncateHtml } from "~/function/truncateHtml";

moment.locale("id");

definePageMeta({
  layout: "landing",
});

const route = useRoute();
const { id } = route.params;

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

type TBalasanKomentar = {
  id: number;
  isi: string;
  nama: string;
  like: number;
  dislike: number;
  tanggal: string;
};

type TKomentar = {
  id: number;
  isi: string;
  nama: string;
  like: number;
  dislike: number;
  tanggal: string;
  balasan_komentar: TBalasanKomentar[];
};

type TBerita = {
  id: number;
  judul: string;
  penulis: string;
  lokasi: string;
  deskripsi: string;
  tanggal: string;
  thumbnailPath: string;
  kategori: string;
  detail: string;
  like: number;
  dislike: number;
  komentar: TKomentar[];
};

const {
  data: beritaPopuler,
  pending: pendingBeritaPopuler,
  error: errorBeritaPopuler,
} = await useMyFetch<TBerita[]>("/api/berita/populer", {
  lazy: true,
  query: {
    excludeId: id,
  },
});

const { data, error, pending, refresh } = await useMyFetch<TBerita>(
  "/api/berita/" + id,
  {
    lazy: true,
    transform: (response) => {
      const formatted = moment(response.tanggal, "YYYY-MM-DD").format(
        "DD MMMM YYYY"
      );

      response.tanggal = formatted;

      return response;
    },
  }
);
</script>
