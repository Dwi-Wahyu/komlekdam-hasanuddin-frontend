import { mixed, object, string, type InferType } from "yup";

export const updateStandarLayananSchema = object({
  label: string().required("Tolong ketik label"),
  value: string().optional(),
  file: mixed<File>()
    .optional()
    .test("fileSize", "File terlalu besar, ukuran maksimum 1GB", (value) => {
      if (!value) return true;
      const file = value instanceof FileList ? value[0] : value;
      return file && file.size <= 1024 * 1024 * 1024;
    }),
}).test(
  "either-value-or-file",
  "Harus menyertakan link atau file",
  (data) => !!data.value || !!data.file
);

export type TUpdateStandarLayananSchema = InferType<
  typeof updateStandarLayananSchema
>;
