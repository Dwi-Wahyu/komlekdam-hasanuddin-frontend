import { mixed, object, string, type InferType } from "yup";

export const updateKegiatanSchema = object({
  judul: string().required("Tolong ketik judul"),
  tanggal: string().required("Tolong ketik tanggal"),
  deskripsi: string().required("Tolong ketik deskripsi"),
  kategori: string().required("Tolong pilih kategori"),
  detail: string().required("Tolong ketik detail"),
});

export type TUpdateKegiatanSchema = InferType<typeof updateKegiatanSchema>;
