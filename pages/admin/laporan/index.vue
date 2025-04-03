<template>
  <div>
    <h1 class="text-xl mb-4 font-semibold">User</h1>

    <div
      class="bg-[#30394a] mt-4 px-5 py-4 border-b-2 items-center flex justify-between"
    >
      <h1 class="text-kg font-semibold text-yellow">List User</h1>

      <WidgetsDataInputBaseInput
        placeholder="Cari User"
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
          :current-page="laporanStore.currentPage"
          :total-pages="laporanStore.totalPages"
          :total-datas="laporanStore.totalDatas"
          :per-page="laporanStore.perPage"
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
        :columns-visible="['no', 'nama', 'pesan', 'diajukan_pada']"
      />
    </div>
    <div
      class="bg-[#202742] flex shadow justify-between items-center px-5 py-4 border-t-2"
    >
      <h1 class="text-sm text-yellow font-thin">
        Menampilkan {{ perpage }} dari {{ laporanStore.totalDatas }} data
      </h1>

      <WidgetsButtonBaseButton
        @click="handleExport"
        variant="outline"
        class="flex gap-2 items-center"
      >
        <IconsExcel />
        Export Excel
      </WidgetsButtonBaseButton>
    </div>
  </div>

  <WidgetsPopupAlert
    v-if="showAlert"
    label="Anda Yakin Menghapus Laporan ?"
    @close="toggleAlert"
    @confirm="handleHapus"
  />

  <WidgetsPopupToast
    v-if="showToast"
    label="Berhasil Menghapus Laporan"
    @close="toggleToast"
  />

  <WidgetsPopupModal
    title="Informasi Laporan"
    :show-action="false"
    v-if="showModal"
    @close="toggleModal"
  >
    <div class="flex flex-col gap-2">
      <div>
        <h1 class="font-semibold">Nama</h1>
        <h1>{{ nama }}</h1>
      </div>

      <div>
        <h1 class="font-semibold">Nomor</h1>
        <h1>{{ nomor }}</h1>
      </div>

      <div>
        <h1 class="font-semibold">Email</h1>
        <h1>{{ email }}</h1>
      </div>

      <div>
        <h1 class="font-semibold">Pesan</h1>
        <h1>{{ pesan }}</h1>
      </div>

      <div>
        <h1 class="font-semibold">Diajukan Pada</h1>
        <h1>{{ diajukan_pada }}</h1>
      </div>
    </div>
  </WidgetsPopupModal>
</template>

<script setup lang="ts">
import moment from "moment";
import Eye from "~/components/icons/Eye.vue";
import Search from "~/components/icons/Search.vue";
import Trash from "~/components/icons/Trash.vue";
import { useMyLaporanStore } from "~/store/laporan";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const search = ref("");

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

const showAlert = ref(false);
const showToast = ref(false);
const showModal = ref(false);

function toggleAlert() {
  showAlert.value = !showAlert.value;
}

function toggleToast() {
  showToast.value = !showToast.value;
}

function toggleModal() {
  showModal.value = !showModal.value;
}

const laporanStore = useMyLaporanStore();

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

const { data, loading, tableHeaders, currentPage } = storeToRefs(laporanStore);

const nama = ref("");
const nomor = ref("");
const email = ref("");
const pesan = ref("");
const diajukan_pada = ref("");

const axios = useAxios();

const id = ref("");

const perpage = ref(laporanStore.perPage);

function loadData() {
  laporanStore.getData({
    search: search.value,
    per_page: perpage.value,
    page: currentPage.value,
  });
}

const handlePageChange = (page: any) => {
  laporanStore.currentPage = page;
  loadData();
};

const actions = [
  {
    label: "Detail",
    onClick: handleDetailClick,
    btnVariant: "primary",
    icon: Eye,
  },
  {
    label: "Hapus",
    onClick: handleDeleteClick,
    btnVariant: "danger",
    icon: Trash,
  },
];

function handleDetailClick(row: any) {
  nama.value = row.nama;
  email.value = row.email;
  nomor.value = row.nomor;
  pesan.value = row.pesan;
  diajukan_pada.value = row.diajukan_pada;

  toggleModal();
}

function handleDeleteClick(row: any) {
  toggleAlert();
  id.value = row.id;
}

async function handleExport() {
  try {
    const response = await axios.get("/api/laporan/export-excel", {
      responseType: "blob", // Penting!
    });

    const datetime = moment().format("YYYY_MM_DD-HH_mm");
    const relativePath = datetime + ".xlsx";

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", relativePath);
    document.body.appendChild(link);
    link.click();
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  } catch (error: any) {
    console.log(error);

    alert("Belum ada laporan");
  }
}

async function handleHapus() {
  const deleteRequest = await axios.delete(`/api/laporan/${id.value}`);

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
