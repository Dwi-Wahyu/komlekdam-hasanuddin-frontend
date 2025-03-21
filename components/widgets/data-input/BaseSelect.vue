<template>
  <div class="relative">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-semibold mb-2"
      :class="color"
    >
      {{ label }} <span v-if="require" class="text-danger">*</span>
    </label>

    <IconsChevron
      width="18"
      height="18"
      class="-rotate-180 absolute right-3 bottom-[0.6rem]"
    />

    <select
      :id="id"
      v-model="selectedValue"
      @change="handleChange"
      :placeholder="placeholder"
      :class="[
        padding,
        error ? 'border-danger' : 'border-yellow',
        baseClass,
        'appearance-none pr-10',
      ]"
    >
      <option
        class="bg-[#30394a]"
        v-for="(option, idx) in options"
        :key="idx"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";

// Props untuk menerima data dari parent
const props = defineProps({
  modelValue: String | Number, // Nilai terpilih
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  label: {
    type: String,
    default: "",
  },
  require: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  padding: {
    type: String,
    default: "px-3 py-2",
  },
  error: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: "normal",
  },
  placeholder: {
    type: String,
    default: "Placeholder",
  },
});

const baseClass = computed(() => {
  switch (props.variant) {
    case "normal":
      return "block w-full px-3 py-2 border bg-[#1d2941] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm";
    case "underline":
      return "block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b border-yellow appearance-none focus:outline-none focus:ring-0 peer";
  }
});

// Emit untuk mengirim event ke parent
const emit = defineEmits(["update:modelValue"]);

// State lokal untuk nilai terpilih
const selectedValue = ref("");

// Sinkronkan nilai modelValue dengan selectedValue
watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue;
  },
  { immediate: true }
);

// Emit event saat nilai berubah
const handleChange = () => {
  emit("update:modelValue", selectedValue.value);
};
</script>
