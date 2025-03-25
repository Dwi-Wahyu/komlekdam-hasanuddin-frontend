<template>
  <div class="flex gap-1 items-center">
    <button @click="navigateTo('/admin/profil')">
      <IconsChevron width="20" height="20" class="-rotate-90" />
    </button>
    <WidgetsAdminPageTitle
      title="Kakomlekdam dan Wakakomlekdam XIV/ Hasanuddin"
    />
  </div>

  <div v-if="loading">
    <h1>Loading . . .</h1>
  </div>
  <div v-else-if="error">
    {{ error.cause }}
  </div>
  <div v-else class="mt-5 grid grid-cols-1 gap-7 md:grid-cols-2">
    <div
      v-for="(pimpinan, pimpinanIdx) in data"
      :key="pimpinanIdx"
      class="flex-col gap-3 p-4 shadow-[7px_7px_0px_0px_rgba(0,0,0,0.2)] bg-[#303949] flex items-center justify-center"
    >
      <div v-if="pimpinan" class="w-full">
        <div class="flex items-center w-full gap-3 justify-between">
          <div>
            <h1 class="text-yellow">
              {{ pimpinan.nama }}
            </h1>
            <h1 class="text-sm">
              <span v-if="pimpinan.jabatan === 'kakomlekdam'">
                Kakomlekdam XIV/ Hasanuddin
              </span>

              <span v-else> Wakakomlekdam XIV/ Hasanuddin </span>
            </h1>
          </div>

          <button
            @click="
              navigateTo(
                `/admin/profil/pimpinan/edit-pimpinan/${pimpinan.jabatan}`
              )
            "
          >
            <IconsEdit width="17" height="17" fill="#fff" />
          </button>
        </div>

        <div class="flex justify-center">
          <img
            :src="`${baseURL}/profil/${pimpinan.pasfoto}`"
            class="max-w-60 md:max-w-72"
            alt=""
          />
        </div>
      </div>
      <div
        v-else
        @click="navigateTo('/admin/profil/pimpinan/tambah-pimpinan')"
        class="flex cursor-pointer flex-col gap-5 items-center"
      >
        <h1 class="text-yellow">Belum Menambahkan Data {{ pimpinanIdx }}</h1>
        <IconsUserFill />
        <h1 class="text-sm">Klik disini untuk menambahkan data</h1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
  middleware: "auth",
});

type Pimpinan = {
  jabatan: string;
  nama: string;
  pasfoto: string;
};

type ResponseData = {
  kakomlekdam: Pimpinan;
  wakakomlekdam: Pimpinan;
};

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

const {
  data,
  pending: loading,
  error,
} = useMyFetch<ResponseData>("/api/pejabat/pimpinan", {
  lazy: true,
});
</script>
