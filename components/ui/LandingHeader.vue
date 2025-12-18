<template>
  <div
    class="w-full px-5 py-6 fixed z-40 top-0 left-0 flex items-center justify-between"
  >
    <div class="flex items-center gap-2">
      <img src="/logo/logo-kapota-baru.png" alt="" class="w-7 h-7" />
      <h1 class="font-bold text-lg md:text-xl">KOMLEKDAM XIV/Hasanuddin</h1>
    </div>
    <button class="md:hidden" @click="toggleIsOpen">
      <IconsBurger />
    </button>
    <div class="hidden gap-4 items-center md:flex">
      <div v-for="(nav, navIdx) in navigationMenu">
        <button
          v-if="!nav.child"
          class="text-sm text-yellow hover:underline underline-offset-4"
          @click="navigate(nav.path)"
          :class="[{ underline: link == nav.path }]"
          :key="navIdx"
        >
          {{ nav.label }}
        </button>
        <div v-else class="relative text-yellow">
          <button
            class="text-sm flex items-center gap-1 hover:underline mt-1 underline-offset-4"
            @click="toggleDropdown"
          >
            PPID

            <IconsChevron
              :class="{ 'rotate-180': !showDropdown }"
              width="16"
              height="16"
            />
          </button>

          <div
            class="absolute min-w-56 flex items-start gap-2 mt-1 flex-col top-7 left-4"
            v-if="showDropdown"
          >
            <button
              class="text-sm hover:underline underline-offset-4"
              @click="navigateTo('/ppid/profil')"
            >
              Profil PPID
            </button>

            <button
              class="text-sm hover:underline underline-offset-4"
              @click="navigateTo('/ppid/struktur-organisasi')"
            >
              Struktur Organisasi PPID
            </button>

            <button
              class="text-sm hover:underline underline-offset-4"
              @click="navigateTo('/ppid/tugas-dan-tanggung-jawab')"
            >
              Tugas dan Tanggung Jawab PPID
            </button>

            <button
              class="text-sm hover:underline items-center flex gap-1 underline-offset-4"
              @click="toggleSecondDropdown"
            >
              Permohonan Informasi
              <IconsChevron
                :class="{ 'rotate-180': !showSecondDropdown }"
                width="16"
                height="16"
              />
            </button>

            <div
              v-if="showSecondDropdown"
              class="absolute flex flex-col gap-2 -bottom-14 left-5"
            >
              <a
                class="text-sm hover:underline items-center flex gap-1 underline-offset-4"
                href="https://docs.google.com/forms/d/e/1FAIpQLScIAZXUCS682rQLvKFYdIxbqbKHlSQY7A8sVe-Bjsb9VbMnJQ/viewform"
                target="_blank"
              >
                Isi Formulir
              </a>

              <a
                class="text-sm hover:underline items-center flex gap-1 underline-offset-4"
                href="https://docs.google.com/document/d/1Z-bpr2cXoyJggs4PFTg4KZzPNxLv602q/edit?tab=t.0"
                target="_blank"
              >
                Unduh Formulir
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="transition-all duration-300 left-0 bg-[#1B1B1B] fixed z-50 ease-in-out px-5 py-6 w-full h-screen md:hidden"
    :class="[{ 'top-0': isOpen }, { '-top-[100vh]': !isOpen }]"
  >
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-2">
        <img src="/logo/komlekdam.svg" class="w-[7vw]" alt="" />
        <h1 class="font-semibold">KOMLEKDAM XIV/Hasanuddin</h1>
      </div>
      <button @click="toggleIsOpen">
        <IconsChevronCircle />
      </button>
    </div>

    <div class="flex flex-col items-center gap-7">
      <div v-for="(nav, navIdx) in navigationMenu">
        <button
          v-if="!nav.child"
          class="text-yellow"
          :href="nav.path"
          :key="navIdx"
          @click="navigate(nav.path)"
        >
          {{ nav.label }}
        </button>

        <div
          v-else
          class="relative flex items-center flex-col gap-2 text-yellow"
        >
          <button
            class="text-sm flex items-center justify-center gap-1 hover:underline mt-1 underline-offset-4"
            @click="toggleDropdown"
          >
            PPID

            <IconsChevron
              :class="{ 'rotate-180': !showDropdown }"
              width="16"
              height="16"
            />
          </button>

          <div
            class="min-w-56 flex bg-white rounded-lg text-black p-3 items-center gap-2 mt-1 flex-col top-7 left-4"
            v-if="showDropdown"
          >
            <button
              class="text-sm hover:underline underline-offset-4"
              @click="navigateTo('/ppid/profil')"
            >
              Profil PPID
            </button>

            <button
              class="text-sm hover:underline underline-offset-4"
              @click="navigateTo('/ppid/struktur-organisasi')"
            >
              Struktur Organisasi PPID
            </button>

            <button
              class="text-sm hover:underline underline-offset-4"
              @click="navigateTo('/ppid/tugas-dan-tanggung-jawab')"
            >
              Tugas dan Tanggung Jawab PPID
            </button>

            <button
              class="text-sm hover:underline items-center flex gap-1 underline-offset-4"
              @click="toggleSecondDropdown"
            >
              Permohonan Informasi
              <IconsChevron
                :class="{ 'rotate-180': !showSecondDropdown }"
                width="16"
                height="16"
              />
            </button>

            <div
              v-if="showSecondDropdown"
              class="flex flex-col items-center gap-2"
            >
              <a
                class="text-sm hover:underline items-center flex gap-1 underline-offset-4"
                href="https://docs.google.com/forms/d/e/1FAIpQLScIAZXUCS682rQLvKFYdIxbqbKHlSQY7A8sVe-Bjsb9VbMnJQ/viewform"
                target="_blank"
              >
                Isi Formulir
              </a>

              <a
                class="text-sm hover:underline items-center flex gap-1 underline-offset-4"
                href="https://docs.google.com/document/d/1Z-bpr2cXoyJggs4PFTg4KZzPNxLv602q/edit?tab=t.0"
                target="_blank"
              >
                Unduh Formulir
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMyLandingPageStore } from "~/store/landing-page-store";

type Navigation = {
  label: string;
  path: string;
  child?: string[];
};

const showDropdown = ref(false);
const showSecondDropdown = ref(false);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function toggleSecondDropdown() {
  showSecondDropdown.value = !showSecondDropdown.value;
}

const landingPageStore = useMyLandingPageStore();

const { link } = storeToRefs(landingPageStore);

const isOpen = ref(false);

function toggleIsOpen() {
  isOpen.value = !isOpen.value;
}

function navigate(route: string) {
  landingPageStore.changeLink(route);
  toggleIsOpen();
  navigateTo(route);
}

const navigationMenu: Navigation[] = [
  { label: "Home", path: "/" },
  { label: "Profil", path: "/profil" },
  { label: "Berita", path: "/berita" },
  { label: "Zona Integritas", path: "/zona-integritas" },
  {
    label: "PPID",
    path: "/ppid",
    child: [],
  },
  { label: "Kegiatan", path: "/kegiatan" },
  { label: "Litbang", path: "/litbang" },
  { label: "Cari Tenar", path: "/cari-tenar" },
  { label: "Lapor!", path: "/lapor" },
  { label: "Standar Layanan", path: "/standar-layanan" },
];
</script>
