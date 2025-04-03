<template>
  <div>
    <div class="flex gap-1 items-center">
      <button @click="navigateTo('/admin/profil')">
        <IconsChevron width="20" height="20" class="-rotate-90" />
      </button>
      <WidgetsAdminPageTitle title="Pejabat Satuan" />
    </div>

    <div
      class="bg-[#30394a] mt-4 px-5 py-4 border-b-2 items-center flex justify-between"
    >
      <h1 class="text-kg font-semibold text-yellow">List Pejabat</h1>

      <WidgetsDataInputBaseInput
        placeholder="Cari Pejabat Satuan"
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
          :current-page="pejabatSatuanStore.currentPage"
          :total-pages="pejabatSatuanStore.totalPages"
          :total-datas="pejabatSatuanStore.totalDatas"
          :per-page="pejabatSatuanStore.perPage"
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
        :columns-visible="['no', 'nama', 'jabatan']"
      />
    </div>
    <div
      class="bg-[#202742] flex shadow justify-between items-center px-5 py-4 border-t-2"
    >
      <h1 class="text-sm text-yellow font-thin">
        Menampilkan {{ perpage }} dari {{ pejabatSatuanStore.totalDatas }} data
      </h1>

      <WidgetsButtonBaseButton
        @click="navigateTo('/admin/profil/pejabat-satuan/tambah-pejabat')"
        size="sm"
        variant="outline"
      >
        Tambah Pejabat
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
    label="Berhasil Menghapus Data Pejabat"
    @close="toggleToast"
  />
</template>

<script setup lang="ts">
import Edit from "~/components/icons/Edit.vue";
import Search from "~/components/icons/Search.vue";
import Trash from "~/components/icons/Trash.vue";
import { useMyPejabatSatuanStore } from "~/store/pejabat-satuan";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const search = ref("");

const showAlert = ref(false);
const showToast = ref(false);

function toggleAlert() {
  showAlert.value = !showAlert.value;
}

function toggleToast() {
  showToast.value = !showToast.value;
}

const pejabatSatuanStore = useMyPejabatSatuanStore();

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

const { data, loading, tableHeaders, currentPage } =
  storeToRefs(pejabatSatuanStore);

const axios = useAxios();

const id = ref("");

const perpage = ref(pejabatSatuanStore.perPage);

function loadData() {
  pejabatSatuanStore.getData({
    search: search.value,
    per_page: perpage.value,
    page: 1,
  });
}

const handlePageChange = (page: any) => {
  pejabatSatuanStore.currentPage = page;
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

async function handleHapus() {
  const deleteRequest = await axios.delete(`/api/pejabat/${id.value}`);

  if (deleteRequest.data.success) {
    toggleAlert();
    toggleToast();
    loadData();
  }
}

watch([search, perpage], () => {
  loadData();
});

onMounted(() => {
  loadData();
});
</script>
