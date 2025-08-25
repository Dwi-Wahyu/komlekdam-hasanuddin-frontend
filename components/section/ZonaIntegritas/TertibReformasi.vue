<template>
  <div>
    <div
      class="bg-[url('/backgrounds/zona-integritas1.svg')] w-full h-screen bg-center bg-cover"
    >
      <div
        class="w-full p-5 md:p-0 bg-black/50 h-full flex items-center justify-center flex-col"
      >
        <h1
          class="font-bold text-[#999462] md:mb-[20rem] mb-[15rem] text-2xl md:text-5xl"
        >
          Komlekdam XIV Hasanuddin
        </h1>

        <h1
          class="text-xl font-semibold md:text-3xl text-center text-[#999462]"
        >
          “Menuju Wilayah Bebas Korupsi dan Wilayah Birokrasi Bersih <br />
          dan Melayani”
        </h1>
      </div>
    </div>

    <div class="p-5 sm:px-10 sm:py-12">
      <WidgetsJudulSection
        text="Zona Integritas Komlekdam XIV/Hasanuddin"
        subtext="Menuju Wilayah Tertib Reformasi Birokrasi"
      />

      <div class="flex items-center justify-center sm:gap-10 gap-5 flex-wrap">
        <button @click="showDocPreview('/dokumen/1.pdf')">
          <img src="/image/juknis/1.png" alt="" />
          <h1>Jukgar Reformasi Birokrasi</h1>
        </button>
        <button @click="showDocPreview('/dokumen/2.pdf')">
          <img src="/image/juknis/2.png" alt="" />
          <h1>Juknis Zona Integritas</h1>
        </button>
        <button @click="showDocPreview('/dokumen/3.pdf')">
          <img src="/image/juknis/3.png" alt="" />
          <h1>Panduan Pengisian LKE</h1>
        </button>
      </div>
    </div>
  </div>

  <WidgetsPopupDocPreview
    v-if="showPreview"
    @close="togglePreview"
    :doc-url="docUrl"
  />
</template>

<script setup>
const showPreview = ref(false);
const docUrl = ref("");

function togglePreview() {
  showPreview.value = !showPreview.value;
}

function showDocPreview(url) {
  docUrl.value = url;
  togglePreview();
}
</script>
