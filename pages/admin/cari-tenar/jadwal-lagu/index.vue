<template>
  <div>
    <div class="flex gap-1 items-center">
      <button @click="navigateTo('/admin/cari-tenar')">
        <IconsChevron width="20" height="20" class="-rotate-90" />
      </button>
      <WidgetsAdminPageTitle title="Jadwal Lagu" />
    </div>

    <div
      class="bg-[#30394a] mt-4 px-5 py-4 border-b-2 items-center flex justify-between"
    >
      <h1 class="text-kg font-semibold text-yellow">List Lagu dan Jadwalnya</h1>

      <WidgetsDataInputBaseInput
        placeholder="Cari Judul Lagu"
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
          :current-page="jadwalLaguStore.currentPage"
          :total-pages="jadwalLaguStore.totalPages"
          :total-datas="jadwalLaguStore.totalDatas"
          :per-page="jadwalLaguStore.perPage"
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
        :columns-visible="['no', 'judul', 'durasi', 'mulai', 'selesai']"
      />
    </div>
    <div
      class="bg-[#202742] flex shadow justify-between items-center px-5 py-4 border-t-2"
    >
      <h1 class="text-sm text-yellow font-thin">
        Menampilkan {{ perpage }} dari {{ jadwalLaguStore.totalDatas }} data
      </h1>

      <WidgetsButtonBaseButton
        @click="navigateTo('/admin/cari-tenar/jadwal-lagu/tambah-jadwal-lagu')"
        size="sm"
        variant="outline"
      >
        Tambah Jadwal Lagu
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
import { useMyJadwalLaguStore } from "~/store/jadwal-lagu";

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

const jadwalLaguStore = useMyJadwalLaguStore();

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
  storeToRefs(jadwalLaguStore);

const axios = useAxios();

const id = ref("");

const perpage = ref(jadwalLaguStore.perPage);

function loadData() {
  jadwalLaguStore.getData({
    search: search.value,
    per_page: perpage.value,
    page: currentPage,
  });
}

const handlePageChange = (page: any) => {
  jadwalLaguStore.currentPage = page;
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
  navigateTo(`/admin/cari-tenar/jadwal-lagu/edit-jadwal-lagu/${row.id}`);
}

function handleDeleteClick(row: any) {
  toggleAlert();
  id.value = row.id;
}

async function handleHapus() {
  const deleteRequest = await axios.delete(`/api/jadwal-lagu/${id.value}`);

  if (deleteRequest.data.success) {
    toggleAlert();
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
