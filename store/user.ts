import { defineStore } from "pinia";
import type { TDatatableResponse } from "~/types/datatatable.response";
interface ResData {
  msg: string;
  data: any;
  status: string;
}

export type TUserType = {
  id: string;
  nama: string;
  username: string;
  role: string;
  password?: string;
};

type TDatatableData = TDatatableResponse & {
  data: TUserType[];
};

export const useMyUserStore = defineStore({
  id: "myUserStore",
  state: () => ({
    currentPage: 1,
    totalPages: 10,
    perPage: 5,
    data: [] as any[],
    totalDatas: 50,
    tableHeaders: ["No", "Nama", "Username", "Role"],
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
        const request = await axios.get<TDatatableData>("/api/user/data", {
          params: payload,
        });

        request.data.data.map((element, index: number) => {
          const { nama, id, username, role } = element;

          let tempData = {
            no: index + 1,
            nama,
            username,
            id,
            role,
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
