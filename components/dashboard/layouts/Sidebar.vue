<template>
  <div
    class="flex w-full flex-col gap-2 h-full bg-[#303949] shadow-[7px_7px_0px_0px_rgba(0,0,0,0.2)] rounded-[12px]"
    :class="store.sidebarActive ? 'p-4' : 'p-2'"
  >
    <div class="flex flex-col items-center gap-4" v-if="!store.sidebarActive">
      <div>
        <NuxtImg src="/logo/logo.png" />
      </div>

      <div class="flex" v-for="(item, index) in store.menu">
        <img
          :src="
            store.parentActive == item.route
              ? `/icons/${item.icon}.svg`
              : `/icons/${item.icon2}.svg`
          "
          class="w-6 cursor-pointer"
          alt=""
          @click="store.actionSidebar"
        />
      </div>
    </div>

    <div v-if="store.sidebarActive" class="flex gap-2">
      <NuxtImg src="/logo/logo.png" sizes="600px" />
      <div>
        <h1 class="font-semibold text-yellow">Admin Panel</h1>
        <h1 class="text-white text-xs">Landing Page Komlekdam XIV/Hsn</h1>
      </div>
    </div>

    <div class="flex flex-col gap-1" v-if="store.sidebarActive">
      <div
        class="flex flex-col"
        v-for="(item, index) in store.menu"
        @click="store.changeParent(item.route)"
      >
        <div
          v-if="!item.restrictedRoles?.includes(authStore.user?.role as string)"
        >
          <h1
            v-if="item.type == 'menuName'"
            class="text-sm font-semibold text-white pt-3 pb-1"
          >
            {{ item.title }}
          </h1>
          <nuxt-link
            :to="item.route"
            class="flex flex-row gap-4 p-2 rounded-lg cursor-pointer hover:bg-second"
            v-if="item.child.length == 0 && item.type == 'parent'"
            :class="store.parentActive == item.route ? 'bg-second' : ''"
          >
            <!-- {{ item.child.length ? 'asd' : 'aa' }} -->
            <img
              :src="
                store.parentActive == item.route
                  ? `/icons/${item.icon}.svg`
                  : `/icons/${item.icon2}.svg`
              "
              class="w-6"
              alt=""
            />
            <h1
              class="text-white"
              :class="
                store.parentActive == item.route ? 'font-bold' : 'font-base'
              "
            >
              {{ item.title }}
            </h1>
          </nuxt-link>
          <div
            class="flex flex-row gap-4 p-2 rounded-lg cursor-pointer hover:bg-second"
            v-if="item.child.length > 0"
            :class="store.parentActive.includes(item.route) ? 'bg-second' : ''"
          >
            <!-- {{ item.child.length ? 'asd' : 'aa' }} -->
            <img
              :src="
                store.parentActive.includes(item.route)
                  ? `/icons/${item.icon}.svg`
                  : `/icons/${item.icon2}.svg`
              "
              class="w-6"
              alt=""
            />
            <h1
              class="text-white"
              :class="
                store.parentActive.includes(item.route)
                  ? 'font-bold'
                  : 'font-base'
              "
            >
              {{ item.title }}
            </h1>
          </div>
          <transition name="fade">
            <div
              class="flex flex-col gap-2 pl-12 p-2 bg-second rounded-b-lg"
              v-if="
                item.child.length > 0 && store.parentActive.includes(item.route)
              "
            >
              <div
                class="flex flex-row"
                v-for="(itemChild, indexChild) in item.child"
              >
                <nuxt-link :to="itemChild.route" class="text-white">
                  <h1
                    :class="
                      route.path == itemChild.route ? 'font-bold' : 'font-base'
                    "
                  >
                    {{ itemChild.title }}
                  </h1>
                </nuxt-link>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div class="flex justify-center">
        <button @click="store.actionSidebar">
          <IconsChevron width="26" height="26" class="-rotate-90" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from "~/store/auth";
import { useMySidebarStore } from "~/store/sidebar";

const store = useMySidebarStore();
const route = useRoute();
const authStore = useMyAuthStore();

onMounted(async () => {
  store.changeParent(route.path);
});
</script>

<style scoped>
/* Tambahkan efek fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
