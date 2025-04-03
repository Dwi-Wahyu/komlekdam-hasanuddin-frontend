import { mixed, object, string, type InferType } from "yup";

export const updatePenelitianSchema = object({
  judul: string().required("Tolong ketik judul"),
  tanggal: string().required("Tolong ketik tanggal"),
  penulis: string().required("Tolong ketik penulis"),
  deskripsi: string().required("Tolong ketik deskripsi"),
  detail: string().required("Tolong ketik detail"),
});

export type TUpdatePenelitianSchema = InferType<typeof updatePenelitianSchema>;
