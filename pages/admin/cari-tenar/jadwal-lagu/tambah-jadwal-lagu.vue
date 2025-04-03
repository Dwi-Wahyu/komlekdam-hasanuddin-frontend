<template>
  <div class="text-white">
    <WidgetsTambahBackButton
      link="/cari-tenar/tambah-jadwal-lagu"
      kembali-to="/admin/cari-tenar/jadwal-lagu"
    />

    <WidgetsJudulSection text="Tambah Jadwal Lagu" class="mt-4" />

    <form
      @submit="onSubmit"
      class="px-7 grid gap-7 grid-cols-2 py-6 bg-[#30394a]"
    >
      <div>
        <WidgetsDataInputBaseFileInput
          file-type="lagu"
          v-model="lagu"
          label="Upload Lagu"
        />
        <WidgetsErrorInput class="mt-3" :error="errors.lagu" />
      </div>

      <div class="flex flex-col gap-5">
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
      </div>

      <div class="flex justify-center col-span-2">
        <WidgetsButtonBaseButton type="submit" variant="outline">
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
  inputJadwalLaguSchema,
  type TInputJadwalLaguSchema,
} from "~/schema/jadwal-lagu/input";

definePageMeta({
  layout: "tambah",
});

const showToast = ref(false);
const toastLabel = ref("");

const { defineField, errors, handleSubmit } = useForm<TInputJadwalLaguSchema>({
  validationSchema: inputJadwalLaguSchema,
});

const [judul, judulAttrs] = defineField("judul");
const [mulai, mulaiAttrs] = defineField("mulai");
const [selesai, selesaiAttrs] = defineField("selesai");
const [lagu, laguAttrs] = defineField("lagu");

const axios = useAxios();

function toggleToast() {
  showToast.value = !showToast.value;
}

const onSubmit = handleSubmit(async (payload: TInputJadwalLaguSchema) => {
  const formData = new FormData();

  formData.append("judul", payload.judul);
  formData.append("mulai", payload.mulai);
  formData.append("selesai", payload.selesai);
  formData.append("lagu", payload.lagu);

  const postRequest = await axios.postForm("/api/jadwal-lagu", formData);

  if (postRequest.data.success) {
    toggleToast();
    toastLabel.value = postRequest.data.message;
  }
});
</script>
