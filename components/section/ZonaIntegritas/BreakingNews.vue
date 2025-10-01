<template>
  <div class="p-5 sm:px-32 pb-12">
    <WidgetsJudulSection text="Breaking News!" />

    <div v-if="pending" class="grid grid-cols-3 gap-5 animate-pulse">
      <div v-for="n in 6" :key="n" class="flex gap-3">
        <div class="w-40 h-28 bg-gray-800 rounded"></div>
        <div class="space-y-2 flex-1">
          <div class="h-5 bg-gray-700 rounded w-3/4"></div>
          <div class="h-4 bg-gray-600 rounded w-full"></div>
          <div class="h-4 bg-gray-600 rounded w-5/6"></div>
        </div>
      </div>
    </div>
    <div v-else-if="error">
      {{ error }}
    </div>
    <div v-else-if="data?.allBerita?.length">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div
          v-for="(item, index) in data.allBerita"
          :key="index"
          class="flex flex-col gap-3"
        >
          <img
            :src="`${baseURL}/berita/thumbnail/${item.thumbnailPath}`"
            class="w-full object-cover h-40"
            alt=""
          />
          <div>
            <h1 class="font-semibold mb-1">{{ item.judul }}</h1>
            <p class="text-sm hidden sm:block">
              {{ truncateHtml(item.deskripsi, 140) }}
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="totalPages > 1"
        class="flex gap-2 mt-3 text-yellow items-center justify-center"
      >
        <IconsChevron
          class="-rotate-90 cursor-pointer"
          width="30"
          height="30"
          @click="changePage(page - 1)"
          :class="{ 'opacity-50': page === 0 }"
        />
        <WidgetsButtonBaseButton
          v-for="pageNum in visiblePages"
          :key="pageNum"
          class="rounded-lg"
          :variant="page === pageNum ? 'primary' : 'outline'"
          size="sm"
          @click="changePage(pageNum)"
        >
          {{ pageNum + 1 }}
        </WidgetsButtonBaseButton>
        <IconsChevron
          class="rotate-90 cursor-pointer"
          width="30"
          height="30"
          @click="changePage(page + 1)"
          :class="{ 'opacity-50': page >= totalPages - 1 }"
        />
      </div>
    </div>

    <div v-else>
      <h1 class="text-center">Tidak Ada Berita</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { truncateHtml } from "~/function/truncateHtml";

type TBerita = {
  id: number;
  judul: string;
  deskripsi: string;
  thumbnailPath: string;
};

type ResponseType = {
  allBerita: TBerita[];
  totalBerita: number;
};

const axios = useAxios();
const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

const page = ref(0);
const itemsPerPage = 6;
const totalPages = computed(() => {
  if (!data.value?.totalBerita) return 0;
  return Math.ceil(data.value.totalBerita / itemsPerPage);
});

const { data, pending, error } = useMyFetch<ResponseType>(
  "/api/berita/kategori/zona-integritas",
  {
    lazy: true,
    params: {
      page: 0,
      limit: itemsPerPage,
    },
  }
);

async function refreshData() {
  pending.value = true;
  const request = await axios.get("/api/berita/kategori/zona-integritas", {
    params: {
      page: page.value,
      limit: itemsPerPage,
    },
  });

  if (request.data) {
    data.value = request.data;
  } else {
    console.log(request.data);
  }

  pending.value = false;
}

const visiblePages = computed(() => {
  const pages = new Set<number>();
  const current = page.value;
  const total = totalPages.value;

  if (total > 1) {
    pages.add(0);
  }

  for (
    let i = Math.max(0, current - 2);
    i <= Math.min(current + 2, total - 1);
    i++
  ) {
    pages.add(i);
  }

  if (total > 1 && current < total - 3) {
    pages.add(total - 1);
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b);

  if (sortedPages.length > 5) {
    const indexOfCurrent = sortedPages.indexOf(current);
    const startIndex = Math.max(0, indexOfCurrent - 2);
    return sortedPages.slice(startIndex, startIndex + 5);
  }

  return sortedPages;
});

function changePage(pageNumber: number) {
  if (pageNumber >= 0 && pageNumber < totalPages.value) {
    page.value = pageNumber;
    refreshData();
  }
}

const news = [
  {
    title: "KEGIATAN REVIU LAPORAN KEUANGAN TAHUN 2024",
    desc: `Pada hari Rabu, tanggal 15 Januari 2025, Hubdam XIV/Hsn melaksanakan kegiatan yaitu Reviu Laporan Keuangan (LK) Tahun Anggaran 2024. Kegiatan ini berlangsung di Ruang ...`,
    thumbnail: "/image/breaking-news/1.jpeg",
  },
  {
    title:
      "Pelaksanaan Current Audit Ta 2024 Di Hubdam XIV/Hsn Untuk Tingkatkan Akuntabilitas Dan Transparansi",
    desc: `Senin, 9 Desember 2024 – Bertempat di ruang data Hubdam XIV/Hsn, Tim Current Audit Itdam XIV/Hsn melaksanakan kegiatan audit untuk mengevaluasi kinerja ....`,
    thumbnail: "/image/breaking-news/2.png",
  },
  {
    title:
      "Kegiatan Penilaian WTRB/ZI di Hubdam XIV/Hsn OLEH Tim Penilai Internal Kodam XIV/HSN",
    desc: `Kamis, 23/1/2025 Hubdam XIV/Hsn menerima kunjungan Tim Penilai Internal (TPI) Kodam XIV/Hsn untuk melaksanakan penilaian Zona Integritas (ZI) di satuan Hubdam XIV/Hsn ...`,
    thumbnail: "/image/breaking-news/3.png",
  },
];
</script>
