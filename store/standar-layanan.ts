import { defineStore } from "pinia";
import type { TDatatableResponse } from "~/types/datatatable.response";

// Tipe data untuk setiap baris Standar Layanan yang diterima dari API
type TStandarLayanan = {
  id: number;
  judul: string;
  kategori: string;
  createdAt: string; // Backend biasanya mengirim tanggal dalam format ISO string
};

// Tipe data respons datatable dari API
type TDatatableData = TDatatableResponse & {
  data: TStandarLayanan[];
};

export const useMyStandarLayananStore = defineStore({
  id: "myStandarLayananStore",
  state: () => ({
    // State untuk paginasi dan data
    currentPage: 1,
    totalPages: 1,
    perPage: 5,
    data: [] as any[], // Akan berisi data yang sudah diformat untuk tabel
    totalDatas: 0,
    loading: false,

    // Header untuk komponen Datatable
    tableHeaders: ["Judul Layanan", "Kategori", "Tanggal Dibuat", "Aksi"],
  }),
  actions: {
    async getData(payload: { search: string; per_page: number; page: number }) {
      this.loading = true;
      this.data = []; // Kosongkan data sebelum fetch baru

      const axios = useAxios();

      try {
        // Panggil endpoint API untuk standar layanan
        const request = await axios.get<TDatatableData>(
          "/api/standar-layanan/data",
          {
            params: payload,
          }
        );

        // Mapping data dari API ke format yang dibutuhkan oleh Datatable
        request.data.data.map((element, index: number) => {
          const { id, judul, kategori, createdAt } = element;

          const tempData = {
            nomor: (request.data.currentPage - 1) * this.perPage + index + 1,
            id,
            judul,
            kategori,
            // Ubah nama 'createdAt' menjadi 'tanggal' agar bisa digunakan di 'columns-visible'
            tanggal: new Date(createdAt).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }),
          };

          this.data.push(tempData);
        });

        // Update state paginasi dari respons API
        this.currentPage = request.data.currentPage || 1;
        this.totalPages = request.data.totalPages || 1;
        this.totalDatas = request.data.totalDatas || 0;
      } catch (error) {
        console.error("Gagal mengambil data Standar Layanan:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
