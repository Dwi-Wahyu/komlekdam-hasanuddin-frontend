<template>
  <div>
    <h1 class="text-xl mb-4 font-semibold">Program</h1>

    <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
      <div
        v-for="data in cardData"
        class="flex flex-col justify-between shadow-[7px_7px_0px_0px_rgba(0,0,0,0.2)] p-4 bg-[#303949]"
      >
        <div>
          <h1 class="text-yellow font-semibold">{{ data.title }}</h1>
          <p class="font-thin">{{ data.description }}</p>
        </div>
        <div class="flex justify-end">
          <WidgetsButtonBaseButton
            v-if="data.title === 'Live Youtube'"
            variant="outline"
            @click="showModal = true"
          >
            Buka
          </WidgetsButtonBaseButton>
          <WidgetsButtonBaseButton
            v-else
            variant="outline"
            @click="navigateTo(data.bukaLink)"
          >
            Buka
          </WidgetsButtonBaseButton>
        </div>
      </div>
    </div>
  </div>

  <WidgetsPopupInputModal
    v-if="showModal"
    @close="toggleModal"
    title="Edit Live Youtube"
  >
    <form @submit="onSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <WidgetsDataInputBaseFileInput
        label="Upload Thumbnail"
        v-model="thumbnail"
        :error="errors.thumbnail"
        :default-file="defaultThumbnailUrl"
      />
      <div class="flex flex-col justify-between gap-5">
        <WidgetsDataInputBaseInput
          label="Masukkan Link Live Youtube"
          variant="outline"
          v-model="link"
        />
        <WidgetsButtonBaseButton
          variant="outline"
          type="submit"
          class="self-center md:self-end"
        >
          Perbaharui
        </WidgetsButtonBaseButton>
      </div>
    </form>
  </WidgetsPopupInputModal>

  <WidgetsPopupToast
    v-if="showToast"
    label="Berhasil perbaharui live youtube"
    @close="toggleToast"
  />
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import {
  inputLiveYoutubeSchema,
  type TInputLiveYoutubeSchema,
} from "~/schema/live-youtube/input";

definePageMeta({
  middleware: "auth",
});

const cardData = [
  {
    title: "Jadwal Lagu",
    bukaLink: "/admin/cari-tenar/jadwal-lagu",
    description: "Menu untuk menjadwalkan lagu yang diputar",
  },
  {
    title: "Live Youtube",
    bukaLink: "/admin/cari-tenar/live-youtube",
    description: "Menu Edit Live Youtube",
  },
  {
    title: "Cerita Inspiratif",
    bukaLink: "/admin/cari-tenar/cerita-inspiratif",
    description:
      "Menu Menambahkan Cerita Inspiratif dari keluarga Satuan Komlekdam",
  },
];

type TLiveYoutube = {
  link: string;
  thumbnailPath: string;
};

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

const showModal = ref(false);
const showToast = ref(false);
const axios = useAxios();

function toggleToast() {
  showToast.value = !showToast.value;
}

function toggleModal() {
  showModal.value = !showModal.value;
}

const { defineField, errors, handleSubmit } = useForm<TInputLiveYoutubeSchema>({
  validationSchema: inputLiveYoutubeSchema,
});

const [link, linkAttrs] = defineField("link");
const [thumbnail, thumbnailAttrs] = defineField("thumbnail");

const defaultThumbnailUrl = ref("");

const { data } = await useMyFetch<TLiveYoutube>("/api/live-youtube", {
  lazy: true,
  onResponse: ({ response }) => {
    if (response._data) {
      console.log(response._data);

      link.value = response._data.link;
      defaultThumbnailUrl.value = `${baseURL}/live-youtube/${response._data.thumbnailPath}`;
    }
  },
});

const onSubmit = handleSubmit(async (payload: TInputLiveYoutubeSchema) => {
  const formData = new FormData();

  formData.append("link", payload.link);
  formData.append("thumbnail", payload.thumbnail);

  const postRequest = await axios.patchForm("/api/live-youtube", formData);

  if (postRequest.data.success) {
    toggleModal();
    toggleToast();
  }
});
</script>
