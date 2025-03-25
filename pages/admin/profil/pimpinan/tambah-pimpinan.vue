<template>
  <div class="text-white">
    <WidgetsTambahBackButton
      link="/profil/tambah-data-kakomlek-dan-wakakomlekdam"
      kembali-to="/admin/profil/pimpinan"
    />

    <WidgetsJudulSection
      text="Form Tambah Data Kakomlekdam dan Wakakomlekdam XIV/Hsn"
      class="mt-4"
    />

    <form
      @submit="onSubmit"
      class="px-7 grid gap-7 grid-cols-2 py-6 bg-[#30394a]"
    >
      <div>
        <WidgetsDataInputBaseFileInput
          v-model="pasfoto"
          label="Upload Pas Photo"
        />
        <WidgetsErrorInput class="mt-3" :error="errors.pasfoto" />
      </div>

      <div class="flex flex-col gap-5">
        <div>
          <WidgetsDataInputBaseInput
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap beserta gelar"
            v-model="nama"
            variant="outline"
          />
          <WidgetsErrorInput :error="errors.nama" />
        </div>

        <div>
          <WidgetsDataInputBaseSelect
            label="Jabatan"
            :options="jabatanOptions"
            v-model="jabatan"
            variant="underline"
          />
          <WidgetsErrorInput :error="errors.jabatan" />
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
  inputPimpinanSchema,
  type TInputPimpinanSchema,
} from "~/schema/pimpinan/input";

definePageMeta({
  layout: "tambah",
});

const showToast = ref(false);
const toastLabel = ref("");

const { defineField, errors, handleSubmit } = useForm<TInputPimpinanSchema>({
  validationSchema: inputPimpinanSchema,
});

const [nama, namaAttrs] = defineField("nama");
const [jabatan, jabatanAttrs] = defineField("jabatan");
const [pasfoto, pasfotoAttrs] = defineField("pasfoto");

const axios = useAxios();

const jabatanOptions = [
  { label: "Kakomlekdam", value: "kakomlekdam" },
  { label: "Wakakomlekdam", value: "wakakomlekdam" },
];

function toggleToast() {
  showToast.value = !showToast.value;
}

const onSubmit = handleSubmit(async (payload: TInputPimpinanSchema) => {
  const formData = new FormData();

  formData.append("nama", payload.nama);
  formData.append("jabatan", payload.jabatan);
  if (pasfoto.value) {
    formData.append("pasfoto", payload.pasfoto);
  }

  const postRequest = await axios.postForm("/api/pejabat/pimpinan", formData);

  if (postRequest.data.success) {
    toggleToast();
    toastLabel.value = postRequest.data.message;
  }
});
</script>
