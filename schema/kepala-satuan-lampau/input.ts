// import { mixed, object, string, type InferType } from "yup";

// export const inputKepalaSatuanLampauSchema = object({
//   nama: string().required("Tolong ketik nama"),
//   jabatan: string().required("Tolong ketik nama jabatan"),
//   periode: string().required("Tolong ketik masa jabatan"),
//   pasfoto: mixed<File>()
//     .required("Tolong pilih pasfoto")
//     .test("fileSize", "File terlalu besar", (value) => {
//       if (!value) return false;
//       const file = value instanceof FileList ? value[0] : value;
//       return file && file.size <= 5 * 1024 * 1024; // Maksimal 5MB
//     })
//     .test("fileType", "Format file tidak didukung", (value) => {
//       if (!value) return false;
//       const file = value instanceof FileList ? value[0] : value;
//       return (
//         file && ["image/jpeg", "image/png", "image/gif"].includes(file.type)
//       );
//     }),
// });

// export type TInputKepalaSatuanLampauSchema = InferType<
//   typeof inputKepalaSatuanLampauSchema
// >;

import { mixed, object, type InferType } from "yup";

export const inputKepalaSatuanLampauSchema = object({
  foto: mixed<File>()
    .required("Tolong pilih foto")
    .test("fileSize", "File terlalu besar", (value) => {
      if (!value) return false;
      const file = value instanceof FileList ? value[0] : value;
      return file && file.size <= 20 * 1024 * 1024; // Maksimal 20MB
    })
    .test("fileType", "Format file tidak didukung", (value) => {
      if (!value) return false;
      const file = value instanceof FileList ? value[0] : value;
      return (
        file && ["image/jpeg", "image/png", "image/gif"].includes(file.type)
      );
    }),
});

export type TInputKepalaSatuanLampauSchema = InferType<
  typeof inputKepalaSatuanLampauSchema
>;
