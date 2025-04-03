<template>
  <div class="bg-[#303949] p-5 sm:p-10 sm:px-20 w-full min-h-screen">
    <WidgetsJudulSection text="Kahubdam Dari Masa Ke Masa" />

    <div class="relative mt-3">
      <div class="flex w-full justify-center items-center absolute z-10">
        <img src="/image/profil/15.png" class="opacity-50 w-[70vw]" alt="" />
      </div>
      <div v-if="pending">
        <h1>Loading . . .</h1>
      </div>
      <div v-if="error">
        <h1>{{ error }}</h1>
      </div>
      <div
        v-if="data"
        class="flex flex-wrap w-full items-center gap-7 justify-center relative z-20 top-0 left-0"
      >
        <template v-for="kakomlekdam_lampau in data">
          <NuxtImg
            :src="`${baseURL}/profil/kakomlekdam_lampau/${kakomlekdam_lampau.fotoPath}`"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const seeMore = ref(false);

function handleSeeMore() {
  seeMore.value = !seeMore.value;
}

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

type TResponse = {
  fotoPath: string;
};

const { data, pending, error } = await useMyFetch<TResponse[]>(
  "/api/kepala-satuan-lampau",
  {
    lazy: true,
  }
);
</script>
