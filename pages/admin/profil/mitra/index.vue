<template>
  <div>
    <div class="flex gap-1 items-center">
      <button @click="navigateTo('/admin/profil')">
        <IconsChevron width="20" height="20" class="-rotate-90" />
      </button>
      <WidgetsAdminPageTitle title="Profil Mitra" />
    </div>

    <div
      class="bg-[#30394a] mt-4 px-5 py-4 border-b-2 items-center flex justify-between"
    >
      <h1 class="text-kg font-semibold text-yellow">Mitra</h1>

      <WidgetsDataInputBaseInput
        placeholder="Cari "
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
          :current-page="mitraStore.currentPage"
          :total-pages="mitraStore.totalPages"
          :total-datas="mitraStore.totalDatas"
          :per-page="mitraStore.perPage"
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
        :columns-visible="['no', 'img:logo', 'nama']"
      />
    </div>
    <div
      class="bg-[#202742] flex shadow justify-between items-center px-5 py-4 border-t-2"
    >
      <h1 class="text-sm text-yellow font-thin">
        Menampilkan {{ perpage }} dari {{ mitraStore.totalDatas }} data
      </h1>

      <WidgetsButtonBaseButton
        @click="navigateTo('/admin/profil/mitra/tambah-mitra')"
        size="sm"
        variant="outline"
      >
        Tambah Data
      </WidgetsButtonBaseButton>
    </div>
  </div>

  <WidgetsPopupAlert
    v-if="showAlert"
    label="Anda Yakin Menghapus Data Mitra ?"
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
import GalleryAdd from "~/components/icons/GalleryAdd.vue";
import Search from "~/components/icons/Search.vue";
import Trash from "~/components/icons/Trash.vue";
import { useMyMitraStore } from "~/store/mitra";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const search = ref("");

const showAlert = ref(false);
const showToast = ref(false);

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

function toggleAlert() {
  showAlert.value = !showAlert.value;
}

function toggleToast() {
  showToast.value = !showToast.value;
}

const mitraStore = useMyMitraStore();

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

const { data, loading, tableHeaders, currentPage } = storeToRefs(mitraStore);

const axios = useAxios();

const id = ref("");

const perpage = ref(mitraStore.perPage);

function loadData() {
  mitraStore.getData({
    search: search.value,
    per_page: perpage.value,
    page: 1,
  });
}

const handlePageChange = (page: any) => {
  mitraStore.currentPage = page;
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
    label: "Dokumentasi",
    onClick: handleDokumentasiClick,
    btnVariant: "secondary",
    icon: GalleryAdd,
  },
  {
    label: "Hapus",
    onClick: handleDeleteClick,
    btnVariant: "danger",
    icon: Trash,
  },
];

function handleDokumentasiClick(row: any) {
  navigateTo(`/admin/profil/mitra/dokumentasi/${row.id}`);
}

function handleUpdateClick(row: any) {
  navigateTo(`/admin/profil/mitra/edit-mitra/${row.id}`);
}

function handleDeleteClick(row: any) {
  toggleAlert();
  id.value = row.id;
}

async function handleHapus() {
  const deleteRequest = await axios.delete(`/api/mitra/${id.value}`);

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
