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
          :current-page="userStore.currentPage"
          :total-pages="userStore.totalPages"
          :total-datas="userStore.totalDatas"
          :per-page="userStore.perPage"
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
        :columns-visible="['no', 'nama', 'username', 'role', 'jabatan']"
      />
    </div>
    <div
      class="bg-[#202742] flex shadow justify-between items-center px-5 py-4 border-t-2"
    >
      <h1 class="text-sm text-yellow font-thin">
        Menampilkan {{ perpage }} dari {{ userStore.totalDatas }} data
      </h1>

      <WidgetsButtonBaseButton
        @click="navigateTo('/admin/user/tambah-user')"
        size="sm"
        variant="outline"
      >
        Tambah User
      </WidgetsButtonBaseButton>
    </div>
  </div>

  <WidgetsPopupAlert
    v-if="showAlert"
    label="Anda Yakin Menghapus Data User ?"
    @close="toggleAlert"
    @confirm="handleHapus"
  />

  <WidgetsPopupToast
    v-if="showToast"
    label="Berhasil Menghapus Data User"
    @close="toggleToast"
  />
</template>

<script setup lang="ts">
import Edit from "~/components/icons/Edit.vue";
import Search from "~/components/icons/Search.vue";
import Trash from "~/components/icons/Trash.vue";
import { useMyUserStore } from "~/store/user";

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

const userStore = useMyUserStore();

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

const { data, loading, tableHeaders, currentPage } = storeToRefs(userStore);

const axios = useAxios();

const id = ref("");

const perpage = ref(userStore.perPage);

function loadData() {
  userStore.getData({
    search: search.value,
    per_page: perpage.value,
    page: 1,
  });
}

const handlePageChange = (page: any) => {
  userStore.currentPage = page;
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
  navigateTo(`/admin/user/edit-user/${row.id}`);
}

function handleDeleteClick(row: any) {
  toggleAlert();
  id.value = row.id;
}

async function handleHapus() {
  const deleteRequest = await axios.delete(`/api/user/${id.value}`);

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
