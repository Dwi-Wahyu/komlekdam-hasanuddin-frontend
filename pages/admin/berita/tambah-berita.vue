<template>
  <WidgetsTambahBackButton
    link="/berita/tambah-berita"
    kembali-to="/admin/berita"
    class="text-white"
  />

  <WidgetsJudulSection text="Form Tambah Berita" />

  <div class="w-full bg-[#303949] text-white">
    <form @submit="onSubmit" class="p-5 bg-[#303949] w-full h-full">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <WidgetsDataInputBaseFileInput
            v-model="thumbnail"
            :error="errors.thumbnail"
          />
          <WidgetsErrorInput :error="errors.thumbnail" />
        </div>
        <div class="flex flex-col gap-4 text-yellow">
          <div>
            <WidgetsDataInputBaseInput
              v-model="judul"
              placeholder="Masukkan judul berita"
              label="Judul Berita"
              variant="outline"
              :bind-attr="judulAttrs"
            />
            <WidgetsErrorInput :error="errors.judul" />
          </div>

          <div>
            <WidgetsDataInputBaseInput
              v-model="penulis"
              placeholder="Masukkan nama penulis"
              label="Penulis"
              variant="outline"
              :bind-attr="penulisAttrs"
            />
            <WidgetsErrorInput :error="errors.penulis" />
          </div>

          <div>
            <WidgetsDataInputBaseInput
              v-model="lokasi"
              placeholder="Masukkan lokasi penulisan berita"
              label="Lokasi Berita"
              variant="outline"
              :bind-attr="lokasiAttrs"
            />
            <WidgetsErrorInput :error="errors.lokasi" />
          </div>

          <div>
            <WidgetsDataInputBaseTextArea
              label="Deskripsi Singkat"
              placeholder="Masukkan Deskripsi Singkat Berita"
              v-model="deskripsi"
              variant="outline"
              height="h-28"
              :bind-attr="deskripsiAttrs"
            />
            <WidgetsErrorInput :error="errors.deskripsi" />
          </div>

          <div>
            <WidgetsDataInputBaseInput
              label="Tanggal Berita"
              placeholder="Masukkan Tanggal Berita"
              v-model="tanggal"
              type="date"
              variant="outline"
              :bind-attr="tanggalAttrs"
            />
            <WidgetsErrorInput :error="errors.tanggal" />
          </div>

          <div>
            <WidgetsDataInputBaseSelect
              label="Kategori Berita"
              placeholder="Pilih Kategori Berita"
              variant="underline"
              :options="kategoriOptions"
              v-model="kategori"
            />
            <WidgetsErrorInput :error="errors.kategori" />
          </div>
        </div>
      </div>

      <div class="mt-6">
        <h1 class="font-semibold mb-2 text-yellow">Detail</h1>
        <WidgetsEditorQuill @editor-content="onChangeEditor" />

        <WidgetsErrorInput :error="errors.detail" />
      </div>

      <div class="mt-5 flex justify-center gap-5">
        <WidgetsButtonBaseButton
          variant="outline"
          type="submit"
          class="border-yellow text-yellow"
        >
          Buat Berita
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

import { useForm, ErrorMessage } from "vee-validate";
import {
  inputBeritaSchema,
  type TInputBeritaSchema,
} from "~/schema/berita/input";
import { useMyAuthStore } from "~/store/auth";

const showToast = ref(false);
const toastLabel = ref("");

const axios = useAxios();
const authStore = useMyAuthStore();

console.log(authStore.user?.id);

function toggleToast() {
  showToast.value = !showToast.value;
}

const {
  defineField,
  errors,
  handleSubmit,
  setFieldError,
  isFieldValid,
  validateField,
  submitForm,
  isFieldTouched,
  resetForm,
} = useForm<TInputBeritaSchema>({
  validationSchema: inputBeritaSchema,
});

const kategoriOptions = [
  { label: "Artikel", value: "artikel" },
  { label: "Internal", value: "internal" },
  { label: "Eksternal", value: "eksternal" },
  { label: "Zona Integritas", value: "zona-integritas" },
];

const [judul, judulAttrs] = defineField("judul");
const [penulis, penulisAttrs] = defineField("penulis");
const [lokasi, lokasiAttrs] = defineField("lokasi");
const [deskripsi, deskripsiAttrs] = defineField("deskripsi");
const [tanggal, tanggalAttrs] = defineField("tanggal");
const [kategori, kategoriAttrs] = defineField("kategori");
const [detail, detailAttrs] = defineField("detail");
const [thumbnail, thumbnailAttrs] = defineField("thumbnail");

function onChangeEditor(content: string) {
  detail.value = content;
}

const onSubmit = handleSubmit(async (payload: TInputBeritaSchema) => {
  const formData = new FormData();

  const publisher_id = authStore.user?.id.toString();

  formData.append("judul", payload.judul);
  formData.append("penulis", payload.penulis);
  formData.append("lokasi", payload.lokasi);
  formData.append("deskripsi", payload.deskripsi);
  formData.append("tanggal", payload.tanggal);
  formData.append("kategori", payload.kategori);
  formData.append("publisher_id", publisher_id as string);
  formData.append("detail", payload.detail);
  formData.append("thumbnail", payload.thumbnail);

  const createRequest = await axios.postForm("/api/berita", formData);

  if (createRequest.data.success) {
    toastLabel.value = createRequest.data.message;
    toggleToast();
    resetForm();
  }
});
</script>
