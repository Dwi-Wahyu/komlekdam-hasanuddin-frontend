<template>
  <WidgetsTambahBackButton
    link="/berita/edit-berita"
    kembali-to="/admin/berita"
    class="text-white"
  />

  <WidgetsJudulSection text="Form Edit Berita" />

  <div class="w-full bg-[#303949] text-white">
    <div v-if="pending">
      <h1>Loading . . .</h1>
    </div>
    <div v-else-if="error">
      {{ error }}
    </div>
    <form
      v-else-if="data"
      @submit="onSubmit"
      class="p-5 bg-[#303949] w-full h-full"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <WidgetsDataInputBaseFileInput
          v-model="thumbnail"
          :error="errors.thumbnail"
          :default-file="defaultThumbnailUrl"
        />
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
        <WidgetsEditorQuill
          @editor-content="onChangeEditor"
          :model-value="detail"
        />
        <WidgetsErrorInput :error="errors.detail" />
      </div>

      <div class="mt-5 flex justify-center gap-5">
        <WidgetsButtonBaseButton
          variant="outline"
          type="submit"
          class="border-yellow text-yellow"
        >
          Update Berita
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

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

const route = useRoute();
const { id } = route.params;

function toggleToast() {
  showToast.value = !showToast.value;
}

const { defineField, errors, handleSubmit, resetForm } =
  useForm<TInputBeritaSchema>({
    validationSchema: inputBeritaSchema,
  });

const kategoriOptions = [
  { label: "Artikel", value: "artikel" },
  { label: "Internal", value: "internal" },
  { label: "Eksternal", value: "eksternal" },
];

const [judul, judulAttrs] = defineField("judul");
const [penulis, penulisAttrs] = defineField("penulis");
const [lokasi, lokasiAttrs] = defineField("lokasi");
const [deskripsi, deskripsiAttrs] = defineField("deskripsi");
const [tanggal, tanggalAttrs] = defineField("tanggal");
const [kategori, kategoriAttrs] = defineField("kategori");
const [detail, detailAttrs] = defineField("detail");
const [thumbnail, thumbnailAttrs] = defineField("thumbnail");

const defaultThumbnailUrl = ref("");

type TBerita = {
  id: string;
  judul: string;
  penulis: string;
  lokasi: string;
  deskripsi: string;
  tanggal: string;
  kategori: string;
  detail: string;
  thumbnailPath: string;
  dipublish_oleh_id: string;
  last_updated_by_username: string;
};

const { data, refresh, pending, error } = await useMyFetch<TBerita>(
  `/api/berita/${id}`,
  {
    lazy: true,
    onResponse: ({ response }) => {
      if (response._data) {
        judul.value = response._data.judul;
        penulis.value = response._data.penulis;
        lokasi.value = response._data.lokasi;
        deskripsi.value = response._data.deskripsi;
        tanggal.value = response._data.tanggal;
        kategori.value = response._data.kategori;
        detail.value = response._data.detail;

        defaultThumbnailUrl.value = `${baseURL}/berita/thumbnail/${response._data.thumbnailPath}`;
      }
    },
  }
);

function onChangeEditor(content: string) {
  detail.value = content;
}

const onSubmit = handleSubmit(async (payload: TInputBeritaSchema) => {
  const formData = new FormData();

  const updated_by_username = authStore.user?.username;

  formData.append("judul", payload.judul);
  formData.append("penulis", payload.penulis);
  formData.append("lokasi", payload.lokasi);
  formData.append("deskripsi", payload.deskripsi);
  formData.append("tanggal", payload.tanggal);
  formData.append("kategori", payload.kategori);
  formData.append("publisher_id", data.value?.dipublish_oleh_id as string);
  formData.append("updated_by_username", updated_by_username as string);
  formData.append("detail", payload.detail);
  formData.append("thumbnail", payload.thumbnail);

  const createRequest = await axios.patchForm(`/api/berita/${id}`, formData);

  if (createRequest.data.success) {
    toastLabel.value = createRequest.data.message;
    toggleToast();
    refresh();
  }
});
</script>
