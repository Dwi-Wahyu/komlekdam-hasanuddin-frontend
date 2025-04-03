<template>
  <div
    class="w-full pt-20 pb-12 flex-col p-5 text-yellow flex items-center justify-center"
  >
    <WidgetsJudulSection text="Lapor!" subtext="Sigap, Cepat, Tanggap" />
    <form
      @submit="onSubmit"
      class="flex flex-col gap-4 bg-[#303949] p-10 w-full md:w-[40vw]"
    >
      <div>
        <WidgetsDataInputBaseInput
          label="Nama"
          placeholder="Masukkan Nama Lengkap"
          variant="outline"
          v-model="nama"
          v-bind="namaAttrs"
        />

        <WidgetsErrorInput :error="errors.nama" />
      </div>

      <div>
        <WidgetsDataInputBaseInput
          label="Nomor Telepon"
          placeholder="Masukkan Nomor Telepon Aktif/Whatsapp"
          variant="outline"
          type="number"
          v-model="nomor"
          v-bind="nomorAttrs"
        />

        <WidgetsErrorInput :error="errors.nomor" />
      </div>

      <div>
        <WidgetsDataInputBaseInput
          label="Email"
          placeholder="Masukkan Email"
          variant="outline"
          v-model="email"
          v-bind="emailAttrs"
        />

        <WidgetsErrorInput :error="errors.email" />
      </div>

      <div>
        <WidgetsDataInputBaseTextArea
          height="h-28"
          label="Pesan"
          placeholder="Masukkan isi, kritik, dan saran"
          variant="outline"
          v-model="pesan"
          v-bind="pesanAttrs"
        />

        <WidgetsErrorInput :error="errors.pesan" />
      </div>

      <div class="flex justify-center">
        <WidgetsButtonBaseButton
          type="submit"
          variant="outline"
          class="mt-5 border-yellow"
        >
          Buat Laporan
        </WidgetsButtonBaseButton>
      </div>
    </form>
  </div>

  <WidgetsPopupToast
    v-if="showToast"
    label="Berhasil membuat laporan"
    @close="toggleToast"
  />
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  inputLaporanSchema,
  type TInputLaporanSchema,
} from "~/schema/laporan/input";

definePageMeta({
  layout: "landing",
});

const showToast = ref(false);

const axios = useAxios();

function toggleToast() {
  showToast.value = !showToast.value;
}

const { defineField, errors, handleSubmit, resetForm } =
  useForm<TInputLaporanSchema>({
    validationSchema: inputLaporanSchema,
  });

const [nama, namaAttrs] = defineField("nama");
const [nomor, nomorAttrs] = defineField("nomor");
const [email, emailAttrs] = defineField("email");
const [pesan, pesanAttrs] = defineField("pesan");

const onSubmit = handleSubmit(async (payload: TInputLaporanSchema) => {
  const createRequest = await axios.post("/api/laporan", payload);

  if (createRequest.data.success) {
    toggleToast();
    resetForm();
  }
});
</script>
