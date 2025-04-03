<template>
  <div
    class="w-full fixed z-50 top-0 left-0 h-screen flex items-center justify-center bg-black/50"
  >
    <div
      class="bg-[#303949] p-7 relative min-w-72 flex items-center justify-center flex-col gap-6 rounded-2xl"
    >
      <button @click="toggleModal" class="absolute text-white right-4 top-4">
        <IconsX width="17" height="17" fill="white" />
      </button>
      <div class="w-40 h-40 mt-2 relative flex items-center justify-center">
        <!-- Lingkaran latar belakang (lebih tebal) -->
        <div
          class="absolute w-full h-full rounded-full border-[6px] border-red-500"
        ></div>
        <!-- Garis silang pertama (\) -->
        <div class="absolute line line-1"></div>
        <!-- Garis silang kedua (/) -->
        <div class="absolute line line-2"></div>
      </div>
      <h1 class="text-white font-semibold text-lg">{{ label }}</h1>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: "Error Terjadi!",
  },
});

const emit = defineEmits(["close"]);

function toggleModal() {
  emit("close");
}
</script>

<style scoped>
.line {
  height: 6px; /* Lebih tebal */
  background-color: #ff4d4f;
  width: 0;
  border-radius: 3px;
}

.line-1 {
  transform: rotate(45deg);
  animation: extendLine 0.3s forwards 0.1s;
}

.line-2 {
  transform: rotate(-45deg);
  animation: extendLine 0.3s forwards 0.4s;
}

@keyframes extendLine {
  from {
    width: 0;
    opacity: 0;
    transform-origin: center;
    transform: rotate(var(--rotation)) scaleX(0);
  }
  to {
    width: 80px; /* Sesuaikan panjang garis */
    opacity: 1;
    transform-origin: center;
    transform: rotate(var(--rotation)) scaleX(1);
  }
}

.line-1 {
  --rotation: 45deg;
}

.line-2 {
  --rotation: -45deg;
}
</style>
