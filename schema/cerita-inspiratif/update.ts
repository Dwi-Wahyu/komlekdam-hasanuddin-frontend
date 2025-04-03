import { mixed, object, string, type InferType } from "yup";

export const updateCeritaInspiratifSchema = object({
  judul: string().required("Tolong ketik judul"),
  deskripsi: string().required("Tolong ketik deskripsi"),
});

export type TUpdateCeritaInspiratifSchema = InferType<
  typeof updateCeritaInspiratifSchema
>;
