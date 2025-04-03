import { mixed, object, string, type InferType } from "yup";

export const inputJadwalLaguSchema = object({
  judul: string().required("Tolong ketik judul"),
  mulai: string().required("Tolong tentukan waktu mulai"),
  selesai: string().required("Tolong tentukan waktu selesai"),
  lagu: mixed<File>()
    .required("Tolong pilih file lagu")
    .test("fileSize", "Ukuran file maksimal 10MB", (value) => {
      if (!value) return false;
      const file = value instanceof FileList ? value[0] : value;
      return file && file.size <= 10 * 1024 * 1024;
    })
    .test("fileType", "Hanya format audio yang didukung", (value) => {
      if (!value) return false;
      const file = value instanceof FileList ? value[0] : value;
      const supportedTypes = [
        "audio/mpeg", // MP3
        "audio/wav", // WAV
        "audio/ogg", // OGG
        "audio/x-wav", // WAV alternatif
        "audio/x-m4a", // M4A
        "audio/aac", // AAC
      ];
      return file && supportedTypes.includes(file.type);
    }),
});

export type TInputJadwalLaguSchema = InferType<typeof inputJadwalLaguSchema>;
