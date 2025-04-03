<template>
  <div class="text-white">
    <WidgetsTambahBackButton
      link="/admin/profil/tambah-pejabat-satuan"
      kembali-to="/admin/profil/pejabat-satuan"
    />

    <WidgetsJudulSection text="Form Edit Data Pejabat Satuan" class="mt-4" />

    <div v-if="pending" class="px-7 py-6">
      <h1>Loading . . .</h1>
    </div>
    <form
      @submit="onSubmit"
      v-else
      class="px-7 grid gap-7 grid-cols-2 py-6 bg-[#30394a]"
    >
      <div class="flex justify-center bg-[#1d242e] items-center">
        <img
          :src="`${baseURL}/profil/pejabat/${data?.pasfoto}`"
          class="max-w-52 my-5"
          alt=""
        />
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

      <div class="flex justify-center gap-4 col-span-2">
        <input
          type="file"
          class="hidden"
          ref="fileInputPasfoto"
          @change="handleFileChange"
        />
        <WidgetsButtonBaseButton
          type="button"
          @click="handleClickGanti"
          variant="outline"
        >
          Ganti Pasfoto
        </WidgetsButtonBaseButton>

        <WidgetsButtonBaseButton type="submit" variant="outline">
          Edit Data
        </WidgetsButtonBaseButton>
      </div>
    </form>

    <WidgetsPopupAlert
      v-if="showAlert"
      label="Anda Yakin Mengubah Pasfoto?"
      @close="toggleAlert"
      @confirm="handleGantiPasfoto"
    />
  </div>

  <WidgetsPopupToast
    v-if="showToast"
    :label="toastLabel"
    @close="toggleToast"
  />
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { jabatanOptions } from "~/data/data-jabatan";
import {
  updatePejabatSatuanSchema,
  type TUpdatePejabatSatuanSchema,
} from "~/schema/pejabat-satuan/update";

definePageMeta({
  layout: "tambah",
});

const route = useRoute();
const { id } = route.params;

const showToast = ref(false);
const toastLabel = ref("");

type TPejabat = {
  nama: string;
  jabatan: string;
  pasfoto: string;
};

const fileInputPasfoto = ref<HTMLInputElement | null>();

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

const {
  data,
  pending,
  refresh: refreshData,
} = await useMyFetch<TPejabat>(`/api/pejabat/${id}`, {
  lazy: true,
});

const { defineField, errors, handleSubmit, resetForm } =
  useForm<TUpdatePejabatSatuanSchema>({
    validationSchema: updatePejabatSatuanSchema,
  });

const [nama, namaAttrs] = defineField("nama");
const [jabatan, jabatanAttrs] = defineField("jabatan");

const pasfoto = ref<File | undefined>();

const axios = useAxios();

const showAlert = ref(false);

function toggleToast() {
  showToast.value = !showToast.value;
}

function toggleAlert() {
  showAlert.value = !showAlert.value;
}

function handleClickGanti() {
  if (fileInputPasfoto.value) {
    fileInputPasfoto.value.click();
  }
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    pasfoto.value = file;

    toggleAlert();
  }
}

async function handleGantiPasfoto() {
  const payload = new FormData();

  if (pasfoto.value) {
    payload.append("pasfoto", pasfoto.value);
  }

  const postRequest = await axios.postForm(
    `/api/pejabat/ganti-pasfoto/${id}`,
    payload
  );

  if (postRequest.data.success) {
    toggleAlert();
    refreshData();
    toggleToast();
    toastLabel.value = postRequest.data.message;
  }
}

const onSubmit = handleSubmit(async (payload: TUpdatePejabatSatuanSchema) => {
  const formdata = new FormData();

  formdata.append("nama", nama.value);
  formdata.append("jabatan", jabatan.value);

  const patchForm = await axios.patch(`/api/pejabat/${id}`, formdata);

  if (patchForm.data.success) {
    toggleToast();
    toastLabel.value = patchForm.data.message;
    refreshData();
  }
});

watch(data, (newData) => {
  if (newData) {
    nama.value = newData.nama;
    jabatan.value = newData.jabatan;
  }
});
</script>
