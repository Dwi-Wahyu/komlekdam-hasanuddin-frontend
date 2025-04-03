<template>
  <WidgetsTambahBackButton
    link="/mitra/tambah-dokumentasi"
    :kembali-to="`/admin/profil/mitra/dokumentasi/${id}`"
    class="text-white"
  />

  <div v-if="pending">
    <h1>Loading . . .</h1>
  </div>
  <div v-else-if="error">
    {{ error }}
  </div>
  <WidgetsJudulSection v-else :text="`Form Tambah Dokumentasi ${data?.nama}`" />

  <div class="w-full bg-[#303949] text-white">
    <form @submit="onSubmit" class="flex flex-col px-7 py-6 gap-4">
      <div>
        <WidgetsDataInputBaseInput
          v-model="judul_keterangan"
          label="Judul Keterangan"
          variant="outline"
        />

        <WidgetsErrorInput :error="errors.judul_keterangan" />
      </div>
      <div>
        <WidgetsDataInputBaseInput
          v-model="narasi_keterangan"
          label="Narasi Keterangan"
          variant="outline"
        />

        <WidgetsErrorInput :error="errors.narasi_keterangan" />
      </div>
      <div>
        <WidgetsDataInputBaseFileInput v-model="gambar" label="Pilih Gambar" />

        <WidgetsErrorInput :error="errors.gambar" class="mt-3" />
      </div>

      <div class="flex justify-center">
        <WidgetsButtonBaseButton variant="outline" type="submit" class="mt-3">
          Submit
        </WidgetsButtonBaseButton>
      </div>
    </form>
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
  middleware: "auth",
});

import { useForm } from "vee-validate";
import {
  inputDokumentasiMitraSchema,
  type TInputDokumentasiMitraSchema,
} from "~/schema/mitra/input-dokumentasi";
import type { TEachMitraType } from "~/store/mitra";

const showToast = ref(false);
const toastLabel = ref("");

const axios = useAxios();

const route = useRoute();
const { id } = route.params;

function toggleToast() {
  showToast.value = !showToast.value;
}

const { data, pending, error } = await useMyFetch<TEachMitraType>(
  `/api/mitra/${id}`,
  {
    lazy: true,
  }
);

const { defineField, errors, validate, isFieldValid, resetForm, handleSubmit } =
  useForm<TInputDokumentasiMitraSchema>({
    validationSchema: inputDokumentasiMitraSchema,
  });

const [judul_keterangan, judul_keteranganAttrs] =
  defineField("judul_keterangan");
const [narasi_keterangan, narasi_keteranganAttrs] =
  defineField("narasi_keterangan");
const [gambar, gambarAttrs] = defineField("gambar");

const onSubmit = handleSubmit(async (payload: TInputDokumentasiMitraSchema) => {
  const formData = new FormData();

  formData.append("judul_keterangan", payload.judul_keterangan);
  formData.append("narasi_keterangan", payload.narasi_keterangan);
  formData.append("gambar", payload.gambar);

  const postRequest = await axios.postForm(
    `/api/mitra/dokumentasi/${id}`,
    formData
  );

  if (postRequest.data.success) {
    toggleToast();
    toastLabel.value = postRequest.data.message;
    resetForm();
  }
});
</script>
