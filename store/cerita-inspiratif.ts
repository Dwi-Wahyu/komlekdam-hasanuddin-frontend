import { defineStore } from "pinia";
import type { TDatatableResponse } from "~/types/datatatable.response";
interface ResData {
  msg: string;
  data: any;
  status: string;
}

type TCeritaInspiratif = {
  id: number;
  judul: string;
  deskripsi: string;
};

type TDatatableData = TDatatableResponse & {
  data: TCeritaInspiratif[];
};

export const useMyCeritaInspiratifStore = defineStore({
  id: "myCeritaInspiratifStore",
  state: () => ({
    currentPage: 1,
    totalPages: 10,
    perPage: 5,
    data: [] as any[],
    totalDatas: 50,
    tableHeaders: ["No", "Judul Cerita", "Deskripsi Singkat", "Aksi"],
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
        const request = await axios.get<TDatatableData>(
          "/api/cerita-inspiratif/data",
          {
            params: payload,
          }
        );

        request.data.data.map((element, index: number) => {
          const { id, judul, deskripsi } = element;

          let tempData = {
            no: index + 1,
            id,
            judul,
            deskripsi,
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
