<template>
  <div class="flex gap-1 items-center">
    <button @click="navigateTo('/admin/litbang')">
      <IconsChevron width="20" height="20" class="-rotate-90" />
    </button>
    <WidgetsAdminPageTitle title="Dokumentasi Litbang" />
  </div>

  <div class="mt-5 p-5 bg-[#303949] shadow-[7px_7px_0px_0px_rgba(0,0,0,0.2)]">
    <div v-if="pending" class="animate-pulse flex flex-col gap-5">
      <div class="flex gap-3 mb-3">
        <div class="h-10 w-48 bg-gray-700 rounded-lg"></div>
        <div class="h-10 w-40 bg-gray-700 rounded-lg"></div>
      </div>

      <div class="grid grid-cols-2 gap-5">
        <div
          v-for="i in 4"
          :key="i"
          class="h-64 bg-gray-700 rounded-lg w-full border border-gray-600"
        ></div>
      </div>
    </div>
    <div v-else-if="error">
      <h1>{{ error }}</h1>
    </div>

    <div v-else>
      <div v-if="data?.dokumentasi.length">
        <div class="mb-3 flex items-center gap-3">
          <WidgetsButtonBaseButton
            @click="toggleModal"
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
            class="relative group h-fit"
            v-for="(dokumentasi, dokumentasiIdx) in data.dokumentasi"
            :class="pilihDokumentasi ? 'shadow-lg' : ''"
            :key="dokumentasiIdx"
          >
            <div
              v-if="pilihDokumentasi"
              class="w-full bottom-0 h-36 px-5 py-4 flex flex-col justify-end absolute"
            >
              <div class="flex items-center justify-between">
                <div></div>

                <div class="bg-black p-4 rounded-lg">
                  <WidgetsDataInputBaseCheckbox
                    @click="toggleSelectDokumentasi(dokumentasi.path)"
                  />
                </div>
              </div>
            </div>

            <img
              :src="`${baseURL}/litbang/dokumentasi/${dokumentasi.path}`"
              alt=""
              class="w-full h-auto rounded-lg"
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
          @click="toggleModal"
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
    :label="toastLabel"
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
    title="Input Dokumentasi"
    :show-action="false"
  >
    <form @submit="onSubmit" class="flex flex-col items-center">
      <WidgetsDataInputBaseFileInput
        v-model="gambar"
        label="Gambar Dokumentasi"
      />
      <WidgetsButtonBaseButton type="submit" class="mt-6 w-fit">
        Submit
      </WidgetsButtonBaseButton>
    </form>
  </WidgetsPopupModal>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import {
  inputDokumentasiProgramSchema,
  type TInputDokumentasiProgramSchema,
} from "~/schema/program/input-dokumentasi";
import type { TEachLitbangType } from "~/store/litbang";

const route = useRoute();
const { id } = route.params;

const axios = useAxios();

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

const showModal = ref(false);
const showToast = ref(false);
const showAlert = ref(false);

const toastLabel = ref("");

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

const { data, pending, error, refresh } = await useMyFetch<TEachLitbangType>(
  `/api/litbang/${id}`,
  {
    lazy: true,
  }
);

const { defineField, errors, handleSubmit } =
  useForm<TInputDokumentasiProgramSchema>({
    validationSchema: inputDokumentasiProgramSchema,
  });

const [gambar, gambarAttr] = defineField("gambar");

const onSubmit = handleSubmit(
  async (payload: TInputDokumentasiProgramSchema) => {
    const formData = new FormData();
    formData.append("gambar", payload.gambar);

    const createRequest = await axios.postForm(
      `/api/litbang/dokumentasi/${id}`,
      formData
    );

    if (createRequest.data.success) {
      toastLabel.value = createRequest.data.message;
      toggleModal();
      toggleToast();
      refresh();
    }
  }
);

async function handleHapus() {
  const stringifyDipilih = JSON.stringify(dokumentasiDipilih.value);

  const deleteRequest = await axios.patch(`/api/litbang/hapus-dokumentasi`, {
    dokumentasiDipilih: stringifyDipilih,
  });

  if (deleteRequest.data.success) {
    toastLabel.value = deleteRequest.data.message;
    toggleAlert();
    toggleToast();
    refresh();
  }
}
</script>
