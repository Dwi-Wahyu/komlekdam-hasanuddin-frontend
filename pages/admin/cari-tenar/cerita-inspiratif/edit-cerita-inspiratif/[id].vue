<template>
  <div class="text-white">
    <WidgetsTambahBackButton
      link="/cari-tenar/tambah-cerita-inspiratif"
      kembali-to="/admin/cari-tenar/cerita-inspiratif"
    />

    <WidgetsJudulSection text="Edit Cerita Inspiratif" class="mt-4" />

    <div v-if="pending">
      <h1>Loading . . .</h1>
    </div>
    <div v-else-if="error">
      {{ error }}
    </div>
    <form
      v-else-if="data"
      @submit="onSubmit"
      class="px-7 flex flex-col gap-5 py-6 bg-[#30394a]"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h1 class="mb-1 text-yellow font-semibold">
            Thumbnail Cerita Inspiratif
          </h1>
          <div class="flex justify-center py-3 bg-[#1d242e] items-center">
            <img
              :src="`${baseURL}/cerita-inspiratif/thumbnail/${data?.thumbnailPath}`"
              class="max-w-96"
              alt=""
            />
          </div>
        </div>
        <div>
          <h1 class="mb-1 text-yellow font-semibold">
            Video Cerita Inspiratif
          </h1>
          <div class="flex justify-center py-3 bg-[#1d242e] items-center">
            <video controls preload="none" class="w-full sm:w-[30vw]">
              <source
                :src="`${baseURL}/cerita-inspiratif/video/${data.videoPath}`"
              />
              Browser tidak mendukung pemutaran video.
            </video>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-5">
        <div>
          <WidgetsDataInputBaseInput
            label="Judul Cerita"
            placeholder="Masukkan Judul Cerita Inspiratif"
            v-model="judul"
            variant="outline"
          />
          <WidgetsErrorInput :error="errors.judul" />
        </div>
        <div>
          <WidgetsDataInputBaseTextArea
            label="Deskripsi Singkat"
            placeholder="Masukkan Deskripsi Singkat Cerita Inspiratif"
            v-model="deskripsi"
            height="h-32"
            variant="outline"
          />
          <WidgetsErrorInput :error="errors.deskripsi" />
        </div>
      </div>

      <div class="flex justify-center gap-4 col-span-2">
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
          @click="handleClickGanti('video')"
          variant="secondary"
        >
          Ganti Video
        </WidgetsButtonBaseButton>
        <WidgetsButtonBaseButton type="submit" variant="outline">
          Edit Data
        </WidgetsButtonBaseButton>
      </div>
    </form>
  </div>

  <WidgetsPopupAlert
    v-if="showAlertThumbnail"
    label="Anda Yakin Mengubah Thumbnail?"
    @close="toggleAlertThumbnail"
    @confirm="handleGantiThumbnail"
  />

  <WidgetsPopupAlert
    v-if="showAlertVideo"
    label="Anda Yakin Mengubah Video?"
    @close="toggleAlertVideo"
    @confirm="handleGantiVideo"
  />

  <WidgetsPopupToast
    v-if="showToast"
    :label="toastLabel"
    @close="toggleToast"
  />
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import {
  updateCeritaInspiratifSchema,
  type TUpdateCeritaInspiratifSchema,
} from "~/schema/cerita-inspiratif/update";

definePageMeta({
  layout: "tambah",
});

const showAlertThumbnail = ref(false);
const showAlertVideo = ref(false);
const showToast = ref(false);
const toastLabel = ref("");

function toggleAlertThumbnail() {
  showAlertThumbnail.value = !showAlertThumbnail.value;
}

function toggleAlertVideo() {
  showAlertVideo.value = !showAlertVideo.value;
}

function toggleToast() {
  showToast.value = !showToast.value;
}

const { defineField, errors, handleSubmit } =
  useForm<TUpdateCeritaInspiratifSchema>({
    validationSchema: updateCeritaInspiratifSchema,
  });

const [judul, judulAttrs] = defineField("judul");
const [deskripsi, deskripsiAttrs] = defineField("deskripsi");

const thumbnail = ref<File | undefined>();
const video = ref<File | undefined>();

const fileInputThumbnail = ref<HTMLInputElement | null>();
const fileInputVideo = ref<HTMLInputElement | null>();

const axios = useAxios();
const route = useRoute();
const { id } = route.params;

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

type TCeritaInspiratif = {
  judul: string;
  deskripsi: string;
  thumbnailPath: string;
  videoPath: string;
};

const { data, pending, error, refresh } = await useMyFetch<TCeritaInspiratif>(
  `/api/cerita-inspiratif/${id}`,
  {
    lazy: true,
    onResponse: ({ response }) => {
      if (response._data) {
        judul.value = response._data.judul;
        deskripsi.value = response._data.deskripsi;
      }
    },
  }
);

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

    toggleAlertThumbnail();
  }
}

function handleFileChangeVideo(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    video.value = file;

    toggleAlertVideo();
  }
}

async function handleGantiThumbnail() {
  const payload = new FormData();

  if (thumbnail.value) {
    payload.append("thumbnail", thumbnail.value);
  }

  const postRequest = await axios.postForm(
    `/api/cerita-inspiratif/ganti-thumbnail/${id}`,
    payload
  );

  if (postRequest.data.success) {
    toggleAlertThumbnail();
    refresh();
    toastLabel.value = postRequest.data.message;
    toggleToast();
  }
}

async function handleGantiVideo() {
  const payload = new FormData();

  if (video.value) {
    payload.append("video", video.value);
  }

  const postRequest = await axios.postForm(
    `/api/cerita-inspiratif/ganti-video/${id}`,
    payload
  );

  if (postRequest.data.success) {
    toggleAlertVideo();
    refresh();
    toastLabel.value = postRequest.data.message;
    toggleToast();
  }
}

const onSubmit = handleSubmit(
  async (payload: TUpdateCeritaInspiratifSchema) => {
    const formData = new FormData();

    formData.append("judul", payload.judul);
    formData.append("deskripsi", payload.deskripsi);

    const postRequest = await axios.patch(
      `/api/cerita-inspiratif/${id}`,
      formData
    );

    if (postRequest.data.success) {
      toggleToast();
      toastLabel.value = postRequest.data.message;
    }
  }
);
</script>
