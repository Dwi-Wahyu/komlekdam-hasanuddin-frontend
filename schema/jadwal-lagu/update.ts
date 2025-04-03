import { mixed, object, string, type InferType } from "yup";

export const updateJadwalLaguSchema = object({
  judul: string().required("Tolong ketik judul"),
  mulai: string().required("Tolong tentukan waktu mulai"),
  selesai: string().required("Tolong tentukan waktu selesai"),
});

export type TUpdateJadwalLaguSchema = InferType<typeof updateJadwalLaguSchema>;
