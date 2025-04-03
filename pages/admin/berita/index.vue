<template>
  <div class="flex flex-col">
    <h1 class="text-xl mb-4 font-semibold">Berita</h1>

    <div
      class="bg-[#30394a] px-5 py-4 border-b-2 items-center flex justify-between"
    >
      <h1 class="text-kg font-semibold text-yellow">List Berita</h1>

      <WidgetsDataInputBaseInput
        placeholder="Cari Progam"
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
          :current-page="beritaStore.currentPage"
          :total-pages="beritaStore.totalPages"
          :total-datas="beritaStore.totalDatas"
          :per-page="beritaStore.perPage"
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
        :columns-visible="['nomor', 'judul', 'tanggal', 'penulis', 'kategori']"
      />
    </div>
    <div
      class="bg-[#202742] flex shadow justify-between items-center px-5 py-4 border-t-2"
    >
      <h1 class="text-sm text-yellow font-thin">
        Menampilkan {{ perpage }} dari {{ beritaStore.totalDatas }} data
      </h1>

      <WidgetsButtonBaseButton
        @click="navigateTo('/admin/berita/tambah-berita')"
        size="sm"
        variant="outline"
      >
        Tambah Berita
      </WidgetsButtonBaseButton>
    </div>
  </div>

  <WidgetsPopupAlert
    v-if="showAlert"
    label="Yakin menghapus berita ?"
    @close="toggleAlert"
    @confirm="handleHapus"
  />

  <WidgetsPopupToast
    v-if="showToast"
    label="Berhasil menghapus berita"
    @close="toggleToast"
  />
</template>

<script setup lang="ts">
import Edit from "~/components/icons/Edit.vue";
import Eye from "~/components/icons/Eye.vue";
import Search from "~/components/icons/Search.vue";
import Trash from "~/components/icons/Trash.vue";
import { useMyAuthStore } from "~/store/auth";
import { useMyBeritaStore } from "~/store/berita";

definePageMeta({
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

const beritaStore = useMyBeritaStore();

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

const { data, loading, tableHeaders, currentPage } = storeToRefs(beritaStore);

const authStore = useMyAuthStore();

const id = ref();
const axios = useAxios();

const perpage = ref(beritaStore.perPage);

function loadData() {
  beritaStore.getData({
    id_user: authStore.user?.id,
    search: search.value,
    per_page: perpage.value,
    page: 1,
  });
}

const handlePageChange = (page: any) => {
  beritaStore.currentPage = page;
  loadData();
};

const actions = [
  {
    label: "Edit",
    onClick: handleUpdateClick,
    icon: Edit,
  },
  {
    label: "Detail",
    onClick: handleDetailClick,
    icon: Eye,
  },
  {
    label: "Hapus",
    onClick: handleHapusClick,
    icon: Trash,
  },
];

function handleUpdateClick(row: any) {
  console.log(row);
  navigateTo(`/admin/berita/edit-berita/${row.id}`);
}

function handleDetailClick(row: any) {
  console.log(row.id);

  navigateTo("/admin/berita/" + row.id);
}

function handleHapusClick(row: any) {
  id.value = row.id;
  toggleAlert();
}

async function handleHapus() {
  const deleteRequest = await axios.delete(`/api/berita/${id.value}`);

  if (deleteRequest.data.success) {
    loadData();
    toggleAlert();
    toggleToast();
  }
}

watch([search], () => {
  loadData();
});

onMounted(() => {
  loadData();
});
</script>
