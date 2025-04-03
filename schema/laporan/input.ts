import { object, string, type InferType } from "yup";

export const inputLaporanSchema = object({
  nama: string().required("Tolong ketik nama"),
  nomor: string().required("Tolong ketik nomor"),
  email: string().email("Email tidak valid").required("Tolong ketik email"),
  pesan: string().required("Tolong ketik pesan"),
});

export type TInputLaporanSchema = InferType<typeof inputLaporanSchema>;
