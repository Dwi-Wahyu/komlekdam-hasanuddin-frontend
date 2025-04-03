<template>
  <div
    class="w-full pt-20 pb-12 flex-col p-5 text-yellow min-h-screen flex items-center justify-center"
  >
    <form
      v-if="canCreateLaporan"
      @submit="onSubmit"
      class="flex flex-col gap-4 bg-[#303949] p-10 w-full md:w-[40vw]"
    >
      <WidgetsJudulSection text="Lapor!" subtext="Sigap, Cepat, Tanggap" />

      <div>
        <WidgetsDataInputBaseInput
          label="Nama"
          placeholder="Masukkan Nama Lengkap"
          variant="outline"
          v-model="nama"
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
        />

        <WidgetsErrorInput :error="errors.nomor" />
      </div>

      <div>
        <WidgetsDataInputBaseInput
          label="Email"
          placeholder="Masukkan Email"
          variant="outline"
          v-model="email"
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
    <div v-else class="flex items-center justify-center flex-col gap-4">
      <h1 class="font-semibold text-xl">Anda Telah Membuat Laporan</h1>
      <IconsSuccessLaporan />
      <h1 class="text-white text-center">
        Mohon Tunggu Beberapa Saat Untuk <br />
        Membuat Laporan Berikutnya
      </h1>
    </div>
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
const canCreateLaporan = ref(true);

const { getItem, removeItem, setItem } = useLocalStorage();

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

function addLocalStorage() {
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + 10);

  setItem("waktu_valid_pelaporan_berikutnya", expiryDate.toISOString());
  canCreateLaporan.value = false;
}

const onSubmit = handleSubmit(async (payload: TInputLaporanSchema) => {
  const createRequest = await axios.post("/api/laporan", payload);

  if (createRequest.data.success) {
    toggleToast();
    resetForm();
    addLocalStorage();
  }
});

onMounted(() => {
  const expiryString = getItem("waktu_valid_pelaporan_berikutnya");

  if (expiryString) {
    const expiryDate = new Date(expiryString);
    const now = new Date();

    if (!isNaN(expiryDate.getTime())) {
      canCreateLaporan.value = now >= expiryDate;

      if (now >= expiryDate) {
        removeItem("waktu_valid_pelaporan_berikutnya");
      }
    }
  }
});
</script>
