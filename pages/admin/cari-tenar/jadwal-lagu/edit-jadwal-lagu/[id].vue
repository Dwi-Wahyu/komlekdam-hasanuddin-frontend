<template>
  <div class="text-white">
    <WidgetsTambahBackButton
      link="/cari-tenar/tambah-jadwal-lagu"
      kembali-to="/admin/cari-tenar/jadwal-lagu"
    />

    <WidgetsJudulSection text="Edit Jadwal Lagu" class="mt-4" />

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
      <div>
        <h1 class="mb-2 font-semibold">Lagu</h1>
        <audio controls>
          <source
            :src="`${baseURL}/jadwal-lagu/${data.laguPath}`"
            type="audio/mpeg"
          />
          Browser Anda tidak mendukung elemen audio.
        </audio>
      </div>

      <div>
        <WidgetsDataInputBaseInput
          label="Judul Lagu"
          placeholder="Masukkan Judul Lagu"
          v-model="judul"
          variant="outline"
        />
        <WidgetsErrorInput :error="errors.judul" />
      </div>

      <div>
        <WidgetsDataInputBaseInput
          label="Jam Mulai"
          placeholder="Masukkan Jam Mulai"
          v-model="mulai"
          type="time"
          variant="outline"
        />
        <WidgetsErrorInput :error="errors.mulai" />
      </div>

      <div>
        <WidgetsDataInputBaseInput
          label="Jam Selesai"
          placeholder="Masukkan Jam Selesai"
          v-model="selesai"
          type="time"
          variant="outline"
        />
        <WidgetsErrorInput :error="errors.selesai" />
      </div>

      <div class="flex justify-center gap-4 col-span-2">
        <input
          type="file"
          class="hidden"
          ref="fileInputLagu"
          @change="handleFileChange"
        />
        <WidgetsButtonBaseButton type="button" @click="handleClickGanti">
          Ganti Lagu
        </WidgetsButtonBaseButton>
        <WidgetsButtonBaseButton type="submit" variant="outline">
          Edit Data
        </WidgetsButtonBaseButton>
      </div>
    </form>
  </div>

  <WidgetsPopupAlert
    v-if="showAlert"
    label="Anda Yakin Mengubah Lagu?"
    @close="toggleAlert"
    @confirm="handleGantiLagu"
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
  inputJadwalLaguSchema,
  type TInputJadwalLaguSchema,
} from "~/schema/jadwal-lagu/input";
import {
  updateJadwalLaguSchema,
  type TUpdateJadwalLaguSchema,
} from "~/schema/jadwal-lagu/update";

definePageMeta({
  layout: "tambah",
});

const showAlert = ref(false);
const showToast = ref(false);
const toastLabel = ref("");

function toggleAlert() {
  showAlert.value = !showAlert.value;
}

function toggleToast() {
  showToast.value = !showToast.value;
}

const { defineField, errors, handleSubmit } = useForm<TUpdateJadwalLaguSchema>({
  validationSchema: updateJadwalLaguSchema,
});

const [judul, judulAttrs] = defineField("judul");
const [mulai, mulaiAttrs] = defineField("mulai");
const [selesai, selesaiAttrs] = defineField("selesai");

const lagu = ref<File | undefined>();

const fileInputLagu = ref<HTMLInputElement | null>();

const axios = useAxios();
const route = useRoute();
const { id } = route.params;

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

type TJadwalLagu = {
  judul: string;
  mulai: string;
  selesai: string;
  laguPath: string;
};

const { data, pending, error, refresh } = await useMyFetch<TJadwalLagu>(
  `/api/jadwal-lagu/${id}`,
  {
    lazy: true,
    onResponse: ({ response }) => {
      if (response._data) {
        judul.value = response._data.judul;
        mulai.value = response._data.mulai;
        selesai.value = response._data.selesai;
      }
    },
  }
);

function handleClickGanti() {
  if (fileInputLagu.value) {
    fileInputLagu.value.click();
  }
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    lagu.value = file;

    toggleAlert();
  }
}

async function handleGantiLagu() {
  const payload = new FormData();

  if (lagu.value) {
    payload.append("lagu", lagu.value);
  }

  const postRequest = await axios.postForm(
    `/api/jadwal-lagu/ganti-lagu/${id}`,
    payload
  );

  if (postRequest.data.success) {
    toggleAlert();
    refresh();
    toastLabel.value = postRequest.data.message;
    toggleToast();
  }
}

const onSubmit = handleSubmit(async (payload: TUpdateJadwalLaguSchema) => {
  const formData = new FormData();

  formData.append("judul", payload.judul);
  formData.append("mulai", payload.mulai);
  formData.append("selesai", payload.selesai);

  const postRequest = await axios.patch(`/api/jadwal-lagu/${id}`, formData);

  if (postRequest.data.success) {
    toggleToast();
    toastLabel.value = postRequest.data.message;
  }
});
</script>
