<script setup lang="ts">
import { truncateHtml } from "~/function/truncateHtml";

definePageMeta({
  layout: "landing",
});

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
const itemsPerPage = 8;
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

  if (sortedPages.length > 8) {
    const indexOfCurrent = sortedPages.indexOf(current);
    const startIndex = Math.max(0, indexOfCurrent - 2);
    return sortedPages.slice(startIndex, startIndex + 8);
  }

  return sortedPages;
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
    <div
      class="w-full h-fit bg-center bg-cover bg-[url('/backgrounds/berita-bg1.jpeg')]"
    >
      <div class="w-full h-full px-5 md:px-16 pt-24 bg-black/80 pb-10">
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

        <!-- Loading placeholder untuk bagian atas -->
        <div v-if="pending" class="space-y-6 mt-6">
          <div
            v-for="n in 4"
            :key="n"
            class="grid grid-cols-2 gap-5 animate-pulse"
          >
            <div class="space-y-2">
              <div class="h-6 bg-gray-700 rounded w-3/4"></div>
              <div class="h-4 bg-gray-600 rounded w-full"></div>
              <div class="h-4 bg-gray-600 rounded w-5/6"></div>
            </div>
            <div class="w-full h-[23rem] bg-gray-800 rounded"></div>
          </div>
        </div>

        <!-- 4 berita bagian atas -->
        <div v-else-if="data?.allBerita?.length">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="item in data.allBerita.slice(0, 4)"
              :key="item.id"
              @click="navigateTo(`/berita/${item.id}`)"
              class="flex gap-4 cursor-pointer rounded-md p-3"
            >
              <img
                :src="`${baseURL}/berita/thumbnail/${item.thumbnailPath}`"
                class="w-40 h-28 object-cover rounded shadow"
                alt=""
              />
              <div class="flex-1">
                <h1 class="font-semibold text-white mb-1">
                  {{ item.judul }}
                </h1>
                <p class="text-sm text-gray-300">
                  {{ truncateHtml(item.deskripsi, 140) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Kosong -->
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

    <!-- Bagian bawah (4 berita selanjutnya) -->
    <div class="px-5 md:px-16 py-14">
      <div v-if="pending" class="grid grid-cols-2 gap-5 animate-pulse">
        <div v-for="n in 4" :key="n" class="flex gap-3">
          <div class="w-40 h-28 bg-gray-800 rounded"></div>
          <div class="space-y-2 flex-1">
            <div class="h-5 bg-gray-700 rounded w-3/4"></div>
            <div class="h-4 bg-gray-600 rounded w-full"></div>
            <div class="h-4 bg-gray-600 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      <div v-else-if="data?.allBerita?.length">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div
            v-for="item in data.allBerita.slice(4, 8)"
            :key="item.id"
            @click="navigateTo(`/berita/${item.id}`)"
            class="flex gap-3 cursor-pointer"
          >
            <img
              :src="`${baseURL}/berita/thumbnail/${item.thumbnailPath}`"
              class="max-w-40 rounded shadow object-cover"
              alt=""
            />
            <div class="flex-1 min-w-0">
              <h1 class="mb-1 font-semibold">{{ item.judul }}</h1>
              <p class="text-sm font-thin break-words">
                {{ truncateHtml(item.deskripsi, 140) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination jika total lebih dari 8 -->
      <div
        v-if="totalPages > 1"
        class="flex gap-2 text-yellow mt-3 items-center justify-center"
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
  </div>

  <!-- Mobile view -->
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
            v-for="(item, index) in data.allBerita.slice(0, 8)"
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
