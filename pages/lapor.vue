<template>
  <div
    class="bg-[url('/backgrounds/lapor-b1.jpeg')] bg-center bg-cover w-full h-screen"
  >
    <div
      class="flex w-full gap-5 text-yellow h-full bg-black/50 justify-center flex-col items-center"
    >
      <h1 class="text-5xl font-bold">Lapor!</h1>
      <div class="w-[30vw] border border-yellow"></div>
      <h1 class="text-2xl">"Sigap, Cepat, Tanggap"</h1>
      <WidgetsButtonBaseButton
        @click="handleBuatLaporan"
        variant="outline"
        class="mt-5 border-yellow"
      >
        Buat Laporan
      </WidgetsButtonBaseButton>

      <WidgetsButtonBaseButton
        @click="
          navigateTo('https://lapor.go.id/instansi/hubdam-xivhsn', {
            external: true,
          })
        "
        class="mt-5 border-yellow"
      >
        SP4N
      </WidgetsButtonBaseButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "landing",
});

function handleBuatLaporan() {
  navigateTo("/buat-laporan");
}
</script>
