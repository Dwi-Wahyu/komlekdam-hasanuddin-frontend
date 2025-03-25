import { mixed, object, string, type InferType } from "yup";

export const updateUserSchema = object({
  nama: string().required("Tolong ketik nama"),
  username: string().required("Tolong ketik username"),
  role: string().required("Tolong pilih role"),
});

export type TUpdateUserSchema = InferType<typeof updateUserSchema>;
