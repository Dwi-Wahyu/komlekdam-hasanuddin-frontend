<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
        @click.self="$emit('close')"
      >
        <div class="w-full max-w-md rounded-xl bg-second p-6 shadow-2xl">
          <h1 class="text-xl font-semibold text-font-white text-center mb-4">
            Standar Pemeliharaan
          </h1>
          <h1 class="text-sm text-yellow text-center mb-4">
            Ketuk dimanapun diluar kotak untuk keluar dari menu
          </h1>

          <div class="grid grid-cols-2 gap-4">
            <button
              v-for="idx in [0, 1, 2, 3]"
              :key="idx"
              @click="
                navigateTo(
                  `${baseURL}/standar-layanan/${getValue('har-' + idx)}`,
                  {
                    external: true,
                  }
                )
              "
              class="w-full rounded-lg bg-yellow py-2.5 font-bold text-white transition hover:bg-opacity-90"
            >
              HAR TINGKAT {{ idx }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

interface StandarLayananItem {
  label: string;
  value: string;
  type: "link" | "document" | "image" | "video";
  fileUrl?: string;
}

// Definisikan props
const props = defineProps({
  data: {
    type: Array as PropType<StandarLayananItem[]>,
    default: [],
  },
});

function getValue(label: string) {
  return props.data?.filter((value) => value.label === label)[0].value;
}

defineEmits(["close"]);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
