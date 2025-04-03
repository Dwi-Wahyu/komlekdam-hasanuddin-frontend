<template>
  <WidgetsTambahBackButton
    link="/kegiatan/tambah-kegiatan"
    kembali-to="/admin/kegiatan"
    class="text-white"
  />

  <WidgetsJudulSection text="Form Tambah Kegiatan" />

  <div class="w-full bg-[#303949] text-white">
    <form @submit="onSubmit" class="p-5 bg-[#303949] w-full h-full">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <WidgetsDataInputBaseFileInput
          v-model="thumbnail"
          label="Upload Thumbnail Kegiatan"
          :error="errors.thumbnail"
        />
        <WidgetsDataInputBaseFileInput
          v-model="video"
          label="Upload Video Kegiatan"
          fileType="video"
          :error="errors.video"
        />
        <div class="flex flex-col gap-4 text-yellow">
          <div>
            <WidgetsDataInputBaseInput
              v-model="judul"
              placeholder="Ketik judul"
              label="Judul Kegiatan"
              variant="outline"
              :bind-attr="judulAttrs"
            />
            <WidgetsErrorInput :error="errors.judul" />
          </div>

          <div>
            <WidgetsDataInputBaseTextArea
              label="Deskripsi Singkat"
              placeholder="Masukkan Deskripsi Singkat Kegiatan"
              v-model="deskripsi"
              variant="outline"
              height="h-28"
              :bind-attr="deskripsiAttrs"
            />
            <WidgetsErrorInput :error="errors.deskripsi" />
          </div>

          <div>
            <WidgetsDataInputBaseInput
              label="Tanggal Kegiatan"
              placeholder="Masukkan Tanggal Kegiatan"
              v-model="tanggal"
              type="date"
              variant="outline"
              :bind-attr="tanggalAttrs"
            />
            <WidgetsErrorInput :error="errors.tanggal" />
          </div>

          <div>
            <WidgetsDataInputBaseSelect
              label="Kategori Kegiatan"
              placeholder="Pilih Kategori Kegiatan"
              variant="underline"
              :options="kategoriOptions"
              v-model="kategori"
            />
          </div>
        </div>
        <div>
          <h1 class="text-yellow font-semibold mb-2">Detail</h1>
          <WidgetsEditorQuill @editor-content="onChangeEditor" />
          <WidgetsErrorInput :error="errors.detail" />
        </div>
      </div>

      <div class="mt-5">
        <h1 class="text-yellow font-semibold mb-2">Dokumentasi</h1>
        <WidgetsDataInputBaseFileInput
          v-model="dokumentasi"
          label="Tambahkan Dokumentasi"
          :multiple="true"
        />
        <WidgetsErrorInput class="mt-4" :error="errors.dokumentasi" />
      </div>

      <div class="mt-5 flex justify-center gap-5">
        <WidgetsButtonBaseButton
          variant="outline"
          type="submit"
          class="border-yellow text-yellow"
        >
          <IconsLoader v-if="loading" class="mr-1" />
          Buat Kegiatan
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
  inputKegiatanSchema,
  type TInputKegiatanSchema,
} from "~/schema/kegiatan/input";

import { useMyAuthStore } from "~/store/auth";

const showToast = ref(false);
const toastLabel = ref("");

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;
const authStore = useMyAuthStore();
const axios = useAxios();

const loading = ref(false);

function toggleToast() {
  showToast.value = !showToast.value;
}

const { defineField, errors, handleSubmit, resetForm } =
  useForm<TInputKegiatanSchema>({
    validationSchema: inputKegiatanSchema,
  });

const kategoriOptions = [
  { label: "Program", value: "program" },
  { label: "Non Program", value: "non-program" },
];

const [judul, judulAttrs] = defineField("judul");
const [deskripsi, deskripsiAttrs] = defineField("deskripsi");
const [tanggal, tanggalAttrs] = defineField("tanggal");
const [kategori, kategoriAttrs] = defineField("kategori");
const [detail, detailAttrs] = defineField("detail");
const [thumbnail, thumbnailAttrs] = defineField("thumbnail");
const [video, videoAttrs] = defineField("video");
const [dokumentasi, dokumentasiAttrs] = defineField("dokumentasi");

function onChangeEditor(content: string) {
  detail.value = content;
}

const onSubmit = handleSubmit(async (payload: TInputKegiatanSchema) => {
  loading.value = true;
  const formData = new FormData();
  formData.append("judul", payload.judul);
  formData.append("deskripsi", payload.deskripsi);
  formData.append("tanggal", payload.tanggal);
  formData.append("kategori", payload.kategori);
  formData.append("detail", payload.detail);

  formData.append("thumbnail", payload.thumbnail);
  formData.append("video", payload.video);

  for (const each of payload.dokumentasi) {
    formData.append("dokumentasi", each);
  }

  const createRequest = await axios.postForm("/api/kegiatan", formData);

  if (createRequest.data.success) {
    toastLabel.value = "Berhasil membuat kegiatan";
    toggleToast();
    resetForm();
    loading.value = false;
  }
});
</script>
