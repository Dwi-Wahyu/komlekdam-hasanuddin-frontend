<template>
  <div
    class="w-full text-white flex items-center flex-col justify-center top-0 left-0 fixed bg-black/50 min-h-screen z-50"
  >
    <div
      class="min-w-96 transition-all duration-300 ease-in-out"
      :class="startAnimation ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    >
      <div class="p-6 pt-4 bg-[#30394a] shadow w-[65vw]">
        <div class="w-full flex flex-col">
          <div class="relative">
            <WidgetsJudulSection :text="title" />

            <button class="absolute right-0 top-0" @click="toggleModal">
              <IconsX fill="#fff" />
            </button>
          </div>
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["close"]);

defineProps({
  title: {
    type: String,
    default: "Modal Box",
  },
  theme: {
    type: String,
    default: "light",
  },
});

const startAnimation = ref(false);

function toggleModal() {
  emit("close");
}

onMounted(() => {
  setTimeout(() => {
    startAnimation.value = true;
  }, 1);
});
</script>
