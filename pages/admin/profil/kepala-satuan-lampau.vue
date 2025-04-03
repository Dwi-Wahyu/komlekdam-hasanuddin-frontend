<template>
  <div>
    <div class="flex gap-1 items-center">
      <button @click="navigateTo('/admin/profil')">
        <IconsChevron width="20" height="20" class="-rotate-90" />
      </button>
      <WidgetsAdminPageTitle title="Kepala Satuan dari masa ke masa" />
    </div>

    <div
      class="bg-[#30394a] mt-4 px-5 py-4 border-b-2 items-center flex justify-between"
    >
      <h1 class="text-kg font-semibold text-yellow">
        Kepala Satuan dari masa ke masa
      </h1>

      <WidgetsDataInputBaseInput
        placeholder="Cari Kepala Satuan"
        v-model="search"
        :with-icon="true"
        :icon="Search"
      />

      <div class="flex gap-2 items-center">
        <WidgetsDataInputBaseSelect
          :options="perpageOptions"
          v-model:model-value="perpage"
        />

        <WidgetsPagination
          :model-value="perpage"
          :current-page="kepalaSatuanLampauStore.currentPage"
          :total-pages="kepalaSatuanLampauStore.totalPages"
          :total-datas="kepalaSatuanLampauStore.totalDatas"
          :per-page="kepalaSatuanLampauStore.perPage"
          @page-change="handlePageChange"
        />
      </div>
    </div>
    <div class="px-5 py-4 bg-[#202742]">
      <WidgetsDatatable
        :headers="tableHeaders"
        :data="data"
        :loading="loading"
        :show-button-action="true"
        :actions="actions"
        :columns-visible="['nomor', 'img:foto']"
        :action-without-dropdown="true"
      />
    </div>
    <div
      class="bg-[#202742] flex shadow justify-between items-center px-5 py-4 border-t-2"
    >
      <h1 class="text-sm text-yellow font-thin">
        Menampilkan {{ perpage }} dari
        {{ kepalaSatuanLampauStore.totalDatas }} data
      </h1>

      <WidgetsButtonBaseButton @click="toggleModal" size="sm" variant="outline">
        Tambah Data
      </WidgetsButtonBaseButton>
    </div>
    <input
      type="file"
      class="hidden"
      ref="fileInputFoto"
      @change="handleFileChange"
    />
  </div>

  <WidgetsPopupAlert
    v-if="showAlertHapus"
    label="Anda Yakin Menghapus Data Kakomlekdam Lampau? ?"
    @close="toggleAlertHapus"
    @confirm="handleHapus"
  />

  <WidgetsPopupAlert
    v-if="showAlertEdit"
    label="Anda Yakin Mengganti Foto ?"
    @close="toggleAlertEdit"
    @confirm="handleGantiFoto"
  />

  <WidgetsPopupToast
    v-if="showToast"
    :label="toastLabel"
    @close="toggleToast"
  />

  <WidgetsPopupModal
    v-if="showModal"
    @close="toggleModal"
    title="Input Kahubdam Lampau"
    @action="handleSubmit"
  >
    <WidgetsDataInputBaseFileInput v-model="foto" label="Input Gambar" />
    <WidgetsErrorInput class="mt-3" :error="errors.foto" />
  </WidgetsPopupModal>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import Edit from "~/components/icons/Edit.vue";
import Eye from "~/components/icons/Eye.vue";
import Search from "~/components/icons/Search.vue";
import Trash from "~/components/icons/Trash.vue";
import {
  inputKepalaSatuanLampauSchema,
  type TInputKepalaSatuanLampauSchema,
} from "~/schema/kepala-satuan-lampau/input";
import { useMyKepalaSatuanLampauStore } from "~/store/kepala-satuan-lampau";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const search = ref("");

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

const showAlertHapus = ref(false);
const showAlertEdit = ref(false);
const showToast = ref(false);
const showModal = ref(false);
const toastLabel = ref("");

function toggleAlertHapus() {
  showAlertHapus.value = !showAlertHapus.value;
}

function toggleAlertEdit() {
  showAlertEdit.value = !showAlertEdit.value;
}

function toggleToast() {
  showToast.value = !showToast.value;
}

function toggleModal() {
  showModal.value = !showModal.value;
}

const kepalaSatuanLampauStore = useMyKepalaSatuanLampauStore();

const { defineField, errors, validate, isFieldValid, resetForm } =
  useForm<TInputKepalaSatuanLampauSchema>({
    validationSchema: inputKepalaSatuanLampauSchema,
  });

const [foto, fotoAttrs] = defineField("foto");

const fileInputFoto = ref<HTMLInputElement | null>();

const perpageOptions = [
  {
    label: "5 Kolom",
    value: 5,
  },
  {
    label: "10 Kolom",
    value: 10,
  },
  {
    label: "50 Kolom",
    value: 50,
  },
];

const { data, loading, tableHeaders, currentPage } = storeToRefs(
  kepalaSatuanLampauStore
);

const axios = useAxios();

const id = ref("");

const perpage = ref(kepalaSatuanLampauStore.perPage);

function loadData() {
  kepalaSatuanLampauStore.getData({
    search: search.value,
    per_page: perpage.value,
    page: currentPage.value,
  });
}

const handlePageChange = (page: any) => {
  kepalaSatuanLampauStore.currentPage = page;

  loadData();
};

const actions = [
  {
    label: "Edit Foto",
    onClick: handleClickGanti,
    btnVariant: "primary",
    icon: Edit,
  },
  {
    label: "Lihat Foto",
    onClick: handleLihatClick,
    btnVariant: "secondary",
    icon: Eye,
  },
  {
    label: "Hapus",
    onClick: handleDeleteClick,
    btnVariant: "danger",
    icon: Trash,
  },
];

function handleClickGanti(row: any) {
  id.value = row.nomor;

  if (fileInputFoto.value) {
    fileInputFoto.value.click();
  }
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    foto.value = file;

    toggleAlertEdit();
  }
}

function handleLihatClick(row: any) {
  navigateTo(`${baseURL}/${row.foto}`, {
    external: true,
  });
}

function handleDeleteClick(row: any) {
  toggleAlertHapus();
  id.value = row.nomor;
}

async function handleGantiFoto() {
  const payload = new FormData();

  payload.append("foto", foto.value);

  const createRequest = await axios.patchForm(
    `/api/kepala-satuan-lampau/${id.value}`,
    payload
  );

  if (createRequest.data.success) {
    toastLabel.value = createRequest.data.message;
    loadData();
    toggleAlertEdit();
    toggleToast();
  }
}

async function handleSubmit() {
  validate();

  if (!isFieldValid("foto")) {
    return;
  }

  const payload = new FormData();

  payload.append("foto", foto.value);

  const createRequest = await axios.postForm(
    "/api/kepala-satuan-lampau",
    payload
  );

  if (createRequest.data.success) {
    toastLabel.value = createRequest.data.message;
    loadData();
    toggleModal();
    toggleToast();
    resetForm();
  }
}

async function handleHapus() {
  const deleteRequest = await axios.delete(
    `/api/kepala-satuan-lampau/${id.value}`
  );

  if (deleteRequest.data.success) {
    toggleAlertHapus();
    toggleToast();
    loadData();
  }
}

watch([search, perpage], () => {
  currentPage.value = 1;

  loadData();
});

onMounted(() => {
  loadData();
});
</script>
