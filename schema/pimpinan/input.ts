import { mixed, object, string, type InferType } from "yup";

export const inputPimpinanSchema = object({
  nama: string().required("Tolong ketik nama"),
  jabatan: string().required("Tolong pilih jabatan"),
  pasfoto: mixed<File>()
    .required("Tolong pilih pasfoto")
    .test("fileSize", "File terlalu besar", (value) => {
      if (!value) return false;
      const file = value instanceof FileList ? value[0] : value;
      return file && file.size <= 5 * 1024 * 1024; // Maksimal 5MB
    })
    .test("fileType", "Format file tidak didukung", (value) => {
      if (!value) return false;
      const file = value instanceof FileList ? value[0] : value;
      return (
        file && ["image/jpeg", "image/png", "image/gif"].includes(file.type)
      );
    }),
});

export type TInputPimpinanSchema = InferType<typeof inputPimpinanSchema>;
