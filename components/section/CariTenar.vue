<script setup lang="ts">
const audioElement = ref<HTMLAudioElement | null>(null);

const isPlayed = ref(false);

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

const audioSource = ref("");

type TJadwalLagu = {
  id: number;
  laguPath: string;
  judul: string;
  durasi: string;
  mulai: string;
  selesai: string;
};

type TLiveYoutube = {
  id: number;
  link: string;
  thumbnailPath: string;
};

type TResponse = {
  jadwalSekarang: TJadwalLagu;
  modeStreaming: {
    nomor: number;
    label: string;
    value: string;
  };
  adaJadwal: boolean;
};

const showToast = ref(false);

function toggleToast() {
  showToast.value = !showToast.value;
}

const { data } = await useMyFetch<TResponse>("/api/jadwal-lagu", {
  lazy: true,
});

const { data: liveyoutubeData, pending: liveyoutubePending } =
  await useMyFetch<TLiveYoutube>("/api/live-youtube", {
    lazy: true,
  });

const togglePlay = () => {
  isPlayed.value = !isPlayed.value;

  if (!audioElement.value) {
    return;
  }

  if (data.value?.modeStreaming.value === "false" && !data.value.adaJadwal) {
    toggleToast();
  }

  if (isPlayed.value) {
    audioElement.value.play();
  } else {
    audioElement.value.pause();
  }
};
</script>

<template>
  <WidgetsPopupErrorToast
    v-if="showToast"
    @close="toggleToast"
    label="Belum ada jadwal lagu pada saat ini"
  />

  <div v-if="data">
    <audio
      ref="audioElement"
      v-if="data?.modeStreaming.value === 'true'"
      src="https://a7.alhastream.com:4190/radio"
    ></audio>
    <audio
      ref="audioElement"
      v-else
      :src="`${baseURL}/jadwal-lagu/${data.jadwalSekarang.laguPath}`"
    ></audio>
  </div>

  <div
    class="bg-[url('/backgrounds/profil-cari-tenar1.jpeg')] md:hidden bg-center bg-cover w-full h-full"
  >
    <div
      class="flex p-5 gap-10 flex-col h-full md:flex-row pt-20 bg-black/70 w-full"
    >
      <div class="flex gap-2 flex-col">
        <h1 class="text-xl text-yellow text-center font-bold">Cari Tenar</h1>
        <h1>
          Cari Tenar merupakan platform streaming sekaligus wadah untuk
          cerita-cerita inspiratif bagi keluarga besar prajurit Komlekdam XIV/
          Hasanuddin.
        </h1>
        <div v-if="liveyoutubePending">
          <h1>Loading . . .</h1>
        </div>
        <div
          v-else-if="liveyoutubeData"
          class="relative cursor-pointer flex justify-center"
          @click="
            navigateTo(liveyoutubeData.link, {
              external: true,
            })
          "
        >
          <NuxtImg
            :src="`${baseURL}/live-youtube/${liveyoutubeData?.thumbnailPath}`"
            class="object-cover"
            alt=""
          />
          <div
            class="absolute left-0 top-0 w-full h-full flex items-center justify-center"
          >
            <IconsYoutube />
          </div>
        </div>
      </div>

      <div class="flex items-end relative">
        <button @click="togglePlay" class="absolute">
          <IconsPlayFrame />
          <div class="absolute top-0 left-0 w-full h-full pl-3">
            <div v-if="!isPlayed" class="flex items-center gap-1 w-full h-full">
              <IconsPlay />
              <IconsWave />
            </div>
            <div v-else class="flex items-center gap-1 w-full h-full">
              <IconsStop />
              <div
                v-if="data?.modeStreaming.value === 'false'"
                class="flex flex-col"
              >
                <h1 class="text-sm">{{ data?.jadwalSekarang.judul }}</h1>
                <div class="flex gap-1 text-xs">
                  <h1>{{ data?.jadwalSekarang.mulai }}</h1>
                  -
                  <h1>{{ data?.jadwalSekarang.selesai }}</h1>
                </div>
              </div>
              <div v-else>
                <h1 class="text-sm">Al-Ikhwan 101,9 FM</h1>
              </div>
            </div>
          </div>
        </button>

        <img src="/image/cari-tenar/2.png" alt="" />
      </div>
    </div>
  </div>
  <div
    class="bg-[url('/backgrounds/profil-cari-tenar1.jpeg')] md:block hidden bg-center bg-cover w-full h-screen"
  >
    <div
      class="flex p-5 px-32 pt-36 pb-24 gap-10 items-end flex-col h-full md:flex-row justify-center bg-black/70 w-full"
    >
      <div class="flex gap-2 flex-col">
        <h1 class="text-xl text-yellow text-center font-bold">Cari Tenar</h1>
        <h1>
          Cari Tenar merupakan platform streaming sekaligus wadah untuk
          cerita-cerita inspiratif bagi keluarga besar prajurit Komlekdam XIV/
          Hasanuddin.
        </h1>
        <div v-if="liveyoutubePending">
          <h1>Loading . . .</h1>
        </div>
        <div
          v-else-if="liveyoutubeData"
          class="relative cursor-pointer flex justify-center"
          @click="
            navigateTo(liveyoutubeData.link, {
              external: true,
            })
          "
        >
          <NuxtImg
            :src="`${baseURL}/live-youtube/${liveyoutubeData?.thumbnailPath}`"
            class="object-cover md:max-w-[39rem]"
            alt=""
          />
          <div
            class="absolute left-0 top-0 w-full h-full flex items-center justify-center"
          >
            <IconsYoutube />
          </div>
        </div>
      </div>
      <div class="flex items-end relative">
        <button @click="togglePlay" class="absolute">
          <IconsPlayFrame />
          <div class="absolute top-0 left-0 w-full h-full pl-3">
            <div v-if="!isPlayed" class="flex items-center gap-1 w-full h-full">
              <IconsPlay />
              <IconsWave />
            </div>
            <div v-else class="flex items-center gap-1 w-full h-full">
              <IconsStop />
              <div class="flex flex-col">
                <h1 class="text-sm">{{ data?.jadwalSekarang.judul }}</h1>
                <div class="flex gap-1 text-xs">
                  <h1>{{ data?.jadwalSekarang.mulai }}</h1>
                  -
                  <h1>{{ data?.jadwalSekarang.selesai }}</h1>
                </div>
              </div>
            </div>
          </div>
        </button>

        <img src="/image/cari-tenar/2.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
