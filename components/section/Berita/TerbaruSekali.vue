<script setup lang="ts">
import {
  artikel,
  beritaEksternal,
  beritaInternal,
  beritaZonaIntegritas,
} from "~/data/landing/berita";

const jenisBerita = ref("artikel");

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;
const axios = useAxios();

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

const url = computed(() => `/api/berita/kategori/${jenisBerita.value}`);

const page = ref(0);
const itemsPerPage = 3;
const totalPages = computed(() => {
  if (!data.value?.totalBerita) return 0;
  return Math.ceil(data.value.totalBerita / itemsPerPage);
});

const { data, pending, error } = useMyFetch<ResponseType>(url.value, {
  lazy: true,
  params: {
    page: 0,
    limit: itemsPerPage,
  },
});

async function refreshData() {
  pending.value = true;
  const request = await axios.get(url.value, {
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
  const pages = [];
  const current = page.value;
  const total = totalPages.value;

  if (current > 1) pages.push(0);

  // Tampilkan halaman sekitar current
  for (
    let i = Math.max(0, current - 1);
    i <= Math.min(current + 1, total - 1);
    i++
  ) {
    if (!pages.includes(i)) pages.push(i);
  }

  // Selalu tampilkan halaman terakhir jika berbeda
  if (current < total - 2 && total > 1) pages.push(total - 1);

  return pages.slice(0, 3); // Maksimal 3 tombol
});

function changePage(pageNumber: number) {
  if (pageNumber >= 0 && pageNumber < totalPages.value) {
    page.value = pageNumber;
    refreshData();
  }
}

function handleChangeJenis(jenis: string) {
  jenisBerita.value = jenis;
  page.value = 0;
  refreshData();
}
</script>

<template>
  <div class="md:block hidden">
    <!-- Desktop view remains the same -->
    <div
      class="w-full h-screen bg-center bg-cover bg-[url('/backgrounds/berita-bg1.jpeg')]"
    >
      <div class="w-full h-full px-5 md:px-16 pt-24 bg-black/80">
        <div class="flex gap-3 items-center">
          <h1 class="text-yellow text-2xl font-bold">Berita Terbaru</h1>
          <div class="flex-grow border border-yellow"></div>
        </div>
        <div class="flex justify-center gap-3 my-3 mb-5">
          <WidgetsButtonBaseButton
            @click="handleChangeJenis('artikel')"
            class="rounded-lg"
            :variant="jenisBerita === 'artikel' ? 'primary' : 'outline'"
          >
            Artikel
          </WidgetsButtonBaseButton>
          <WidgetsButtonBaseButton
            @click="handleChangeJenis('eksternal')"
            class="rounded-lg"
            :variant="jenisBerita === 'eksternal' ? 'primary' : 'outline'"
          >
            External
          </WidgetsButtonBaseButton>
          <WidgetsButtonBaseButton
            @click="handleChangeJenis('internal')"
            class="rounded-lg"
            :variant="jenisBerita === 'internal' ? 'primary' : 'outline'"
          >
            Internal
          </WidgetsButtonBaseButton>
          <WidgetsButtonBaseButton
            @click="handleChangeJenis('zona-integritas')"
            class="rounded-lg"
            :variant="jenisBerita === 'zona-integritas' ? 'primary' : 'outline'"
          >
            Zona Integritas
          </WidgetsButtonBaseButton>
        </div>
        <div v-if="pending">
          <h1>Loading . . .</h1>
        </div>
        <div v-else-if="error">
          {{ error }}
        </div>
        <div v-if="data?.allBerita?.length">
          <div
            v-for="(item, index) in data.allBerita"
            :key="item.id"
            @click="navigateTo(`/berita/${item.id}`)"
            class="gap-5 grid grid-cols-2 cursor-pointer"
          >
            <div v-if="index === 0">
              <h1 class="font-semibold text-lg mb-2">{{ item.judul }}</h1>
              <p class="font-thin">{{ item.deskripsi }}</p>
            </div>
            <img
              v-if="index === 0"
              :src="`${baseURL}/berita/thumbnail/${item.thumbnailPath}`"
              class="w-[30rem] object-cover h-[23rem]"
              alt=""
            />
          </div>
        </div>
        <div
          v-else
          class="flex justify-center items-center h-40 gap-5 flex-col"
        >
          <h1 class="text-xl font-semibold">
            Belum ada berita {{ jenisBerita }}
          </h1>
          <IconsEmpty />
        </div>
      </div>
    </div>
    <div class="px-5 md:px-16 py-14">
      <div v-if="pending">
        <h1>Loading . . .</h1>
      </div>
      <div v-else-if="error">
        {{ error }}
      </div>
      <div v-if="data?.totalBerita" class="">
        <div
          v-if="data?.allBerita?.length > 1"
          class="grid grid-cols-1 sm:grid-cols-2 mb-5"
        >
          <div
            v-for="(item, index) in data.allBerita.slice(1)"
            :key="item.id"
            class="flex gap-3"
          >
            <img
              :src="`${baseURL}/berita/thumbnail/${item.thumbnailPath}`"
              class="max-w-40"
              alt=""
            />
            <div>
              <h1 class="mb-2 font-semibold text-lg">{{ item.judul }}</h1>
              <p class="text-sm font-thin">{{ item.deskripsi }}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="totalPages > 1"
        class="flex gap-2 text-yellow items-center justify-center"
      >
        <IconsChevron
          class="-rotate-90 cursor-pointer"
          width="30"
          height="30"
          @click="changePage(page - 1)"
          :class="{ 'opacity-50': page === 0 }"
        />

        <WidgetsButtonBaseButton
          v-for="pageNum in totalPages"
          :key="pageNum"
          class="rounded-lg"
          :variant="page === pageNum - 1 ? 'primary' : 'outline'"
          size="sm"
          @click="changePage(pageNum - 1)"
        >
          {{ pageNum }}
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
  </div>

  <!-- Mobile view using useMyFetch -->
  <div class="md:hidden">
    <div
      class="w-full h-full bg-center bg-cover bg-[url('/backgrounds/berita-bg1.jpeg')]"
    >
      <div class="w-full h-full px-5 pb-7 md:px-16 pt-24 bg-black/80">
        <div class="flex gap-3 items-center">
          <h1 class="text-yellow text-xl font-bold">Berita Terbaru</h1>
          <div class="flex-grow border border-yellow"></div>
        </div>
        <div class="flex justify-center flex-wrap gap-3 my-4 mb-5">
          <WidgetsButtonBaseButton
            @click="handleChangeJenis('artikel')"
            class="rounded-lg"
            :variant="jenisBerita === 'artikel' ? 'primary' : 'outline'"
          >
            Artikel
          </WidgetsButtonBaseButton>
          <WidgetsButtonBaseButton
            @click="handleChangeJenis('eksternal')"
            class="rounded-lg"
            :variant="jenisBerita === 'eksternal' ? 'primary' : 'outline'"
          >
            External
          </WidgetsButtonBaseButton>
          <WidgetsButtonBaseButton
            @click="handleChangeJenis('internal')"
            class="rounded-lg"
            :variant="jenisBerita === 'internal' ? 'primary' : 'outline'"
          >
            Internal
          </WidgetsButtonBaseButton>
          <WidgetsButtonBaseButton
            @click="handleChangeJenis('zona-integritas')"
            class="rounded-lg"
            :variant="jenisBerita === 'zona-integritas' ? 'primary' : 'outline'"
          >
            Zona Integritas
          </WidgetsButtonBaseButton>
        </div>

        <div v-if="pending">
          <h1>Loading . . .</h1>
        </div>
        <div v-else-if="error">
          {{ error }}
        </div>

        <template v-if="data?.allBerita?.length">
          <div
            v-for="(item, index) in data.allBerita.slice(0, 3)"
            :key="item.id"
            class="relative mb-4 cursor-pointer"
            @click="navigateTo(`/berita/${item.id}`)"
          >
            <div
              class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20"
            ></div>
            <div class="absolute bottom-0 left-0 p-5 text-wrap z-30">
              <h1 class="text-white font-semibold">
                {{ item.judul }}
              </h1>
            </div>
            <img
              :src="`${baseURL}/berita/thumbnail/${item.thumbnailPath}`"
              class="w-full shadow"
              alt=""
            />
          </div>
        </template>
        <div
          v-else
          class="flex justify-center items-center h-40 gap-5 flex-col"
        >
          <h1 class="text-xl font-semibold">
            Belum ada berita {{ jenisBerita }}
          </h1>
          <IconsEmpty />
        </div>

        <div
          v-if="totalPages > 1"
          class="flex gap-2 text-yellow items-center justify-center mt-1"
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
            size="sm"
            :variant="page === pageNum ? 'primary' : 'outline'"
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
    </div>
  </div>
</template>
