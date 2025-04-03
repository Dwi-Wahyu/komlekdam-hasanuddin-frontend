import { mixed, object, string, type InferType } from "yup";

export const inputKomentarSchema = object({
  nama: string().required("Tolong ketik nama"),
  isi: string().required("Tolong ketik isi komentar"),
});

export type TInputKomentarSchema = InferType<typeof inputKomentarSchema>;
