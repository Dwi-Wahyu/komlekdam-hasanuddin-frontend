import { defineStore } from "pinia";
import type { TDatatableResponse } from "~/types/datatatable.response";
interface ResData {
  msg: string;
  data: any;
  status: string;
}

type TBerita = {
  judul: string;
  tanggal: string;
  penulis: string;
  kategori: string;
  id: string;
};

type TDatatableData = TDatatableResponse & {
  data: TBerita[];
};

export const useMyBeritaStore = defineStore({
  id: "myBeritaStore",
  state: () => ({
    currentPage: 1,
    totalPages: 10,
    perPage: 5,
    data: [] as any[],
    totalDatas: 50,
    tableHeaders: [
      "No",
      "Judul Berita",
      "Tanggal Berita",
      "Penulis",
      "Kategori",
      "Aksi",
    ],
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
        const request = await axios.get<TDatatableData>("/api/berita/data", {
          params: payload,
        });

        request.data.data.map((element, index: number) => {
          const { id, judul, tanggal, kategori, penulis } = element;

          let tempData = {
            nomor: index + 1,
            id,
            judul,
            tanggal,
            penulis,
            kategori,
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
