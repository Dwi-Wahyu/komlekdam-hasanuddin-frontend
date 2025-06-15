<template>
  <button @click="handleClick" :class="[defaultClass, addClass]">
    <slot />
  </button>
</template>

<script setup>
const defaultClass =
  "block w-full rounded-md p-4 text-center text-lg font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105";

const emit = defineEmits(["click"]);

const props = defineProps({
  addClass: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const handleClick = (event) => {
  if (!props.disabled) {
    emit("click", event);
  }
};
</script>
