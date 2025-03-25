<template>
  <div class="text-white">
    <WidgetsTambahBackButton
      link="/admin/user/tambah-user"
      kembali-to="/admin/user"
    />

    <WidgetsJudulSection text="Form Tambah User" class="mt-4" />

    <form @submit="onSubmit" class="px-7 flex flex-col gap-7 py-6 bg-[#30394a]">
      <div>
        <WidgetsDataInputBaseInput
          label="Nama"
          v-model="nama"
          variant="outline"
        />
        <WidgetsErrorInput :error="errors.nama" />
      </div>

      <div>
        <WidgetsDataInputBaseInput
          label="Username"
          v-model="username"
          variant="outline"
        />
        <WidgetsErrorInput :error="errors.username" />
      </div>

      <div>
        <WidgetsDataInputBaseInput
          label="Password"
          v-model="password"
          variant="outline"
        />
        <WidgetsErrorInput :error="errors.password" />
      </div>

      <div>
        <WidgetsDataInputBaseInput
          label="Confirm Password"
          v-model="confirmPassword"
          variant="outline"
        />
        <WidgetsErrorInput :error="errors.confirmPassword" />
      </div>

      <div>
        <WidgetsDataInputBaseSelect
          label="Role"
          :options="roleOptions"
          v-model="role"
          variant="underline"
        />
        <WidgetsErrorInput :error="errors.role" />
      </div>

      <div class="flex justify-center col-span-2">
        <WidgetsButtonBaseButton type="submit" variant="outline">
          Tambah Data
        </WidgetsButtonBaseButton>
      </div>
    </form>
  </div>

  <WidgetsPopupToast
    v-if="showToast"
    :label="toastLabel"
    @close="toggleToast"
  />
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { inputUserSchema, type TInputUserSchema } from "~/schema/user/input";

definePageMeta({
  layout: "tambah",
});

const roleOptions = [
  { value: "Administrator", label: "Administrator" },
  { value: "Journalis", label: "Journalis" },
];

const showToast = ref(false);
const toastLabel = ref("");

const { defineField, errors, handleSubmit, resetForm } =
  useForm<TInputUserSchema>({
    validationSchema: inputUserSchema,
  });

const [nama, namaAttrs] = defineField("nama");
const [role, roleAttrs] = defineField("role");
const [username, usernameAttrs] = defineField("username");
const [password, passwordAttrs] = defineField("password");
const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword");

const axios = useAxios();

function toggleToast() {
  showToast.value = !showToast.value;
}

const onSubmit = handleSubmit(async (payload: TInputUserSchema) => {
  const formdata = {
    nama: payload.nama,
    username: payload.username,
    password: payload.password,
    role: payload.role,
  };

  const postRequest = await axios.post("/api/user", formdata);

  if (postRequest.data.success) {
    toggleToast();
    toastLabel.value = postRequest.data.message;
    resetForm();
  }
});
</script>
