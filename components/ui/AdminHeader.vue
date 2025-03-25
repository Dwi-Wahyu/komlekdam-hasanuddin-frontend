<template>
  <div
    class="absolute flex justify-between w-full transition-all duration-300 ease-in-out top-0 left-0 p-4"
    :class="sidebarStore.sidebarActive ? 'pl-[20.5rem]' : 'pl-20'"
  >
    <div></div>

    <div class="flex items-center gap-6">
      <div class="flex items-center gap-3">
        <IconsUser />
        <h1>{{ authStore.user.nama }}</h1>
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
  </div>
</template>

<script setup>
import { useMyAuthStore } from "~/store/auth";
import { useMySidebarStore } from "~/store/sidebar";

const showDropdown = ref(false);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

const sidebarStore = useMySidebarStore();
const authStore = useMyAuthStore();

function handleLogout() {
  authStore.token = null;
  authStore.user = null;
  navigateTo("/masuk");
}
</script>
