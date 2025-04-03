<template>
  <div class="bg-[#172b4c] p-5 w-full md:px-7 md:py-6 min-h-screen h-full">
    <div class="flex mt-2 text-white relative float-end items-center gap-6">
      <div class="flex items-center gap-3">
        <IconsUser />
        <h1>{{ authStore.user?.username }}</h1>
      </div>

      <div class="relative flex items-center">
        <button @click="toggleDropdown">
          <IconsGear />
        </button>

        <div
          v-if="showDropdown"
          class="bg-white rounded-lg shadow min-w-32 text-black flex flex-col absolute right-0 top-7 z-50"
        >
          <button
            @click="handleLogout"
            class="px-3 py-2 flex items-center gap-2 hover:bg-slate-200 rounded-t-lg"
          >
            <IconsLogout />
            Logout
          </button>
          <button
            class="px-3 py-2 flex items-center gap-2 hover:bg-slate-200 rounded-b-lg"
          >
            <IconsProfile />
            Profil
          </button>
        </div>
      </div>
      <IconsBell />
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { useMyAuthStore } from "~/store/auth";

const authStore = useMyAuthStore();

const showDropdown = ref(false);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function handleLogout() {
  authStore.token = "";
  authStore.user = null;
  navigateTo("/masuk");
}
</script>
