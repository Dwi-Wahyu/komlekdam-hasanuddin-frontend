<template>
  <div
    class="w-full flex items-center justify-center top-0 left-0 fixed bg-black/50 h-screen z-50"
  >
    <div
      :class="startAnimation ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      class="bg-[#303949] p-7 text-white max-w-96 relative min-w-72 flex items-center justify-center flex-col gap-2 rounded-2xl transition-all ease-in-out duration-300"
    >
      <h1 class="font-semibold text-lg">{{ label }}</h1>
      <IconsAlert />
      <h1 class="text-center">{{ sublabel }}</h1>

      <div class="w-full mt-3 flex justify-center gap-3">
        <WidgetsButtonBaseButton
          @click="toggleModal"
          size="sm"
          variant="outline"
        >
          Batalkan
        </WidgetsButtonBaseButton>

        <WidgetsButtonBaseButton @click="handleConfirm" size="sm">
          Konfirmasi
        </WidgetsButtonBaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    default: "",
  },
  sublabel: {
    default: "",
  },
});

const emit = defineEmits(["close", "confirm"]);

const startAnimation = ref(false);

function toggleModal() {
  emit("close");
}

function handleConfirm() {
  emit("confirm");
}

onMounted(() => {
  setTimeout(() => {
    startAnimation.value = true;
  }, 1);
});
</script>
