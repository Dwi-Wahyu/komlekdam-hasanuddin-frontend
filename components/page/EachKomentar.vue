<template>
  <div v-if="komentar" class="relative w-full">
    <div class="w-full">
      <div class="w-full pr-16">
        <div class="flex gap-2 items-center">
          <h1 class="font-semibold">{{ komentar.nama }}</h1>
          <div
            v-if="komentar.komentar_sebagai === 'Journalis'"
            class="flex gap-1 items-center text-sm"
          >
            <IconsPenulis /> Publisher
          </div>
          <div
            v-else-if="komentar.komentar_sebagai === 'Administrator'"
            class="flex gap-2 items-center text-sm"
          >
            <IconsAdministrator /> Administrator
          </div>
        </div>
        <h1>
          {{ komentar.isi }}
        </h1>
      </div>
      <div class="ml-4">
        <div class="flex mt-1 items-center gap-3">
          <button
            class="text-sm flex gap-1"
            @click="handleBalas(komentar.id, komentar.nama)"
          >
            <IconsBack class="rotate-180" />
            <h1 class="text-xs">Balas komentar</h1>
          </button>
          <button
            class="text-sm flex gap-1"
            v-if="komentar.balasan_komentar.length"
            @click="toggleShowBalasan"
          >
            <IconsChevron
              width="15"
              height="15"
              class="mt-[0.1rem]"
              :class="showBalasan ? '' : 'rotate-180'"
            />
            <h1 class="text-xs" v-if="!showBalasan">
              Lihat {{ komentar.balasan_komentar.length }} balasan
            </h1>
            <h1 class="text-xs" v-else>Sembunyikan balasan</h1>
          </button>
        </div>
        <div v-if="showBalasan" class="mt-1 flex flex-col gap-1">
          <div
            v-for="balasan_komentar in komentar.balasan_komentar"
            class="flex w-full relative"
          >
            <div>
              <div class="font-semibold flex items-center gap-1">
                <div class="flex items-center gap-2">
                  <h1>
                    {{ balasan_komentar.nama }}
                  </h1>
                  <div
                    v-if="balasan_komentar.komentar_sebagai === 'Journalis'"
                    class="flex gap-1 items-center text-sm"
                  >
                    <IconsPenulis /> Publisher
                  </div>
                  <div
                    v-else-if="
                      balasan_komentar.komentar_sebagai === 'Administrator'
                    "
                    class="flex gap-2 items-center text-sm"
                  >
                    <IconsAdministrator /> Administrator
                  </div>
                </div>

                <IconsArrow width="17" height="17" class="rotate-90" />
                <h1>
                  {{ balasan_komentar.kepada }}
                </h1>
              </div>
              <h1>
                {{ balasan_komentar.isi }}
              </h1>
              <button
                class="text-sm flex items-center gap-1"
                @click="handleBalas(komentar.id, balasan_komentar.nama)"
              >
                <IconsBack class="rotate-180" />
                <h1 class="text-xs">Balas komentar</h1>
              </button>
            </div>
            <PageLikeDislike
              class="absolute right-0 top-0"
              v-if="balasan_komentar"
              :id="balasan_komentar.id"
              :like="balasan_komentar.like"
              :dislike="balasan_komentar.dislike"
              konten="balasan_komentar"
            />
          </div>
        </div>
      </div>
    </div>
    <PageLikeDislike
      class="absolute right-0 top-0"
      v-if="komentar"
      :id="komentar.id"
      :like="komentar.like"
      :dislike="komentar.dislike"
      konten="komentar"
    />
  </div>

  <WidgetsPopupModal
    v-if="showModal"
    @close="toggleModal"
    :show-action="false"
    :title="komentarDibalas"
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
import { useMyAuthStore, type TUser } from "~/store/auth";

const emits = defineEmits(["refresh"]);

type TBalasanKomentar = {
  id: number;
  isi: string;
  nama: string;
  kepada: string;
  like: number;
  dislike: number;
  komentar_sebagai: string;
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
  readonly komentar: TKomentar | undefined;
  readonly id: Number | undefined;
}>();

const komentarDibalas = ref("");

const showModal = ref(false);
const showToast = ref(false);
const toastLabel = ref("");

const authStore = useMyAuthStore();

function toggleToast() {
  showToast.value = !showToast.value;
}

const axios = useAxios();

const showBalasan = ref(false);
const showCountBalasan = ref(0);

function toggleModal() {
  showModal.value = !showModal.value;
}

function toggleShowBalasan() {
  showBalasan.value = !showBalasan.value;
}

const { defineField, resetForm, errors, handleSubmit } =
  useForm<TInputKomentarSchema>({
    validationSchema: inputKomentarSchema,
  });

const [nama, namaAttrs] = defineField("nama");
const [isi, isiAttrs] = defineField("isi");
const id_user = ref(0);

function checkUserLoggedIn(user: TUser | null): boolean {
  if (user) {
    return true;
  }

  return false;
}

if (authStore.user) {
  nama.value = authStore.user.nama;
  id_user.value = authStore.user.id;
}

const id_komentar = ref<number>();
const kepada = ref("");

function handleBalas(id_row: number, nama_row: string) {
  id_komentar.value = id_row;
  kepada.value = nama_row;

  komentarDibalas.value = "Balas komentar " + nama_row;

  toggleModal();
}

const onSubmit = handleSubmit(async (payload: TInputKomentarSchema) => {
  const { isi, nama } = payload;

  const formData = {
    id_komentar: id_komentar.value,
    id_berita: props.id,
    isi,
    nama,
    kepada: kepada.value,
    id_user: id_user.value,
  };

  const postRequest = await axios.post("/api/berita/komentar/balas", formData);

  if (postRequest.data.success) {
    toggleModal();
    toastLabel.value = postRequest.data.message;
    toggleToast();
    resetForm();
    emits("refresh");
  }
});
</script>
