import { mixed, object, string, type InferType } from "yup";

export const inputKegiatanSchema = object({
  judul: string().required("Tolong ketik judul"),
  tanggal: string().required("Tolong ketik tanggal"),
  deskripsi: string().required("Tolong ketik deskripsi"),
  kategori: string().required("Tolong pilih kategori"),
  detail: string().required("Tolong ketik detail"),
  thumbnail: mixed<File>()
    .required("Tolong pilih thumbnail")
    .test("fileSize", "File terlalu besar, ukuran maksimum 1GB", (value) => {
      if (!value) return false;
      const file = value instanceof FileList ? value[0] : value;
      return file && file.size <= 1024 * 1024 * 1024;
    })
    .test("fileType", "Format file tidak didukung", (value) => {
      if (!value) return false;
      const file = value instanceof FileList ? value[0] : value;
      return (
        file && ["image/jpeg", "image/png", "image/gif"].includes(file.type)
      );
    }),

  video: mixed<File>()
    .required("Tolong pilih video")
    .test("fileSize", "File terlalu besar, ukuran maksimum 10GB", (value) => {
      if (!value) return false;
      const file = value instanceof FileList ? value[0] : value;
      return file && file.size <= 10 * 1024 * 1024 * 1024; // Maksimal 10GB
    })
    .test("fileType", "Format file tidak didukung", (value) => {
      if (!value) return false;
      const file = value instanceof FileList ? value[0] : value;
      return (
        file &&
        [
          "video/mp4",
          "video/quicktime",
          "video/x-msvideo",
          "video/x-matroska",
        ].includes(file.type)
      );
    }),

  dokumentasi: mixed<File[]>()
    .required("Tolong sertakan dokumentasi")
    .test(
      "fileSize",
      "File terlalu besar, ukuram maksimum file adalah 1GB",
      (value) => {
        if (!value) return false;

        for (const each of value) {
          if (each.size > 1024 * 1024 * 1024) {
            return false;
          }
        }

        return true;
      }
    )
    .test("fileType", "Format file tidak didukung", (value) => {
      if (!value) return false;

      for (const each of value) {
        if (!["image/jpeg", "image/png", "image/gif"].includes(each.type)) {
          return false;
        }
      }

      return true;
    }),
});

export type TInputKegiatanSchema = InferType<typeof inputKegiatanSchema>;
