<template>
  <div class="relative">
    <label v-if="label" :for="id" class="block text-sm font-bold mb-2">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      v-bind="bindAttr"
      :required="required"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="[error ? 'border-danger' : 'border-yellow', variantClasses]"
    />

    <div class="absolute right-0 bottom-0 pb-[0.4rem] pr-3" v-if="withIcon">
      <component :is="icon"></component>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  required: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
  error: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: "normal",
  },
  bindAttr: {
    type: Object,
    default: () => ({}),
  },
  withIcon: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: [Object, Function],
    default: null,
  },
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case "normal":
      return "block w-full px-3 py-2 border bg-[#1d2941] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm";
    case "outline":
      return "block w-full px-3 py-2 border-b border-yellow bg-transparent focus:outline-none";
    default:
      return "";
  }
});
</script>
