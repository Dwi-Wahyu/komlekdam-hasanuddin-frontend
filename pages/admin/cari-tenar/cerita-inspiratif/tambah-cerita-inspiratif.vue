<template>
  <div class="text-white">
    <WidgetsTambahBackButton
      link="/cari-tenar/tambah-cerita-inspiratif"
      kembali-to="/admin/cari-tenar/cerita-inspiratif"
    />

    <WidgetsJudulSection text="Tambah Cerita Inspiratif" class="mt-4" />

    <form
      @submit="onSubmit"
      class="px-7 grid gap-7 grid-cols-2 py-6 bg-[#30394a]"
    >
      <div class="flex flex-col gap-5">
        <div>
          <WidgetsDataInputBaseFileInput
            v-model="thumbnail"
            label="Upload Thumbnail"
            :error="errors.thumbnail"
          />
        </div>
        <div>
          <WidgetsDataInputBaseFileInput
            file-type="video"
            v-model="video"
            label="Upload Video"
            :error="errors.video"
          />
        </div>
      </div>

      <div class="flex flex-col gap-5">
        <div>
          <WidgetsDataInputBaseInput
            label="Judul Lagu"
            placeholder="Masukkan Judul Lagu Cerita Inspiratif"
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

      <div class="flex justify-center col-span-2">
        <WidgetsButtonBaseButton type="submit" variant="outline">
          <IconsLoader class="mr-1" v-if="loading" />
          Tambah Data
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
import { useForm } from "vee-validate";
import {
  inputCeritaInspiratifSchema,
  type TInputCeritaInspiratifSchema,
} from "~/schema/cerita-inspiratif/input";

definePageMeta({
  layout: "tambah",
});

const showToast = ref(false);
const toastLabel = ref("");

const { defineField, errors, handleSubmit, resetForm } =
  useForm<TInputCeritaInspiratifSchema>({
    validationSchema: inputCeritaInspiratifSchema,
  });

const [judul] = defineField("judul");
const [deskripsi] = defineField("deskripsi");
const [thumbnail] = defineField("thumbnail");
const [video] = defineField("video");
const loading = ref(false);

const axios = useAxios();

function toggleToast() {
  showToast.value = !showToast.value;
}

const onSubmit = handleSubmit(async (payload: TInputCeritaInspiratifSchema) => {
  loading.value = true;
  const formData = new FormData();

  formData.append("judul", payload.judul);
  formData.append("deskripsi", payload.deskripsi);
  formData.append("thumbnail", payload.thumbnail);
  formData.append("video", payload.video);

  const postRequest = await axios.postForm("/api/cerita-inspiratif", formData);

  if (postRequest.data.success) {
    loading.value = false;
    toastLabel.value = postRequest.data.message;
    toggleToast();
    resetForm();
  }
});
</script>
