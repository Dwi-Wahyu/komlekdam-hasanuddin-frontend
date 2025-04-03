import { object, string, type InferType } from "yup";

export const updateMitraSchema = object({
  nama: string().required("Tolong ketik nama"),
});

export type TUpdateMitraSchema = InferType<typeof updateMitraSchema>;
