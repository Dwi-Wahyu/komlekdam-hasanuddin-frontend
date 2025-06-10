import { object, string, mixed, type InferType } from "yup";

export const inputStandarLayananSchema = object({
  judul: string().required("Judul layanan tidak boleh kosong"),
  kategori: string().required("Kategori layanan tidak boleh kosong"),
  deskripsi: string().required("Deskripsi layanan tidak boleh kosong"),

  gambar: mixed<File>()
    .optional()
    // !! PERUBAHAN KUNCI DI SINI !!
    // Memberi tahu Yup secara eksplisit apa nilai defaultnya jika tidak ada.
    // Ini sangat membantu saat inisialisasi di sisi server (SSR).
    .default(undefined)
    .test(
      "fileSize",
      "Ukuran file gambar terlalu besar, maksimum 2MB",
      (value) => {
        if (!value) return true;
        const file = value instanceof FileList ? value[0] : value;
        if (!file) return true;
        return file.size <= 2 * 1024 * 1024;
      }
    )
    .test(
      "fileType",
      "Format file tidak didukung (hanya .jpg, .jpeg, .png)",
      (value) => {
        if (!value) return true;
        const file = value instanceof FileList ? value[0] : value;
        if (!file) return true;
        return ["image/jpeg", "image/png", "image/gif"].includes(file.type);
      }
    ),
});

export type TInputStandarLayananSchema = InferType<
  typeof inputStandarLayananSchema
>;
