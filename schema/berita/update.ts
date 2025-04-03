import { mixed, object, string, type InferType } from "yup";

export const updateBeritaSchema = object({
  judul: string().required("Tolong ketik judul"),
  penulis: string().required("Tolong ketik penulis"),
  lokasi: string().required("Tolong ketik lokasi"),
  deskripsi: string().required("Tolong ketik deskripsi"),
  tanggal: string().required("Tolong ketik tanggal"),
  kategori: string().required("Tolong pilih kategori"),
  detail: string().required("Tolong ketik detail"),
});

export type TUpdateBeritaSchema = InferType<typeof updateBeritaSchema>;
