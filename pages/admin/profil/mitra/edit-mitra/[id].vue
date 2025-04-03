<template>
  <div class="text-white">
    <WidgetsTambahBackButton
      link="/admin/profil/edit-mitra"
      kembali-to="/admin/profil/mitra"
    />

    <WidgetsJudulSection text="Form Edit Data Mitra" class="mt-4" />

    <div v-if="pending">
      <h1>Loading . . .</h1>
    </div>
    <div v-else-if="error">
      {{ error }}
    </div>
    <form
      v-else-if="data"
      @submit="onSubmit"
      class="px-7 grid gap-7 grid-cols-2 py-6 bg-[#30394a]"
    >
      <div>
        <h1 class="mb-1 text-yellow font-semibold">Logo Mitra</h1>
        <div class="flex justify-center py-3 bg-[#1d242e] items-center">
          <img
            :src="`${baseURL}/profil/mitra/logo/${data?.logoPath}`"
            class="max-w-96"
            alt=""
          />
        </div>
      </div>

      <div class="flex flex-col gap-5">
        <div>
          <WidgetsDataInputBaseInput
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap beserta gelar"
            v-model="nama"
            :bind-attr="namaAttrs"
            variant="outline"
          />
          <WidgetsErrorInput :error="errors.nama" />
        </div>
      </div>

      <div class="flex justify-center gap-5 col-span-2">
        <input
          type="file"
          class="hidden"
          ref="fileInputLogo"
          accept="image/*"
          @change="handleFileChange"
        />
        <WidgetsButtonBaseButton type="button" @click="handleClickGanti">
          Ganti Thumbnail
        </WidgetsButtonBaseButton>
        <WidgetsButtonBaseButton type="submit" variant="outline">
          Edit Data
        </WidgetsButtonBaseButton>
      </div>
    </form>
  </div>

  <WidgetsPopupToast
    v-if="showToast"
    :label="toastLabel"
    @close="toggleToast"
  />

  <WidgetsPopupAlert
    v-if="showAlert"
    label="Yakin Mengganti Logo Mitra  ?"
    @close="toggleAlert"
    @confirm="handleGantiLogo"
  />
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";

import {
  updateMitraSchema,
  type TUpdateMitraSchema,
} from "~/schema/mitra/update";
import { type TEachMitraType } from "~/store/mitra";

definePageMeta({
  layout: "tambah",
});

const showToast = ref(false);
const showAlert = ref(false);
const toastLabel = ref("");

function toggleToast() {
  showToast.value = !showToast.value;
}

function toggleAlert() {
  showAlert.value = !showAlert.value;
}

const axios = useAxios();

const route = useRoute();
const { id } = route.params;

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

const { defineField, errors, handleSubmit, resetForm } =
  useForm<TUpdateMitraSchema>({
    validationSchema: updateMitraSchema,
  });

const [nama, namaAttrs] = defineField("nama");

const { data, pending, error, refresh } = await useMyFetch<TEachMitraType>(
  `/api/mitra/${id}`,
  {
    lazy: true,
    onResponse: ({ response }) => {
      if (response._data) {
        nama.value = response._data.nama;
      }
    },
  }
);

const fileInputLogo = ref<HTMLInputElement | null>();
const logo = ref<File | null>(null);

function handleClickGanti() {
  if (!fileInputLogo.value) {
    return;
  }

  fileInputLogo.value.click();
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    logo.value = file;

    toggleAlert();
  }
}

async function handleGantiLogo() {
  const payload = new FormData();

  if (logo.value) {
    payload.append("logo", logo.value);
  }

  const postRequest = await axios.postForm(
    `/api/mitra/ganti-logo/${id}`,
    payload
  );

  if (postRequest.data.success) {
    toggleAlert();
    refresh();
    toggleToast();
    toastLabel.value = postRequest.data.message;
  }
}

const onSubmit = handleSubmit(async (payload: TUpdateMitraSchema) => {
  const postRequest = await axios.patch(`/api/mitra/${id}`, payload);

  if (postRequest.data.success) {
    toggleToast();
    toastLabel.value = postRequest.data.message;
  }
});
</script>
