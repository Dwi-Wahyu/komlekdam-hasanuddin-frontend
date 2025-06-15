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

      <div v-if="type === 'success'">
        <IconsCheckCircle />
      </div>

      <div v-else>
        <IconsXCircle />
      </div>

      <h1 class="text-white font-semibold text-lg">{{ label }}</h1>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "success",
    validator: (value) => ["success", "error"].includes(value),
  },
});

const emit = defineEmits(["close"]);

function toggleModal() {
  emit("close");
}
</script>
