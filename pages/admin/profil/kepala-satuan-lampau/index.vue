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
  </div>

  <WidgetsPopupAlert
    v-if="showAlert"
    label="Anda Yakin Menghapus Data Pejabat ?"
    @close="toggleAlert"
    @confirm="handleHapus"
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

const showAlert = ref(false);
const showToast = ref(false);
const showModal = ref(false);
const toastLabel = ref("");

function toggleAlert() {
  showAlert.value = !showAlert.value;
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
    page: 1,
  });
}

const handlePageChange = (page: any) => {
  kepalaSatuanLampauStore.currentPage = page;
  loadData();
};

const actions = [
  {
    label: "Edit",
    onClick: handleUpdateClick,
    btnVariant: "primary",
    icon: Edit,
  },
  {
    label: "Hapus",
    onClick: handleDeleteClick,
    btnVariant: "danger",
    icon: Trash,
  },
];

function handleUpdateClick(row: any) {
  navigateTo(`/admin/profil/pejabat-satuan/edit-pejabat/${row.nomor}`);
}

function handleDeleteClick(row: any) {
  toggleAlert();
  id.value = row.nomor;
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
    toggleModal();
    toggleToast();

    resetForm();
  }
}

async function handleHapus() {
  const deleteRequest = await axios.delete(`/api/pejabat/${id.value}`);

  if (deleteRequest.data.success) {
    toggleAlert();
    toggleToast();
    loadData();
  }
}

watch([search], () => {
  loadData();
});

onMounted(() => {
  loadData();
});
</script>
