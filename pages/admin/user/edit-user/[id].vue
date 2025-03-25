<template>
  <div class="text-white">
    <WidgetsTambahBackButton
      link="/admin/user/tambah-user"
      kembali-to="/admin/user"
    />

    <WidgetsJudulSection text="Perbaharui Data User" class="mt-4" />

    <div class="px-7 flex flex-col gap-7 py-6 bg-[#30394a]" v-if="pending">
      <h1>Loading . . .</h1>
    </div>
    <form
      v-else
      @submit="onSubmit"
      class="px-7 flex flex-col gap-7 py-6 bg-[#30394a]"
    >
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
        <WidgetsDataInputBaseSelect
          label="Role"
          :options="roleOptions"
          v-model="role"
          variant="underline"
        />
        <WidgetsErrorInput :error="errors.role" />
      </div>

      <div class="flex justify-center gap-3">
        <WidgetsButtonBaseButton
          type="button"
          @click="toggleModal"
          variant="outline"
        >
          Perbaharui Password
        </WidgetsButtonBaseButton>
        <WidgetsButtonBaseButton type="submit">
          Perbaharui Data
        </WidgetsButtonBaseButton>
      </div>
    </form>
  </div>

  <WidgetsPopupToast
    v-if="showToast"
    :label="toastLabel"
    @close="toggleToast"
  />

  <WidgetsPopupModal
    v-if="showModal"
    @close="toggleModal"
    title="Edit Password User"
    :show-action="false"
  >
    <div class="flex flex-col gap-3">
      <div>
        <WidgetsDataInputBaseInput label="Password" v-model="password" />

        <ErrorInput :error="errorPassword" />
      </div>

      <div>
        <WidgetsDataInputBaseInput
          label="Confirm Password"
          v-model="confirmPassword"
        />

        <ErrorInput :error="errorConfirmPassword" />
      </div>

      <div class="flex justify-center">
        <WidgetsButtonBaseButton
          class="mt-2 rounded-lg w-fit"
          @click="handleGantiPassword"
          variant="outline"
        >
          Submit
        </WidgetsButtonBaseButton>
      </div>
    </div>
  </WidgetsPopupModal>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import ErrorInput from "~/components/widgets/ErrorInput.vue";
import { updateUserSchema, type TUpdateUserSchema } from "~/schema/user/update";
import { type TUserType } from "~/store/user";

definePageMeta({
  layout: "tambah",
  middleware: "auth",
});

const route = useRoute();
const { id } = route.params;

const { data, pending } = useMyFetch<TUserType>(`/api/user/${id}`);

const roleOptions = [
  { value: "Administrator", label: "Administrator" },
  { value: "Journalis", label: "Journalis" },
];

const showModal = ref(false);
const showToast = ref(false);
const toastLabel = ref("");

const gantiPasswordErrors: {
  password: string;
  confirmPassword: string;
} = { password: "", confirmPassword: "" };

function toggleModal() {
  showModal.value = !showModal.value;
}

const { defineField, errors, handleSubmit } = useForm<TUpdateUserSchema>({
  validationSchema: updateUserSchema,
});

const [nama, namaAttrs] = defineField("nama");
const [role, roleAttrs] = defineField("role");
const [username, usernameAttrs] = defineField("username");

const password = ref("");
const errorPassword = ref("");
const confirmPassword = ref("");
const errorConfirmPassword = ref("");

watch(data, (newData) => {
  if (newData) {
    nama.value = newData.nama;
    username.value = newData.username;
    role.value = newData.role;
  }
});

const axios = useAxios();

function toggleToast() {
  showToast.value = !showToast.value;
}

function validateGantiPassword() {
  errorPassword.value = "";
  errorConfirmPassword.value = "";

  if (!password.value && !confirmPassword.value) {
    errorPassword.value = "Tolong isi password pengganti";
    errorConfirmPassword.value = "Tolong isi confirm password";
    return false;
  }

  if (!password.value) {
    errorPassword.value = "Tolong isi password pengganti";
    return false;
  }

  if (!confirmPassword.value) {
    errorConfirmPassword.value = "Tolong isi confirm password";
    return false;
  }

  if (password.value != confirmPassword.value) {
    errorConfirmPassword.value = "Harus sesuai dengan password";
    return false;
  }

  return true;
}

const handleGantiPassword = async () => {
  if (!validateGantiPassword()) {
    return;
  }

  const postRequest = await axios.patch(`/api/user/ganti-password/${id}`, {
    password: password.value,
  });

  if (postRequest.data.success) {
    password.value = "";
    confirmPassword.value = "";
    toggleModal();
    toastLabel.value = postRequest.data.message;
    toggleToast();
  }
};

const onSubmit = handleSubmit(async (payload: TUpdateUserSchema) => {
  const formdata = {
    nama: payload.nama,
    username: payload.username,
    role: payload.role,
  };

  const postRequest = await axios.patch(`/api/user/${id}`, formdata);

  if (postRequest.data.success) {
    toggleToast();
    toastLabel.value = postRequest.data.message;
  }
});
</script>
