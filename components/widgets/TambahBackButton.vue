<template>
  <div>
    <div class="flex items-center gap-4">
      <button @click="navigateTo(kembaliTo)">
        <IconsArrow class="-rotate-90" />
      </button>
      <div class="text-sm">
        <h1 class="flex gap-2">
          <span class="font-thin">{{ breadcrumb }}</span>
          <span class="font-semibold">{{ pageName }}</span>
        </h1>
        <h1 class="font-semibold">{{ pageName }}</h1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  link: {
    type: String,
    default: "",
  },
  kembaliTo: {
    default: "/admin",
  },
});

const pageName = computed(() => {
  const splitLink = props.link.split("/");

  const lastIndex = splitLink[splitLink.length - 1];

  const splitLastIndex = lastIndex.split("-");

  const pageName = [];

  for (const element of splitLastIndex) {
    const toUpper =
      element[0].toUpperCase() + element.substring(1, element.length);
    pageName.push(toUpper);
  }

  const result = pageName.join(" ");

  return result;
});

const breadcrumb = computed(() => {
  const splitLink = props.link.split("/");

  const parent = splitLink[splitLink.length - 2];

  const toUpper = parent[0].toUpperCase() + parent.substring(1, parent.length);

  return toUpper;
});
</script>
