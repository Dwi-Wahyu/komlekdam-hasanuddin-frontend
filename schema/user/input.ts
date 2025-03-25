import { mixed, object, string, type InferType } from "yup";

export const inputUserSchema = object({
  nama: string().required("Tolong ketik nama"),
  username: string().required("Tolong ketik username"),
  password: string().required("Tolong ketik password"),
  confirmPassword: string()
    .required("Tolong ketik confirm password")
    .test(
      "passwords-match",
      "Password dan Confirm Password harus sama",
      function (value) {
        return this.parent.password === value;
      }
    ),
  role: string().required("Tolong pilih role"),
});

export type TInputUserSchema = InferType<typeof inputUserSchema>;
