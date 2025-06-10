<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <div
        class="flex w-full max-w-xs flex-col items-center rounded-xl bg-second p-6 shadow-2xl"
      >
        <h2 class="mb-4 text-2xl font-bold text-yellow">{{ title }}</h2>
        <div class="rounded-lg border-4 border-white bg-white p-2 shadow-inner">
          <NuxtImg
            :src="qrImageUrl"
            alt="QR Code"
            class="h-52 w-52 object-contain"
          />
        </div>
        <p class="mt-4 text-center text-sm text-gray-300">
          Silakan scan kode di atas
        </p>
        <button
          @click="$emit('close')"
          class="mt-6 w-full rounded-lg bg-blue py-2.5 font-bold text-white transition hover:bg-opacity-90"
        >
          Tutup
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
// Komponen ini menerima 'props' dari komponen induk
defineProps({
  title: {
    type: String,
    required: true,
  },
  qrImageUrl: {
    type: String,
    required: true,
  },
});

// Mendefinisikan event yang bisa dikirimkan ke induk
defineEmits(["close"]);
</script>
