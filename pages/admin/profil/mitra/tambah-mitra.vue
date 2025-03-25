<template>
  <div class="text-white">
    <WidgetsTambahBackButton
      link="/admin/profil/tambah-mitra"
      kembali-to="/admin/profil/mitra"
    />

    <WidgetsJudulSection text="Form Tambah Data Mitra" class="mt-4" />

    <form @submit="onSubmit" class="px-7 grid gap-7 py-6 bg-[#30394a]">
      <div>
        <WidgetsDataInputBaseFileInput
          label="Upload Logo"
          v-model="logo"
          min-height="min-h-96"
        />
        <WidgetsErrorInput :error="errors.logo" class="mt-3" />
      </div>

      <div class="flex flex-col gap-5">
        <div>
          <WidgetsDataInputBaseInput
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap beserta gelar"
            v-model="nama"
            :bind-attr="namaAttrs"
            variant="outline"
          />
          <WidgetsErrorInput :error="errors.nama" />
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

import { inputMitraSchema, type TInputMitraSchema } from "~/schema/mitra/input";

definePageMeta({
  layout: "tambah",
});

const showToast = ref(false);
const toastLabel = ref("");

const { defineField, errors, handleSubmit, resetForm } =
  useForm<TInputMitraSchema>({
    validationSchema: inputMitraSchema,
  });

const [nama, namaAttrs] = defineField("nama");
const [logo, logoAttrs] = defineField("logo");

const axios = useAxios();

function toggleToast() {
  showToast.value = !showToast.value;
}

const onSubmit = handleSubmit(async (payload: TInputMitraSchema) => {
  const formdata = new FormData();

  formdata.append("nama", payload.nama);
  if (logo.value) {
    formdata.append("logo", payload.logo);
  }

  const postRequest = await axios.postForm("/api/mitra", formdata);

  if (postRequest.data.success) {
    toggleToast();
    toastLabel.value = postRequest.data.message;
    resetForm();
  }
});
</script>
