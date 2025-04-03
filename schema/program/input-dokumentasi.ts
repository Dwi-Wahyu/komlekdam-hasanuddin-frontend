import { mixed, object, string, type InferType } from "yup";

export const inputDokumentasiProgramSchema = object({
  gambar: mixed<File>()
    .required("Tolong pilih gambar")
    .test("fileSize", "File terlalu besar", (value) => {
      if (!value) return false;
      const file = value instanceof FileList ? value[0] : value;
      return file && file.size <= 500 * 1024 * 1024; // Maksimal 500MB
    })
    .test("fileType", "Format file tidak didukung", (value) => {
      if (!value) return false;
      const file = value instanceof FileList ? value[0] : value;
      return (
        file && ["image/jpeg", "image/png", "image/gif"].includes(file.type)
      );
    }),
});

export type TInputDokumentasiProgramSchema = InferType<
  typeof inputDokumentasiProgramSchema
>;
