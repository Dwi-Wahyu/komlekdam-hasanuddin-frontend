<template>
  <div class="w-full h-fit md:h-screen">
    <div
      class="w-full h-full pt-20 p-5 flex-col text-center md:pt-10 flex items-center justify-center"
    >
      <WidgetsJudulSection text="PEJABAT KOMLEKDAM XIV/HASANUDDIN" />

      <p class="text-sm mt-2 md:w-[50vw]">
        Di bawah kepemimpinan Kakomlekdam dan Waka Komlekdam, Komlekdam
        XIV/Hasanuddin berperan dalam memastikan kelancaran komunikasi
        militer...
      </p>

      <div
        v-if="pending"
        class="flex gap-10 md:flex-row flex-col md:gap-20 mt-3 animate-pulse"
      >
        <div v-for="i in 2" :key="i" class="flex flex-col items-center">
          <div class="w-[15rem] h-[20rem] bg-gray-700 rounded-t-lg"></div>
          <div class="h-16 w-full bg-gray-600 rounded-b-lg mt-1"></div>
        </div>
      </div>

      <div
        class="flex gap-10 md:flex-row flex-col md:gap-20 mt-3"
        v-else-if="data?.pimpinan?.length"
      >
        <div
          v-for="(pimpinan, index) in data.pimpinan"
          :key="index"
          class="flex flex-col items-center relative"
        >
          <div
            v-if="!imgStates['pimpinan-' + index]"
            class="w-[15rem] h-[20rem] bg-gray-700 animate-pulse absolute top-0 z-10"
          ></div>

          <NuxtImg
            :src="`${baseURL}/profil/${pimpinan.pasfoto}`"
            :alt="pimpinan.nama"
            class="w-[15rem] transition-opacity duration-500"
            :class="
              imgStates['pimpinan-' + index] ? 'opacity-100' : 'opacity-0'
            "
            @load="handleImageLoad('pimpinan-' + index)"
          />

          <div
            class="shadow px-3 py-2 flex w-full flex-col items-center shadow-yellow bg-[#30394a]"
          >
            <h1 class="font-semibold">{{ pimpinan.nama }}</h1>
            <h1
              class="text-yellow text-sm"
              v-if="pimpinan.jabatan !== 'WakaKomlekdam'"
            >
              {{ pimpinan.jabatan }}
            </h1>
            <h1 class="text-yellow text-sm" v-else>Waka Komlekdam</h1>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="py-16 px-5 flex flex-wrap justify-center gap-8">
    <template v-if="pending">
      <div
        v-for="i in 4"
        :key="i"
        class="w-[15rem] flex flex-col animate-pulse"
      >
        <div class="w-full h-[18rem] bg-gray-700"></div>
        <div class="h-14 bg-gray-600 mt-1 w-full"></div>
      </div>
    </template>

    <div v-if="error" class="col-span-full text-center py-10 text-red-500">
      Gagal memuat data pejabat
    </div>

    <template v-if="!pending && !error">
      <div
        v-for="(pejabat, index) in data?.allPejabat || []"
        :key="pejabat.nomor"
        class="w-[15rem] flex flex-col relative"
      >
        <div
          v-if="!imgStates['pejabat-' + index]"
          class="w-full aspect-[3/4] bg-gray-700 animate-pulse absolute top-0 z-10"
        ></div>

        <NuxtImg
          :src="`${baseURL}/profil/pejabat/${pejabat.pasfoto}`"
          :alt="pejabat.nama"
          class="w-full h-auto object-cover transition-opacity duration-500"
          :class="imgStates['pejabat-' + index] ? 'opacity-100' : 'opacity-0'"
          loading="lazy"
          @load="handleImageLoad('pejabat-' + index)"
        />

        <div
          class="shadow shadow-yellow flex flex-col items-center w-full px-3 py-2 flex-grow bg-[#30394a]"
        >
          <h1 class="text-center font-bold">{{ pejabat.nama }}</h1>
          <h1 class="text-yellow text-sm text-center">{{ pejabat.jabatan }}</h1>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
type TPejabat = {
  nomor: number;
  nama: string;
  pasfoto: string;
  jabatan: string;
};

type TPimpinan = {
  jabatan: string;
  nama: string;
  pasfoto: string;
};

type TResponse = {
  allPejabat: TPejabat[];
  pimpinan: TPimpinan[];
};

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

// State untuk menyimpan status loading setiap gambar secara individual
// Format key: 'pimpinan-0', 'pejabat-1', dst.
const imgStates = ref<Record<string, boolean>>({});

// Fungsi yang dipanggil saat gambar selesai diload oleh browser
const handleImageLoad = (id: string) => {
  imgStates.value[id] = true;
};

const { data, pending, error } = useMyFetch<TResponse>("/api/pejabat", {
  lazy: true,
  server: false,
});
</script>
