<template>
  <div class="flex gap-1 items-center">
    <button @click="navigateTo('/admin/profil/mitra')">
      <IconsChevron width="20" height="20" class="-rotate-90" />
    </button>
    <WidgetsAdminPageTitle title="Dokumentasi Mitra" />
  </div>
  <div class="mt-5 p-5 bg-[#303949] shadow-[7px_7px_0px_0px_rgba(0,0,0,0.2)]">
    <div v-if="pending">
      <h1>Loading . . .</h1>
    </div>
    <div v-else-if="error">
      <h1>{{ error }}</h1>
    </div>
    <div v-else>
      <div v-if="data?.dokumentasi.length">
        <div class="mb-3 flex items-center gap-3">
          <WidgetsButtonBaseButton
            @click="
              navigateTo(
                `/admin/profil/mitra/dokumentasi/tambah-dokumentasi/${id}`
              )
            "
            class="flex gap-1 items-center"
          >
            <IconsPlus />
            Tambahkan Dokumentasi
          </WidgetsButtonBaseButton>
          <WidgetsButtonBaseButton
            @click="togglePilihDokumentasi"
            variant="secondary"
            class="flex gap-1 items-center"
          >
            <IconsSelect />
            Pilih Dokumentasi
          </WidgetsButtonBaseButton>
          <WidgetsButtonBaseButton
            v-if="dokumentasiDipilih.length > 0"
            @click="toggleAlert"
            variant="danger"
            class="flex gap-1 items-center"
          >
            <IconsTrash />
            Hapus Dokumentasi
          </WidgetsButtonBaseButton>
        </div>
        <div class="grid grid-cols-2 gap-5">
          <div
            class="relative group cursor-pointer"
            v-for="(dokumentasi, dokumentasiIdx) in data.dokumentasi"
            :class="pilihDokumentasi ? 'shadow-lg' : ''"
            :key="dokumentasiIdx"
          >
            <div
              v-if="pilihDokumentasi"
              class="bg-gradient-to-t ease-in-out w-full bottom-0 h-36 px-5 py-4 flex flex-col justify-end from-black via-black to-transparent absolute"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h1 class="font-semibold">
                    {{ dokumentasi.judul_keterangan }}
                  </h1>
                  <h1 class="text-sm">{{ dokumentasi.narasi_keterangan }}</h1>
                </div>

                <WidgetsDataInputBaseCheckbox
                  @click="toggleSelectDokumentasi(dokumentasi.dokumentasiPath)"
                />
              </div>
            </div>
            <div
              v-else
              class="bg-gradient-to-t group-hover:opacity-0 transition-all duration-300 ease-in-out w-full bottom-0 h-36 px-5 py-4 flex flex-col justify-end from-black via-black to-transparent absolute"
            >
              <h1 class="font-semibold">
                {{ dokumentasi.judul_keterangan }}
              </h1>
              <h1 class="text-sm">{{ dokumentasi.narasi_keterangan }}</h1>
            </div>
            <img
              :src="`${baseURL}/profil/mitra/dokumentasi/${dokumentasi.dokumentasiPath}`"
              alt=""
            />
          </div>
        </div>
      </div>
      <div
        v-else
        class="flex flex-col gap-2 justify-center items-center w-full"
      >
        <h1 class="font-semibold text-lg">Belum Ada Dokumentasi</h1>
        <IconsImageEmpty />
        <WidgetsButtonBaseButton
          @click="
            navigateTo(
              `/admin/profil/mitra/dokumentasi/tambah-dokumentasi/${id}`
            )
          "
          class="flex mt-2 gap-1 items-center"
          size="sm"
        >
          <IconsPlus />
          Tambahkan Dokumentasi
        </WidgetsButtonBaseButton>
      </div>
    </div>
  </div>

  <WidgetsPopupToast
    v-if="showToast"
    label="Berhasil menghapus dokumentasi mitra"
    @close="toggleToast"
  />

  <WidgetsPopupAlert
    v-if="showAlert"
    label="Yakin menghapus dokumentasi mitra?"
    @close="toggleAlert"
    @confirm="handleHapus"
  />

  <WidgetsPopupModal
    v-if="showModal"
    @close="toggleModal"
    title="Input Dokumentasi Mitra"
    :show-action="false"
  >
  </WidgetsPopupModal>
</template>

<script setup lang="ts">
import type { TEachMitraType } from "~/store/mitra";

const route = useRoute();
const { id } = route.params;

const axios = useAxios();

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

const showModal = ref(false);
const showToast = ref(false);
const showAlert = ref(false);

const pilihDokumentasi = ref(false);

const dokumentasiDipilih = ref<string[]>([]);

function toggleSelectDokumentasi(narasi_keterangan: string) {
  const index = dokumentasiDipilih.value.indexOf(narasi_keterangan);

  if (index !== -1) {
    dokumentasiDipilih.value = dokumentasiDipilih.value.filter(
      (value) => value !== narasi_keterangan
    );
  } else {
    dokumentasiDipilih.value.push(narasi_keterangan);
  }
}

function togglePilihDokumentasi() {
  dokumentasiDipilih.value = [];
  pilihDokumentasi.value = !pilihDokumentasi.value;
}

function toggleToast() {
  showToast.value = !showToast.value;
}

function toggleAlert() {
  showAlert.value = !showAlert.value;
}

function toggleModal() {
  showModal.value = !showModal.value;
}

const { data, pending, error, refresh } = await useMyFetch<TEachMitraType>(
  `/api/mitra/${id}`,
  {
    lazy: true,
  }
);

async function handleHapus() {
  const stringifyDipilih = JSON.stringify(dokumentasiDipilih.value);

  const deleteRequest = await axios.patch(
    `/api/mitra/hapus-dokumentasi/${id}`,
    {
      dokumentasiDipilih: stringifyDipilih,
    }
  );

  if (deleteRequest.data.success) {
    toggleAlert();
    toggleToast();
    refresh();
  }
}
</script>
