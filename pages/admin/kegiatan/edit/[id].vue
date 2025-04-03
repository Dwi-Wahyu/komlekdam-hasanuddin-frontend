<template>
  <WidgetsTambahBackButton
    link="/kegiatan/edit-kegiatan"
    kembali-to="/admin/kegiatan"
    class="text-white"
  />

  <WidgetsJudulSection text="Form Edit Kegiatan" />

  <div class="w-full bg-[#303949] text-white">
    <div v-if="loading">
      <h1>Loading ...</h1>
    </div>
    <div v-else-if="error">
      {{ error }}
    </div>
    <form
      v-else-if="data"
      @submit="onSubmit"
      class="p-5 bg-[#303949] w-full h-full"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h1 class="mb-1 text-yellow font-semibold">Thumbnail Kegiatan</h1>
          <div class="flex justify-center py-3 bg-[#1d242e] items-center">
            <img
              :src="`${baseURL}/kegiatan/${data?.kategori}/thumbnail/${data?.thumbnailPath}`"
              class="max-w-96"
              alt=""
            />
          </div>
        </div>
        <div>
          <h1 class="mb-1 text-yellow font-semibold">Video Kegiatan</h1>
          <div class="flex justify-center py-3 bg-[#1d242e] items-center">
            <video controls preload="none" class="w-full sm:w-[30vw]">
              <source
                :src="`${baseURL}/kegiatan/${data.kategori}/video/${data.videoPath}`"
              />
              Browser tidak mendukung pemutaran video.
            </video>
          </div>
        </div>
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
        </div>
        <div>
          <h1 class="text-yellow font-semibold mb-2">Detail</h1>
          <WidgetsEditorQuill
            @editor-content="onChangeEditor"
            :model-value="detail"
          />
          <WidgetsErrorInput :error="errors.detail" />
        </div>
      </div>

      <div class="mt-5 flex justify-center gap-5">
        <input
          type="file"
          class="hidden"
          ref="fileInputThumbnail"
          accept="image/*"
          @change="handleFileChangeThumbnail"
        />
        <input
          type="file"
          class="hidden"
          ref="fileInputVideo"
          accept="video/*"
          @change="handleFileChangeVideo"
        />
        <WidgetsButtonBaseButton
          type="button"
          @click="handleClickGanti('thumbnail')"
        >
          Ganti Thumbnail
        </WidgetsButtonBaseButton>
        <WidgetsButtonBaseButton
          type="button"
          variant="secondary"
          @click="handleClickGanti('video')"
        >
          Ganti Video
        </WidgetsButtonBaseButton>
        <WidgetsButtonBaseButton
          variant="outline"
          type="submit"
          class="border-yellow text-yellow"
        >
          Edit Kegiatan
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
    v-if="showAlertThumbnail"
    @close="showAlertThumbnail = false"
    @confirm="handleGantiThumbnail"
    label="Yakin ganti thumbnail kegiatan?"
  />

  <WidgetsPopupAlert
    v-if="showAlertVideo"
    @close="showAlertVideo = false"
    @confirm="handleGantiVideo"
    label="Yakin ganti video kegiatan?"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "tambah",
  middleware: "auth",
});

import { useForm } from "vee-validate";
import {
  updateKegiatanSchema,
  type TUpdateKegiatanSchema,
} from "~/schema/kegiatan/update";

const showToast = ref(false);
const showAlertThumbnail = ref(false);
const showAlertVideo = ref(false);
const toastLabel = ref("");

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

const axios = useAxios();

const route = useRoute();
const { id } = route.params;

type Program = {
  thumbnailPath: string;
  videoPath: string;
  kategori: string;
  judul: string;
  deskripsi: string;
  detail: string;
  tanggal: string;
};

const fileInputThumbnail = ref<HTMLInputElement | null>();
const fileInputVideo = ref<HTMLInputElement | null>();
const thumbnail = ref<File | null>(null);
const video = ref<File | null>(null);

function toggleAlert() {
  showAlertThumbnail.value = !showAlertThumbnail.value;
}

function toggleToast() {
  showToast.value = !showToast.value;
}

function handleClickGanti(type: string) {
  if (!fileInputThumbnail.value || !fileInputVideo.value) {
    return;
  }

  if (type === "thumbnail") {
    fileInputThumbnail.value.click();
  } else {
    fileInputVideo.value.click();
  }
}

function handleFileChangeThumbnail(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    thumbnail.value = file;

    showAlertThumbnail.value = true;
  }
}

function handleFileChangeVideo(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    video.value = file;

    showAlertVideo.value = true;
  }
}

const { defineField, errors, handleSubmit } = useForm<TUpdateKegiatanSchema>({
  validationSchema: updateKegiatanSchema,
});

const [judul, judulAttrs] = defineField("judul");
const [deskripsi, deskripsiAttrs] = defineField("deskripsi");
const [tanggal, tanggalAttrs] = defineField("tanggal");
const [kategori, kategoriAttrs] = defineField("kategori");
const [detail, detailAttrs] = defineField("detail");

const {
  data,
  pending: loading,
  refresh: refreshData,
  error,
} = await useMyFetch<Program>(`/api/kegiatan/${id}`, {
  lazy: true,
  onResponse: ({ response }) => {
    if (response._data) {
      judul.value = response._data.judul;
      deskripsi.value = response._data.deskripsi;
      tanggal.value = response._data.tanggal;
      kategori.value = response._data.kategori;
      detail.value = response._data.detail;
    }
  },
});

function onChangeEditor(content: string) {
  detail.value = content;
}

async function handleGantiThumbnail() {
  const payload = new FormData();

  if (thumbnail.value) {
    payload.append("thumbnail", thumbnail.value);
  }
  payload.append("kategori", kategori.value);

  const postRequest = await axios.postForm(
    `/api/kegiatan/ganti-thumbnail/${id}`,
    payload
  );

  if (postRequest.data.success) {
    showAlertThumbnail.value = false;
    refreshData();
    toggleToast();
    toastLabel.value = postRequest.data.message;
  }
}

async function handleGantiVideo() {
  const payload = new FormData();

  if (video.value) {
    payload.append("video", video.value);
  }
  payload.append("kategori", kategori.value);

  const postRequest = await axios.postForm(
    `/api/kegiatan/ganti-video/${id}`,
    payload
  );

  if (postRequest.data.success) {
    showAlertVideo.value = false;
    refreshData();
    toggleToast();
    toastLabel.value = postRequest.data.message;
  }
}

const onSubmit = handleSubmit(async (payload: TUpdateKegiatanSchema) => {
  const createRequest = await axios.patch(`/api/kegiatan/${id}`, payload);

  if (createRequest.data.success) {
    toastLabel.value = createRequest.data.message;
    toggleToast();
  }
});
</script>
