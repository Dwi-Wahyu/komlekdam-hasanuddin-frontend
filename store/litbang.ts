import { defineStore } from "pinia";
import type { TDatatableResponse } from "~/types/datatatable.response";
interface ResData {
  msg: string;
  data: any;
  status: string;
}

type TDokumentasi = {
  id: number;
  path: string;
};

export type TEachLitbangType = {
  id: number;
  judul: string;
  tanggal: string;
  deskripsi: string;
  detail?: string;
  thumbnailPath?: string;
  videoPath?: string;
  dokumentasi: TDokumentasi[];
};

export type TLitbangType = {
  id: string;
  judul: string;
  tanggal: string;
  penulis: string;
};

type TDatatableData = TDatatableResponse & {
  data: TLitbangType[];
};

export const useMyLitbangStore = defineStore({
  id: "myLitbangStore",
  state: () => ({
    currentPage: 1,
    totalPages: 10,
    perPage: 5,
    data: [] as any[],
    totalDatas: 50,
    tableHeaders: [
      "No",
      "Judul Penelitian",
      "Tanggal Penelitian",
      "Penulis",
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
        const request = await axios.get<TDatatableData>("/api/litbang/data", {
          params: payload,
        });

        request.data.data.map((element, index: number) => {
          const { id, judul, penulis, tanggal } = element;

          let tempData = {
            no: index + 1,
            id,
            judul,
            penulis,
            tanggal,
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
