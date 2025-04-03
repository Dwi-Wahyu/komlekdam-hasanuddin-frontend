<template>
  <div class="w-full p-5 py-10 pb-16">
    <h1
      class="text-yellow text-xl font-bold"
      id="tentang-kami"
      @click="navigateTo('https://github.com/Dwi-Wahyu', { external: true })"
    >
      Tentang Kami
    </h1>
    <div class="flex flex-col items-center md:flex-row gap-12 md:px-5 mt-4">
      <div class="flex flex-col gap-3">
        <img
          class="sm:hidden mb-3 mt-1"
          src="/public/image/tentang-kami/1.png"
          alt=""
        />

        <h1 class="font-bold text-2xl">KOMLEKDAM XIV/HASANUDDIN</h1>

        <p>
          Komunikasi dan Elektronika Kodam XIV/Hsn yang selanjutnya disebut
          Komlekdam XIV/Hsn adalah salah satu Badan Pelaksana Tingkat Kodam
          berkedudukan langsung di bawah Pangdam XIV/Hsn dengan tugas pokok
          menyelenggarakan Peperangan Elektronika (Pernika), Komunikasi dan
          Elektronika, Sistem Komando Pengendalian (Siskodal) dan Informasi,
          Foto Film Militer, serta Konstruksi, Pembekalan, Pemeliharaan,
          Instalasi (Konbekharstal) materiel perhubungan dalam rangka mendukung
          tugas pokok Kodam.
        </p>
        <WidgetsButtonBaseButton
          variant="outline"
          @click="navigateTo('/komlekdam')"
          class="border-yellow hover:bg-yellow hover:text-white transition-all duration-300 ease-in-out text-yellow w-fit"
        >
          Selengkapnya
        </WidgetsButtonBaseButton>
      </div>

      <img
        class="hidden sm:block"
        src="/public/image/tentang-kami/1.png"
        alt=""
      />
    </div>
    <div class="mt-10">
      <WidgetsJudulSection text="JAJARAN KOMLEKDAM XIV/HASANUDDIN" />
      <div class="flex w-full flex-col gap-7">
        <div
          class="flex group"
          v-for="(temp, tempIdx) in jajaran"
          :key="tempIdx"
          :class="{ 'justify-end': (tempIdx + 1) % 2 == 0 }"
        >
          <div
            class="flex bg-[#303949] md:w-[70vw] items-center md:flex-row flex-col w-full border-[3.35px] border-yellow gap-5 p-5 md:p-7"
          >
            <div class="overflow-hidden w-full">
              <img
                :src="temp.imgUrl"
                alt=""
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div class="flex flex-col gap-2">
              <h1 class="text-lg text-yellow font-semibold">
                {{ temp.title }}
              </h1>
              <p class="text-sm">
                {{ temp.desc }}
              </p>
              <WidgetsButtonBaseButton
                variant="outline"
                size="sm"
                @click="navigateTo(temp.pathSelengkapnya)"
                class="border-yellow mt-1 hover:bg-yellow hover:text-white transition-all duration-300 ease-in-out text-yellow w-fit"
              >
                Selengkapnya
              </WidgetsButtonBaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Jajaran = {
  title: string;
  desc: string;
  imgUrl: string;
  pathSelengkapnya: string;
};

const jajaran: Jajaran[] = [
  {
    title: "DENKOMLEKDAM XIV/HASANUDDIN",
    desc: `Detasemen Komunikasi dan Elektronika (Denkomlek) Kodam XIV/Hsn yang selanjutnya disebut Denkomlekdam XIV/Hsn adalah salah satu Unsur Pelaksana Komlekdam di Tingkat Kodam XIV/Hsn berkedudukan langsung di bawah Kakomlekdam XIV/Hsn dengan tugas pokok menyelenggarakan kegiatan di bidang Gelar Komunikasi, Instalasi terbatas sarana Komlek, melaksanakan kegiatan Pernika dan Foto Film Militer di wilayah Kodam XIV/Hsn.`,
    imgUrl: "/image/tentang-kami/2.png",
    pathSelengkapnya: "/denkomlekdam",
  },
  {
    title: "DENKOMLEK KOREM 141",
    desc: `Detasemen Komunikasi dan Elektronika Korem 141 yang selanjutnya disebut Denkomlek Korem 141 adalah salah satu Badan Pelaksana Tingkat Korem berkedudukan langsung di bawah Kakomlekdam XIV/Hsn dengan tugas pokok menyelenggarakan kegiatan Komunikasi dan Elektronika yang meliputi Komunikasi, Pernika dan Foto Film Militer dan Konbekharstal Mathub dalam rangka mendukung tugas pokok Komlekdam di wilayah Korem 141/TP.`,
    imgUrl: "/image/tentang-kami/3.png",
    pathSelengkapnya: "/denkomlek-korem141",
  },
  {
    title: "DENKOMLEK KOREM 142",
    desc: `Detasemen Komunikasi dan Elektronika Korem 142 yang selanjutnya disebut Denkomlek Korem 142 adalah salah satu Badan Pelaksana Tingkat Korem berkedudukan langsung di bawah Kakomlekdam XIV/Hsn dengan tugas pokok menyelenggarakan kegiatan Komunikasi dan Elektronika yang meliputi Komunikasi, Pernika dan Foto Film Militer dan Konbekharstal Mathub dalam rangka mendukung tugas pokok Komlekdam di wilayah Korem 142/Tatag.`,
    imgUrl: "/image/tentang-kami/4.png",
    pathSelengkapnya: "/denkomlek-korem142",
  },
  {
    title: "DENKOMLEK KOREM 143",
    desc: `Detasemen Komunikasi dan Elektronika Korem 143 yang selanjutnya disebut Denkomlek Korem 143 adalah salah satu Badan Pelaksana Tingkat Korem berkedudukan langsung di bawah Kakomlekdam XIV/Hsn dengan tugas pokok menyelenggarakan kegiatan Komunikasi dan Elektronika yang meliputi Komunikasi, Pernika dan Foto Film Militer dan Konbekharstal Mathub dalam rangka mendukung tugas pokok Komlekdam di wilayah Korem 143/HO.`,
    imgUrl: "/image/tentang-kami/5.png",
    pathSelengkapnya: "/denkomlek-korem143",
  },
];
</script>
