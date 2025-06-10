<template>
  <div
    class="flex min-h-screen flex-col pt-20 sm:pt-0 items-center justify-center bg-second p-4 font-sans"
  >
    <header class="mb-10 text-center">
      <WidgetsJudulSection
        text="Standar Layanan"
        subtext="Pilih menu navigasi yang tersedia"
      />
    </header>

    <main class="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
      <div
        class="flex flex-col rounded-lg bg-second border border-yellow p-6 shadow-lg"
      >
        <h2 class="mb-6 text-center text-2xl font-bold text-orange">
          <span class="mr-2">🔒</span>INTERNAL
        </h2>

        <div v-if="isInternalUnlocked" class="flex flex-col space-y-4">
          <button @click="showQrCode('kta')" class="nav-button bg-blue">
            Barcode KTA
          </button>
          <button @click="showQrCode('kpi')" class="nav-button bg-blue">
            Barcode KPI
          </button>
          <NuxtLink
            :to="`${baseURL}/standar-layanan/surat telegram.pdf`"
            target="_blank"
            :external="true"
            class="nav-button bg-blue"
          >
            Surat Telegram (ST)
          </NuxtLink>
        </div>

        <div v-else class="flex h-full flex-col items-center justify-center">
          <p class="mb-4 text-center text-gray-400">
            Area ini dilindungi password.
          </p>
          <button @click="showModal = true" class="nav-button bg-danger">
            Buka Akses Internal
          </button>
        </div>
      </div>

      <div
        class="flex flex-col rounded-lg bg-second border border-yellow p-6 shadow-lg"
      >
        <h2 class="mb-6 text-center text-2xl font-bold text-green">
          <span class="mr-2">🌐</span>EKSTERNAL
        </h2>

        <div class="flex flex-col space-y-4">
          <NuxtLink
            to="https://forms.gle/HrScPMBPrMtDbe798"
            target="_blank"
            :external="true"
            class="nav-button bg-green"
          >
            Layanan MINMATHUB
          </NuxtLink>
          <NuxtLink
            :to="`${baseURL}/standar-layanan/surat edaran.pdf`"
            target="_blank"
            :external="true"
            class="nav-button bg-green"
          >
            Surat Edaran (SE)
          </NuxtLink>
          <NuxtLink
            to="/eksternal/standar-pemeliharaan"
            class="nav-button bg-green"
          >
            Standar Pemeliharaan
          </NuxtLink>
        </div>
      </div>
    </main>

    <Teleport to="body">
      <WidgetsPopupPasswordModal
        v-if="showModal"
        @close="showModal = false"
        @unlocked="unlockInternal"
      />
    </Teleport>

    <WidgetsPopupQRCode
      v-if="isQrModalVisible"
      :title="qrModalTitle"
      :qr-image-url="qrModalImageUrl"
      @close="closeQrModal"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "landing",
});

import { ref } from "vue";

const isQrModalVisible = ref(false);
const qrModalTitle = ref("");
const qrModalImageUrl = ref("");

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

const showQrCode = (type) => {
  if (type === "kta") {
    qrModalTitle.value = "Scan QR Code KTA";
    qrModalImageUrl.value = baseURL + "/standar-layanan/qrcode-kta.jpg";
  } else if (type === "kpi") {
    qrModalTitle.value = "Scan QR Code KPI";
    qrModalImageUrl.value = baseURL + "/standar-layanan/qrcode-kpi.jpg";
  }
  isQrModalVisible.value = true;
};

const closeQrModal = () => {
  isQrModalVisible.value = false;
};

const showModal = ref(false);
const isInternalUnlocked = ref(false);

const unlockInternal = () => {
  isInternalUnlocked.value = true;
  showModal.value = false;
};
</script>

<style scoped lang="postcss">
/* Kita bisa menambahkan beberapa style global atau style untuk kelas kustom di sini */
body {
  font-family: "Inter", sans-serif; /* Contoh penggunaan font, bisa diganti */
}

/* REKOMENDASI: Mengaktifkan kembali kelas ini membuat template lebih bersih.
  @apply adalah fitur Tailwind untuk menerapkan beberapa utility class ke dalam satu kelas kustom.
*/
.nav-button {
  @apply block w-full rounded-md p-4 text-center text-lg font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105;
}
</style>
