<template>
  <div class="text-white">
    <WidgetsTambahBackButton
      link="/profil/edit-kakomlek-dan-wakakomlekdam"
      kembali-to="/admin/profil/pimpinan"
    />

    <WidgetsJudulSection
      text="Form Edit Data Kakomlekdam dan Wakakomlekdam XIV/Hsn"
      class="mt-4"
    />

    <div v-if="loading" class="px-7 py-6 bg-[#30394a]">
      <h1>Loading ...</h1>
    </div>

    <div v-else class="px-7 grid gap-7 grid-cols-3 py-6 bg-[#30394a]">
      <div class="flex justify-center bg-[#1d242e] items-center">
        <img
          :src="`${baseURL}/profil/${data?.pasfoto}`"
          class="max-w-52"
          alt=""
        />
      </div>

      <div class="flex flex-col gap-5 col-span-2">
        <WidgetsDataInputBaseInput
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap beserta gelar"
          v-model="nama"
          variant="outline"
        />

        <WidgetsDataInputBaseSelect
          label="Jabatan"
          :options="jabatanOptions"
          v-model="jabatanKepala"
          variant="underline"
        />
      </div>

      <div class="flex justify-center gap-4 col-span-3">
        <input
          type="file"
          class="hidden"
          ref="fileInputPasfoto"
          @change="handleFileChange"
        />
        <WidgetsButtonBaseButton
          type="button"
          @click="handleClickGanti"
          variant="outline"
        >
          Ganti Pasfoto
        </WidgetsButtonBaseButton>

        <WidgetsButtonBaseButton @click="handleSubmit" type="submit">
          Edit Data
        </WidgetsButtonBaseButton>
      </div>
    </div>

    <WidgetsPopupAlert
      v-if="showAlert"
      label="Anda Yakin Mengubah Pasfoto?"
      @close="toggleAlert"
      @confirm="handleGantiPasfoto"
    />
  </div>

  <WidgetsPopupToast
    v-if="showToast"
    :label="toastLabel"
    @close="toggleToast"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "tambah",
});

type Kepala = {
  nama: string;
  pasfoto: string;
  jabatan: string;
};

const fileInputPasfoto = ref<HTMLInputElement | null>();

const showAlert = ref(false);
const showToast = ref(false);
const toastLabel = ref("");

const route = useRoute();
const { jabatan } = route.params;

const {
  data,
  refresh: refreshData,
  pending: loading,
} = await useMyFetch<Kepala>(`/api/pejabat/pimpinan/${jabatan}`, {
  lazy: true,
});

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

const pasfoto = ref<File | undefined>();
const nama = ref();
const jabatanKepala = ref(jabatan as string);

const axios = useAxios();

const jabatanOptions = [
  { label: "Kakomlekdam", value: "kakomlekdam" },
  { label: "Wakakomlekdam", value: "wakakomlekdam" },
];

function toggleToast() {
  showToast.value = !showToast.value;
}

function toggleAlert() {
  showAlert.value = !showAlert.value;
}

function handleClickGanti() {
  if (fileInputPasfoto.value) {
    fileInputPasfoto.value.click();
  }
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    pasfoto.value = file;

    toggleAlert();
  }
}

async function handleGantiPasfoto() {
  const payload = new FormData();

  if (pasfoto.value) {
    payload.append("pasfoto", pasfoto.value);
  }

  const postRequest = await axios.postForm(
    `/api/pejabat/pimpinan/ganti-pasfoto/${jabatan}`,
    payload
  );

  if (postRequest.data.success) {
    toastLabel.value = postRequest.data.message;

    window.location.reload();

    toggleAlert();
    toggleToast();
  }
}

async function handleSubmit() {
  const payload = new FormData();

  payload.append("nama", nama.value);

  const putRequest = await axios.patch(
    `/api/pejabat/pimpinan/${jabatan}`,
    payload
  );

  if (putRequest.data.success) {
    refreshData();
    toggleToast();
    toastLabel.value = putRequest.data.message;
  }
}

onMounted(() => {
  if (data.value) {
    nama.value = data.value.nama;
  }
});
</script>
