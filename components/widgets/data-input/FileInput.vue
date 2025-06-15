<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" class="text-sm font-medium">{{ label }}</label>

    <div class="flex items-center gap-3">
      <input
        type="file"
        :accept="accept"
        class="hidden"
        ref="fileInput"
        @change="handleFileChange"
      />

      <button
        type="button"
        class="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
        @click="$refs.fileInput.click()"
      >
        Pilih File
      </button>

      <span v-if="modelValue?.name" class="text-sm truncate flex-1">
        {{ modelValue.name }}
      </span>
      <span v-else-if="defaultFile" class="text-sm truncate flex-1">
        File saat ini: {{ defaultFile }}
      </span>
      <span v-else class="text-sm text-gray-500 flex-1">
        Belum ada file dipilih
      </span>
    </div>

    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: String,
  accept: {
    type: String,
    default: "*/*",
  },
  modelValue: File,
  error: String,
  defaultFile: String,
});

const emit = defineEmits(["update:modelValue"]);

const fileInput = ref<HTMLInputElement>();

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    emit("update:modelValue", target.files[0]);
  }
};
</script>
