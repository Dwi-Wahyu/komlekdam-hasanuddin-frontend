import { defineStore } from "pinia";
import type { TDatatableResponse } from "~/types/datatatable.response";
interface ResData {
  msg: string;
  data: any;
  status: string;
}

export type TLaporanType = {
  id: string;
  nama: string;
  email: string;
  nomor: string;
  pesan: string;
  diajukan_pada: string;
};

type TDatatableData = TDatatableResponse & {
  data: TLaporanType[];
};

export const useMyLaporanStore = defineStore({
  id: "myLaporanStore",
  state: () => ({
    currentPage: 1,
    totalPages: 10,
    perPage: 5,
    data: [] as any[],
    totalDatas: 50,
    tableHeaders: ["No", "Nama", "Pesan", "Diajukan Pada", "Aksi"],
    step: 1,
    error: false,
    error_data: null as ResData | null,
    responseData: null as ResData | null,
    loading: false,
  }),
  actions: {
    async getData(payload: any) {
      this.loading = true;
      this.error = false;
      this.error_data = null;
      this.data = [];

      const axios = useAxios();

      try {
        const request = await axios.get<TDatatableData>("/api/laporan/data", {
          params: payload,
        });

        request.data.data.map((element, index: number) => {
          const { nama, id, pesan, email, nomor, diajukan_pada } = element;

          let tempData = {
            no: index + 1,
            id,
            nama,
            pesan,
            email,
            nomor,
            diajukan_pada,
          };

          this.data.push(tempData);
        });

        this.currentPage = request.data.currentPage || 1;
        this.totalPages = request.data.totalPages || 1;
        this.totalDatas = request.data.totalDatas || 5;

        this.loading = false;
      } catch (error) {}
    },
  },
});
