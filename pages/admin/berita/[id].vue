<template>
  <WidgetsTambahBackButton
    link="/berita/detail-berita"
    kembali-to="/admin/berita"
    class="text-white"
  />

  <WidgetsJudulSection text="Detail Berita" />

  <div class="w-full text-white px-7 py-6 bg-[#303949]">
    <div v-if="pending">
      <h1>Loading . . .</h1>
    </div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="data" class="flex flex-col gap-5">
      <div>
        <h1 class="text-center font-semibold text-2xl text-yellow">
          {{ data.judul }}
        </h1>
        <h1 class="text-center text-sm text-gray-400 mt-1">
          {{ data.lokasi }}, {{ data.tanggal }} - {{ data.penulis }} -
          {{ data.kategori }}
        </h1>
      </div>

      <div class="flex justify-center">
        <img
          :src="`${baseURL}/berita/thumbnail/${data?.thumbnailPath}`"
          alt=""
        />
      </div>

      <div>
        <h1>Deskripsi Singkat :</h1>
        <h1>{{ data?.deskripsi }}</h1>
      </div>

      <div>
        <h1>Detail :</h1>
        <div v-html="data?.detail"></div>
      </div>

      <div class="flex justify-end">
        <PageLikeDislike
          :id="data.id"
          konten="main"
          :like="data.like"
          :dislike="data.dislike"
        />
      </div>

      <PageKomentar :id="parseInt(id as string)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";

moment.locale("id");

definePageMeta({
  layout: "tambah",
  middleware: "auth",
});

const route = useRoute();
const { id } = route.params;

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

type TBalasanKomentar = {
  id: number;
  isi: true;
  like: true;
  dislike: true;
  tanggal: true;
};

type TKomentar = {
  id: number;
  isi: true;
  like: true;
  dislike: true;
  tanggal: true;
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

const { data, refresh, error, pending } = await useMyFetch<TBerita>(
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
