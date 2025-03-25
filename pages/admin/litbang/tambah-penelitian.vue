<template>
  <WidgetsTambahBackButton
    link="/litbang/tambah-penelitian"
    kembali-to="/admin/litbang"
    class="text-white"
  />

  <WidgetsJudulSection text="Form Tambah Program" />

  <div class="w-full bg-[#303949] text-white">
    <form @submit="onSubmit" class="p-5 bg-[#303949] w-full h-full">
      <div class="grid grid-cols-1 gap-5">
        <div class="flex gap-5">
          <WidgetsDataInputBaseFileInput
            v-model="thumbnail"
            label="Upload Thumbnail Penelitian"
            min-height="min-h-52"
            :error="errors.thumbnail"
          />
          <WidgetsDataInputBaseFileInput
            v-model="video"
            label="Upload Video Penelitian"
            file-type="video"
            min-height="min-h-52"
            :error="errors.video"
          />
        </div>
        <div class="flex flex-col gap-4 text-yellow">
          <div>
            <WidgetsDataInputBaseInput
              v-model="judul"
              placeholder="Ketik judul"
              label="Judul Penelitian"
              variant="outline"
              :bind-attr="judulAttrs"
            />
            <WidgetsErrorInput :error="errors.judul" />
          </div>

          <div>
            <WidgetsDataInputBaseInput
              label="Tanggal Penelitian"
              placeholder="Masukkan Tanggal Penelitian"
              v-model="tanggal"
              type="date"
              variant="outline"
              :bind-attr="tanggalAttrs"
            />
            <WidgetsErrorInput :error="errors.tanggal" />
          </div>

          <div>
            <WidgetsDataInputBaseInput
              label="Penulis"
              placeholder="Masukkan Penulis"
              v-model="penulis"
              variant="outline"
              :bind-attr="penulisAttrs"
            />
            <WidgetsErrorInput :error="errors.penulis" />
          </div>

          <div>
            <WidgetsDataInputBaseTextArea
              label="Deskripsi Singkat"
              placeholder="Masukkan Deskripsi Singkat Program"
              v-model="deskripsi"
              variant="outline"
              height="h-28"
              :bind-attr="deskripsiAttrs"
            />
            <WidgetsErrorInput :error="errors.deskripsi" />
          </div>
        </div>
      </div>

      <div class="mt-5">
        <h1 class="text-yellow font-semibold mb-2">Detail</h1>
        <WidgetsEditorQuill @editor-content="onChangeEditor" />
        <WidgetsErrorInput :error="errors.detail" />
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
          class="border-yellow text-yellow flex gap-1"
        >
          <IconsLoader v-if="loading" />
          Buat Penelitian
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
  inputPenelitianSchema,
  type TInputPenelitianSchema,
} from "~/schema/litbang/input";

import { useMyAuthStore } from "~/store/auth";

const showToast = ref(false);
const toastLabel = ref("");

const runtimeConfig = useRuntimeConfig();
const axios = useAxios();

function toggleToast() {
  showToast.value = !showToast.value;
}

const { defineField, errors, handleSubmit, resetForm } =
  useForm<TInputPenelitianSchema>({
    validationSchema: inputPenelitianSchema,
  });

const loading = ref(false);

const kategoriOptions = [
  { label: "Program", value: "program" },
  { label: "Non Program", value: "non-program" },
];

const [judul, judulAttrs] = defineField("judul");
const [penulis, penulisAttrs] = defineField("penulis");
const [thumbnail, thumbnailAttrs] = defineField("thumbnail");
const [video, videoAttrs] = defineField("video");
const [deskripsi, deskripsiAttrs] = defineField("deskripsi");
const [tanggal, tanggalAttrs] = defineField("tanggal");
const [detail, detailAttrs] = defineField("detail");
const [dokumentasi, dokumentasiAttrs] = defineField("dokumentasi");

function onChangeEditor(content: string) {
  detail.value = content;
}

const onSubmit = handleSubmit(async (payload: TInputPenelitianSchema) => {
  loading.value = true;

  const formData = new FormData();
  formData.append("judul", payload.judul);
  formData.append("penulis", payload.penulis);
  formData.append("deskripsi", payload.deskripsi);
  formData.append("tanggal", payload.tanggal);
  formData.append("detail", payload.detail);

  if (payload.video) {
    formData.append("video", payload.video);
  }

  if (payload.thumbnail) {
    formData.append("thumbnail", payload.thumbnail);
  }

  if (payload.dokumentasi) {
    for (const each of payload.dokumentasi) {
      formData.append("dokumentasi", each);
    }
  }

  const createRequest = await axios.postForm("/api/litbang", formData);

  if (createRequest.data.success) {
    loading.value = false;
    toastLabel.value = createRequest.data.message;
    toggleToast();
    resetForm();
  }
});
</script>
