<template>
  <div class="w-full h-fit md:h-screen">
    <div
      class="w-full h-full pt-20 p-5 flex-col text-center md:pt-10 flex items-center justify-center"
    >
      <WidgetsJudulSection text="PEJABAT KOMLEKDAM XIV/HASANUDDIN" />

      <p class="text-sm mt-2 md:w-[50vw]">
        Di bawah kepemimpinan Kakomlekdam dan Wakakomlekdam, Hubdam
        XIV/Hasanuddin berperan dalam memastikan kelancaran komunikasi
        militer...
      </p>

      <div
        class="flex gap-10 md:flex-row flex-col md:gap-20 mt-3"
        v-if="data?.pimpinan?.length"
      >
        <div
          v-for="(pimpinan, index) in data.pimpinan"
          :key="index"
          class="flex flex-col items-center"
        >
          <img
            :src="`${baseURL}/profil/${pimpinan.pasfoto}`"
            :alt="pimpinan.nama"
            class="w-[15rem]"
          />
          <div
            class="shadow px-3 flex w-full flex-col items-center shadow-yellow"
          >
            <h1>{{ pimpinan.nama }}</h1>
            <div></div>
            <h1 class="text-yellow text-sm">{{ pimpinan.jabatan }}</h1>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="py-16 px-5 flex flex-wrap justify-center gap-8">
    <template v-if="!pending && !error">
      <div
        v-for="pejabat in data?.allPejabat || []"
        :key="pejabat.nomor"
        class="w-[15rem] flex flex-col"
      >
        <img
          :src="`${baseURL}/profil/pejabat/${pejabat.pasfoto}`"
          :alt="pejabat.nama"
          class="w-full h-auto object-cover"
        />
        <div
          class="shadow shadow-yellow flex flex-col items-center w-full px-3 py-2 flex-grow"
        >
          <h1 class="text-center font-bold">{{ pejabat.nama }}</h1>
          <h1 class="text-yellow text-sm text-center">{{ pejabat.jabatan }}</h1>
        </div>
      </div>
    </template>

    <div v-if="pending" class="col-span-full text-center py-10">
      Memuat data pejabat...
    </div>

    <div v-if="error" class="col-span-full text-center py-10 text-red-500">
      Gagal memuat data pejabat
    </div>
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

const { data, pending, error } = useMyFetch<TResponse>("/api/pejabat", {
  lazy: true,
  server: false,
});
</script>
