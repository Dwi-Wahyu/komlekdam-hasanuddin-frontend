<template>
  <div v-if="pending" class="animate-pulse">
    <div class="h-7 w-40 bg-gray-700 rounded mb-6"></div>

    <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-[#30394a] rounded-xl p-5 border border-gray-700/50"
      >
        <div class="flex justify-between items-start">
          <div class="flex flex-col gap-3 w-full">
            <div class="h-4 bg-gray-600 rounded w-1/2"></div>
            <div class="h-8 bg-gray-600 rounded w-1/3"></div>
          </div>
          <div
            class="h-12 w-12 bg-gray-600 rounded-lg shrink-0 opacity-50"
          ></div>
        </div>
        <div class="mt-4 h-3 bg-gray-600 rounded w-1/4"></div>
      </div>
    </div>
  </div>
  <div v-else-if="error">
    {{ error }}
  </div>

  <div v-else-if="data" class="">
    <h1 class="text-xl mb-6 font-semibold">Dashboard</h1>
    <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
      <WidgetsDashboardCard
        title="Jumlah Pengunjung Hari Ini"
        :value="data?.pengunjung.hariIni"
        :icon="StatistikToday"
        :change="perubahanPengunjungHarian"
      />
      <WidgetsDashboardCard
        title="Jumlah Pengunjung Minggu Ini"
        :value="data?.pengunjung.mingguIni"
        :icon="StatistikYesterday"
        :change="perubahanPengunjungMingguan"
      />
      <WidgetsDashboardCard
        title="Jumlah Pelaporan Minggu Ini"
        :value="data?.pelaporan.mingguIni"
        :icon="StatistikWeek"
        :change="perubahanPelaporanMingguan"
      />
      <WidgetsDashboardCard
        title="Jumlah Pelaporan Bulan Ini"
        :value="data?.pelaporan.bulanIni"
        :icon="StatistikMonth"
        :change="perubahanPelaporanBulanan"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import StatistikMonth from "~/components/icons/StatistikMonth.vue";
import StatistikToday from "~/components/icons/StatistikToday.vue";
import StatistikWeek from "~/components/icons/StatistikWeek.vue";
import StatistikYesterday from "~/components/icons/StatistikYesterday.vue";

definePageMeta({
  middleware: "auth",
  layout: "default",
});

type TStatistik = {
  pengunjung: {
    hariIni: number;
    kemarin: number;
    mingguIni: number;
    mingguLalu: number;
    bulanIni: number;
    bulanLalu: number;
  };
  pelaporan: {
    mingguIni: number;
    mingguLalu: number;
    bulanIni: number;
    bulanLalu: number;
  };
  perubahanPengunjung: {
    harian: number;
    mingguan: number;
  };
  perubahanPelaporan: {
    mingguan: number;
    bulanan: number;
  };
};

const perubahanPengunjungHarian = ref("");
const perubahanPengunjungMingguan = ref("");
const perubahanPelaporanMingguan = ref("");
const perubahanPelaporanBulanan = ref("");

function cekPerubahan(change: number, placeholder: string) {
  if (change === 0) {
    return `Tidak Ada Perubahan ${placeholder}`;
  } else if (change > 0) {
    return `+${change.toFixed()}% ${placeholder}`;
  } else {
    return `${change.toFixed()}% ${placeholder}`;
  }
}

const { data, pending, error } = useMyFetch<TStatistik>("/api/statistik", {
  lazy: true,
  transform: (response) => {
    perubahanPengunjungHarian.value = cekPerubahan(
      response.perubahanPengunjung.harian,
      "Sejak Kemarin"
    );
    perubahanPengunjungMingguan.value = cekPerubahan(
      response.perubahanPengunjung.mingguan,
      "Sejak Minggu Kemarin"
    );
    perubahanPelaporanMingguan.value = cekPerubahan(
      response.perubahanPelaporan.mingguan,
      "Sejak Minggu Kemarin"
    );
    perubahanPelaporanBulanan.value = cekPerubahan(
      response.perubahanPelaporan.bulanan,
      "Sejak Bulan Kemarin"
    );

    return response;
  },
});
</script>
