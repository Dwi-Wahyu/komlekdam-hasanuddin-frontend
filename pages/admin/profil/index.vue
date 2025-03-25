<template>
  <div>
    <h1 class="text-xl mb-4 font-semibold">Profil</h1>
    <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
      <div
        v-for="data in cardData"
        class="flex flex-col justify-between shadow-[7px_7px_0px_0px_rgba(0,0,0,0.2)] p-4 bg-[#303949]"
      >
        <div>
          <h1 class="text-yellow font-semibold">{{ data.title }}</h1>
          <p class="font-thin">{{ data.description }}</p>
        </div>
        <div class="flex justify-end">
          <WidgetsButtonBaseButton
            variant="outline"
            @click="navigateTo(data.bukaLink)"
          >
            Buka
          </WidgetsButtonBaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
  layout: "default",
});

const cardData = [
  {
    title: "Kakomlekdam dan Wakakomlekdam",
    bukaLink: "/admin/profil/pimpinan",
    description:
      "Menu edit Kakomlekdam dan Wakakomlekdam XIV/Hsn periode sekarang",
  },
  {
    title: "Pejabat Satuan",
    bukaLink: "/admin/profil/pejabat-satuan",
    description: "Menu Edit Pejabat Satuan Kakomlekdam XIV/Hsn",
  },
  {
    title: "Kepala Satuan dari masa ke masa",
    bukaLink: "/admin/profil/kepala-satuan-lampau",
    description: "Menu Edit Kakomlekdam XIV/Hsn dari masa ke masa",
  },
  {
    title: "Mitra",
    bukaLink: "/admin/profil/mitra",
    description: "Menu Edit Mitra Satuan Kakomlekdam XIV/Hsn",
  },
];
</script>
