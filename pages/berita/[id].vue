<template>
  <div class="w-full text-white px-5 pb-5 md:px-11 md:pb-10 pt-20">
    <div v-if="pending" class="animate-pulse flex flex-col gap-5">
      <div class="grid grid-cols-3 gap-8">
        <div class="gap-3 md:col-span-2 col-span-3 flex flex-col">
          <div class="h-8 md:h-10 bg-gray-700 rounded w-3/4 mb-2"></div>

          <div class="flex justify-between mt-2 mb-4">
            <div class="flex items-center gap-2">
              <div class="h-4 w-24 bg-gray-700 rounded"></div>
              <div class="h-4 w-24 bg-gray-700 rounded"></div>
            </div>
            <div class="h-8 w-32 bg-gray-700 rounded-full"></div>
          </div>

          <div class="w-full aspect-video bg-gray-700 rounded-lg"></div>
          
          <div class="h-4 w-1/2 bg-gray-700 rounded mt-2"></div>

          <div class="mt-8 space-y-3">
            <div class="h-4 bg-gray-700 rounded w-full"></div>
            <div class="h-4 bg-gray-700 rounded w-full"></div>
            <div class="h-4 bg-gray-700 rounded w-11/12"></div>
            <div class="h-4 bg-gray-700 rounded w-full"></div>
            <div class="h-4 bg-gray-700 rounded w-4/5"></div>
          </div>
        </div>

        <div class="hidden flex-col gap-5 md:flex">
          <div class="flex items-center gap-4">
            <div class="h-6 w-32 bg-gray-700 rounded"></div>
            <div class="flex-grow border-t border-gray-700"></div>
          </div>
          
          <div v-for="i in 4" :key="i" class="flex items-center bg-[#303949] rounded-l-full">
            <div class="rounded-full w-20 h-20 bg-gray-600 shrink-0"></div>
            <div class="p-3 w-full">
              <div class="h-4 bg-gray-600 rounded w-full mb-2"></div>
              <div class="h-4 bg-gray-600 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="flex flex-col gap-5">
      <div class="grid grid-cols-3 gap-8">
        <div class="gap-3 md:col-span-2 col-span-3 flex flex-col">
          <div>
            <h1 class="font-semibold text-xl md:text-3xl text-yellow">
              {{ data?.judul }}
            </h1>
            <div class="flex justify-between mt-2">
              <div
                class="flex items-center text-xs md:text-sm text-yellow gap-2"
              >
                <div class="inline-flex gap-1 items-center">
                  <IconsEye />
                  <h1>{{ data?.jumlahPengunjung }} kali dilihat</h1>
                </div>

                <div class="inline-flex gap-1 items-center">
                  <IconsShare />
                  <h1>{{ data?.jumlahDibagikan }} kali dibagikan</h1>
                </div>
              </div>

              <WidgetsButtonBaseButton
                size="sm"
                variant="outline"
                add-class="rounded-full"
                @click="showShareBerita = true"
              >
                <div class="md:flex gap-1 hidden items-center">
                  <IconsPaperPlane />

                  <span> Bagikan Berita </span>
                </div>
                <div class="md:hidden block">
                  <IconsPaperPlane width="14" height="14" />
                </div>
              </WidgetsButtonBaseButton>
            </div>
          </div>

          <img
            :src="`${baseURL}/berita/thumbnail/${data?.thumbnailPath}`"
            alt=""
          />
          <h1 class="text-sm text-gray-400 mt-1">
            {{ data?.lokasi }}, {{ data?.tanggal }} - {{ data?.penulis }} -
            {{ data?.kategori }}
          </h1>
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
            <h1>Error berita populer . . .</h1>
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

  <WidgetsPopupShareBerita
    v-if="showShareBerita"
    @close="showShareBerita = false"
    @refresh="refresh"
    :label="data?.judul"
    :linkBerita="`https://hubdam14hsn.tni-ad.mil.id/berita/${data?.id}`"
    :idBerita="data?.id"
  />
</template>

<script setup lang="ts">
import moment from "moment";
import { truncateHtml } from "~/function/truncateHtml";

moment.locale("id");

definePageMeta({
  layout: "landing",
});

const showShareBerita = ref(false);

const route = useRoute();
const axios = useAxios();
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
  jumlahPengunjung: number;
  jumlahDibagikan: number;
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
  server: false,
  query: {
    excludeId: id,
  },
});

const { data, error, pending, refresh } = await useMyFetch<TBerita>(
  "/api/berita/" + id,
  {
    lazy: true,
    server: false,
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
