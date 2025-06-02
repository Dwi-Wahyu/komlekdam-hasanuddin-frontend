<template>
  <div
    class="bg-[url('/backgrounds/login-bg.jpeg')] w-full h-screen bg-center bg-cover"
  >
    <div
      class="relative flex items-center p-5 pt-20 md:gap-20 flex-col md:flex-row justify-center w-full h-full bg-[#1C2940D6]"
    >
      <div class="fixed left-5 top-5 items-center flex gap-3">
        <div class="bg-[#303949] p-2 rounded-lg">
          <NuxtImg src="/logo/logo.png" sizes="150px md:200px" />
        </div>
        <div class="">
          <h1 class="text-yellow text-sm md:text-base">
            KOMLEKDAM XIV/HASANUDDIN
          </h1>
          <h1 class="text-xs md:text-sm text-white">Setia Hingga Akhir</h1>
        </div>
      </div>
      <div class="text-center md:text-start mb-4">
        <h1 class="text-yellow font-bold md:text-3xl text-xl">Admin Panel</h1>
        <h1 class="font-semibold text-lg md:text-3xl text-white">
          Landing Page Komlekdam XIV/Hsn
        </h1>
      </div>

      <div
        class="bg-[#172B4D] px-6 py-5 md:px-7 md:py-6 rounded-2xl shadow md:w-[27vw]"
      >
        <div class="text-center">
          <h1 class="font-bold text-xl text-yellow">
            {{ authStore.welcomeText }}
          </h1>
          <h1 class="text-white mt-1 font-thin">{{ authStore.welcomeDesc }}</h1>
        </div>

        <form @submit="onSubmit" class="text-yellow flex gap-4 flex-col mt-5">
          <div>
            <WidgetsDataInputBaseInput
              variant="outline"
              label="Username"
              placeholder="Masukkan Username"
              v-model="username"
              v-bind="usernameAttr"
            />
            <WidgetsErrorInput :error="errors.username" />
          </div>

          <div>
            <WidgetsDataInputBaseInput
              variant="outline"
              label="Password"
              type="password"
              placeholder="Masukkan Password"
              v-model="password"
              v-bind="passwordAttr"
            />
            <WidgetsErrorInput :error="errors.password" />
          </div>

          <div>
            <h1 class="font-semibold mb-2 text-sm">Kode Captcha</h1>
            <div class="grid grid-cols-2 gap-2 items-center">
              <div
                v-if="captchaGenerated"
                class="bg-white rounded-xl flex justify-center"
                v-html="captchaGenerated.data"
              ></div>

              <div>
                <WidgetsDataInputBaseInput
                  placeholder="Masukkan Kode"
                  variant="outline"
                  v-model="captcha"
                  v-bind="captchaAttr"
                />
              </div>
            </div>
            <WidgetsErrorInput :error="errors.captcha" />
          </div>

          <div class="flex justify-center">
            <WidgetsButtonBaseButton
              type="submit"
              class="mt-3"
              variant="outline"
            >
              Login
            </WidgetsButtonBaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { type TLoginSchema } from "~/schema/login-schema";
import { loginSchema } from "~/schema/login-schema";
import { useMyAuthStore } from "~/store/auth";
import type { TBadRequestResponse } from "~/types/bad.request.response";

definePageMeta({
  layout: "login",
});

const axios = useAxios();

const { data: captchaGenerated, refresh: refreshCaptcha } = useFetch(
  "/api/captcha",
  {
    lazy: true,
  }
);

const { defineField, errors, handleSubmit, setFieldError } =
  useForm<TLoginSchema>({
    validationSchema: loginSchema,
  });

const [username, usernameAttr] = defineField("username");
const [password, passwordAttr] = defineField("password");
const [captcha, captchaAttr] = defineField("captcha");

type RequestType = TBadRequestResponse & {
  access_token: string;
  user: {
    id: number;
    username: string;
    role: string;
    nama: string;
  };
};

const onSubmit = handleSubmit(async (payload) => {
  if (captcha.value != captchaGenerated.value?.text) {
    setFieldError("captcha", "Kode captcha tidak sesuai");
    return;
  }

  try {
    const createRequest = await axios.post<RequestType>("/auth/login", payload);

    if (createRequest.data.access_token) {
      authStore.token = createRequest.data.access_token;
      authStore.user = createRequest.data.user;

      navigateTo("/admin/dashboard");
    }
  } catch (error: any) {
    if (error.response.data.statusCode == 401) {
      setFieldError("username", error.response.data.message);
      setFieldError("password", error.response.data.message);
    }
  }
});

const authStore = useMyAuthStore();

onBeforeMount(() => {
  if (!authStore.isTokenExpired) {
    navigateTo("/admin/dashboard");
  }
});
</script>
