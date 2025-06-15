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
          <WidgetsButtonStandarLayanan
            @click="showQrCode('kta')"
            add-class="bg-blue"
          >
            Barcode KTA
          </WidgetsButtonStandarLayanan>

          <WidgetsButtonStandarLayanan
            @click="showQrCode('kpi')"
            add-class="bg-blue"
          >
            Barcode KPI
          </WidgetsButtonStandarLayanan>

          <WidgetsButtonStandarLayanan add-class="bg-blue">
            <NuxtLink
              :to="`${baseURL}/standar-layanan/${getValue('surat-telegram')}`"
              target="_blank"
              :external="true"
              class="bg-blue"
            >
              Surat Telegram (ST)
            </NuxtLink>
          </WidgetsButtonStandarLayanan>
        </div>

        <div v-else class="flex h-full flex-col items-center justify-center">
          <p class="mb-4 text-center text-gray-400">
            Area ini dilindungi password.
          </p>
          <WidgetsButtonStandarLayanan
            @click="toggleShowModal"
            add-class="bg-danger"
          >
            Buka Akses Internal
          </WidgetsButtonStandarLayanan>
        </div>
      </div>

      <div
        class="flex flex-col rounded-lg bg-second border border-yellow p-6 shadow-lg"
      >
        <h2 class="mb-6 text-center text-2xl font-bold text-green">
          <span class="mr-2">🌐</span>EKSTERNAL
        </h2>

        <div class="flex flex-col space-y-4">
          <WidgetsButtonStandarLayanan add-class="bg-green">
            <NuxtLink
              :to="getValue('minmathub')"
              target="_blank"
              :external="true"
            >
              Layanan MINMATHUB
            </NuxtLink>
          </WidgetsButtonStandarLayanan>

          <WidgetsButtonStandarLayanan add-class="bg-green">
            <NuxtLink
              :to="`${baseURL}/standar-layanan/${getValue('surat-edaran')}`"
              target="_blank"
              :external="true"
            >
              Surat Edaran (SE)
            </NuxtLink>
          </WidgetsButtonStandarLayanan>

          <WidgetsButtonStandarLayanan
            @click="toggleShowStandarPemeliharaan"
            add-class="bg-green"
          >
            Standar Pemeliharaan
          </WidgetsButtonStandarLayanan>
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

    <WidgetsPopupStandarPemeliharaan
      v-if="showStandaPemeliharaanPopup && data"
      @close="toggleShowStandarPemeliharaan"
      :data="data"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "landing",
});

import { ref } from "vue";

const showStandaPemeliharaanPopup = ref(false);

interface StandarLayananItem {
  label: string;
  value: string;
  type: "link" | "document" | "image" | "video";
  fileUrl?: string;
}

const { data, error } = await useMyFetch<StandarLayananItem[]>(
  "/api/standar-layanan",
  {
    lazy: true,
    server: false,
  }
);

function getValue(label: string) {
  return data.value?.filter((value) => value.label === label)[0].value;
}

function toggleShowStandarPemeliharaan() {
  showStandaPemeliharaanPopup.value = !showStandaPemeliharaanPopup.value;
}

const isQrModalVisible = ref(false);
const qrModalTitle = ref("");
const qrModalImageUrl = ref("");

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

const showQrCode = (type: string) => {
  if (type === "kta") {
    qrModalTitle.value = "Scan QR Code KTA";
    qrModalImageUrl.value = baseURL + "/standar-layanan/" + getValue("qr-kta");
  } else if (type === "kpi") {
    qrModalTitle.value = "Scan QR Code KPI";
    qrModalImageUrl.value =
      baseURL + "/standar-layanan/qrcode-kpi.jpg" + getValue("qr-kpi");
  }
  isQrModalVisible.value = true;
};

const closeQrModal = () => {
  isQrModalVisible.value = false;
};

const showModal = ref(false);
const isInternalUnlocked = ref(false);

function toggleShowModal() {
  showModal.value = !showModal.value;
}

const unlockInternal = () => {
  isInternalUnlocked.value = true;
  showModal.value = false;
};
</script>
