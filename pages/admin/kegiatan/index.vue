<template>
  <div class="flex flex-col">
    <h1 class="text-xl mb-4 font-semibold">Kegiatan</h1>

    <div
      class="bg-[#30394a] px-5 py-4 border-b-2 items-center flex justify-between"
    >
      <h1 class="text-kg font-semibold text-yellow">Kegiatan</h1>

      <WidgetsDataInputBaseInput placeholder="Cari Kegiatan" v-model="search" />

      <WidgetsDataInputBaseSelect
        :options="perpageOptions"
        v-model:model-value="perpage"
      />
    </div>
    <div class="px-5 py-4 bg-[#202742]">
      <WidgetsDatatable
        :headers="tableHeaders"
        :data="data"
        :loading="loading"
        :show-button-action="true"
        :actions="actions"
        :columns-visible="['nomor', 'judul', 'tanggal', 'kategori']"
      />
    </div>
    <div
      class="bg-[#202742] shadow flex justify-between items-center px-5 py-4 border-t-2"
    >
      <h1 class="text-sm text-yellow font-thin">
        Menampilkan {{ perpage }} dari {{ kegiatanStore.totalDatas }} data
      </h1>

      <WidgetsButtonBaseButton
        @click="navigateTo('/admin/kegiatan/tambah-kegiatan')"
        size="sm"
        variant="outline"
      >
        Tambah Program
      </WidgetsButtonBaseButton>
    </div>
  </div>

  <WidgetsPopupToast
    v-if="showToast"
    label="Berhasil menghapus kegiatan"
    @close="toggleToast"
  />

  <WidgetsPopupAlert
    v-if="showAlert"
    label="Yakin menghapus kegiatan?"
    sublabel="Aksi ini akan menghapus kegiatan beserta dokumentasi terkait"
    @close="toggleAlert"
    @confirm="handleHapus"
  />
</template>

<script setup lang="ts">
import Edit from "~/components/icons/Edit.vue";
import GalleryAdd from "~/components/icons/GalleryAdd.vue";
import Trash from "~/components/icons/Trash.vue";
import { useMyKegiatanStore } from "~/store/kegiatan";

definePageMeta({
  middleware: "auth",
  layout: "default",
});

const search = ref("");

const kegiatanStore = useMyKegiatanStore();

const showAlert = ref(false);

const axios = useAxios();
const showToast = ref(false);

function toggleAlert() {
  showAlert.value = !showAlert.value;
}
function toggleToast() {
  showToast.value = !showToast.value;
}

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

const perpage = ref(kegiatanStore.perPage);

const { data, loading, tableHeaders, currentPage } = storeToRefs(kegiatanStore);
const id = ref("");

function loadData() {
  kegiatanStore.getData({
    search: search.value,
    per_page: perpage.value,
    page: currentPage.value,
  });
}

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
    onClick: handleHapusClick,
    btnVariant: "danger",
    icon: Trash,
  },
];

function handleDokumentasiClick(row: any) {
  navigateTo(`/admin/kegiatan/dokumentasi/${row.id}`);
}

function handleUpdateClick(row: any) {
  console.log(row);
  navigateTo("/admin/kegiatan/edit/" + row.id);
}

function handleHapusClick(row: any) {
  id.value = row.id;
  toggleAlert();
}

async function handleHapus() {
  const deleteRequest = await axios.delete(`/api/kegiatan/${id.value}`);

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
