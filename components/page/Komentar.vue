<template>
  <div class="border-t-2 border-yellow pt-4 pb-1">
    <div class="flex justify-between items-center">
      <h1 class="text-lg font-semibold mb-1">Komentar</h1>

      <WidgetsButtonBaseButton @click="toggleModal" variant="outline" size="sm">
        Tambah Komentar
      </WidgetsButtonBaseButton>
    </div>

    <div v-if="pending">
      <h1>Loading . . .</h1>
    </div>
    <div v-else-if="error">
      {{ error }}
    </div>
    <div v-else-if="data?.length" class="mt-4 flex gap-4 flex-col">
      <EachKomentar
        v-for="(komentar, komentarIdx) in data"
        :komentar="komentar"
        :id="id"
        @refresh="refresh"
        :key="komentarIdx"
      />
    </div>
    <div v-else class="flex mt-3 items-center gap-1 justify-center">
      <IconsEmpty width="19" height="19" />
      <h1 class="text-center">Belum ada komentar</h1>
    </div>
  </div>

  <WidgetsPopupModal
    v-if="showModal"
    @close="toggleModal"
    :show-action="false"
    title="Input Komentar"
  >
    <form @submit="onSubmit" class="flex flex-col gap-3">
      <div>
        <WidgetsDataInputBaseInput
          variant="outline"
          v-model="nama"
          :disabled="checkUserLoggedIn(authStore.user)"
          label="Nama"
        />

        <WidgetsErrorInput :error="errors.nama" />
      </div>

      <div>
        <WidgetsDataInputBaseTextArea
          v-model="isi"
          label="Isi komentar"
          variant="outline"
          height="h-28"
        />

        <WidgetsErrorInput :error="errors.isi" />
      </div>

      <div class="flex justify-center">
        <WidgetsButtonBaseButton type="submit">
          Submit
        </WidgetsButtonBaseButton>
      </div>
    </form>
  </WidgetsPopupModal>

  <WidgetsPopupToast
    v-if="showToast"
    :label="toastLabel"
    @close="toggleToast"
  />
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import {
  inputKomentarSchema,
  type TInputKomentarSchema,
} from "~/schema/berita/input-komentar";
import EachKomentar from "./EachKomentar.vue";
import { useMyAuthStore, type TUser } from "~/store/auth";

type TBalasanKomentar = {
  id: number;
  isi: string;
  nama: string;
  kepada: string;
  komentar_sebagai: string;
  like: number;
  dislike: number;
  tanggal: string;
};

type TKomentar = {
  id: number;
  isi: string;
  nama: string;
  like: number;
  dislike: number;
  tanggal: string;
  komentar_sebagai: string;
  balasan_komentar: TBalasanKomentar[];
};

const props = defineProps<{
  readonly id: Number | undefined;
}>();

const { data, pending, error, refresh } = await useMyFetch<TKomentar[]>(
  "/api/berita/komentar/" + props.id,
  {
    lazy: true,
  }
);

function checkUserLoggedIn(user: TUser | null): boolean {
  if (user) {
    return true;
  }

  return false;
}

const authStore = useMyAuthStore();

const axios = useAxios();

const showModal = ref(false);
const showToast = ref(false);
const toastLabel = ref("");

function toggleToast() {
  showToast.value = !showToast.value;
}

const { defineField, resetForm, errors, handleSubmit } =
  useForm<TInputKomentarSchema>({
    validationSchema: inputKomentarSchema,
  });

const [nama, namaAttrs] = defineField("nama");
const [isi, isiAttrs] = defineField("isi");
const id_user = ref(0);

if (authStore.user) {
  nama.value = authStore.user.nama;
  id_user.value = authStore.user.id;
}

function toggleModal() {
  showModal.value = !showModal.value;
}

const onSubmit = handleSubmit(async (payload: TInputKomentarSchema) => {
  const { isi, nama } = payload;

  const formData = {
    id: props.id,
    isi,
    nama,
    id_user: id_user.value,
  };

  const postRequest = await axios.post("/api/berita/komentar", formData);

  if (postRequest.data.success) {
    refresh();
    toggleModal();
    toastLabel.value = postRequest.data.message;
    toggleToast();
    resetForm();
  }
});
</script>
