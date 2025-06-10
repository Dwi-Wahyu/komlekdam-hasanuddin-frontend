<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    @click.self="$emit('close')"
  >
    <div class="w-full max-w-sm rounded-lg bg-second p-8 shadow-2xl">
      <h2 class="mb-4 text-center text-2xl font-bold text-yellow">
        Akses Terbatas
      </h2>
      <p class="mb-6 text-center text-sm text-gray-300">
        Masukkan password untuk mengakses fitur internal.
      </p>

      <form @submit.prevent="checkPassword">
        <input
          v-model="passwordInput"
          type="password"
          placeholder="Password..."
          class="w-full rounded-md border-2 border-gray-600 bg-gray-800 p-3 text-white focus:border-blue focus:outline-none"
          ref="passwordField"
        />
        <p v-if="errorMessage" class="mt-2 text-sm text-danger">
          {{ errorMessage }}
        </p>
        <WidgetsButtonBaseButton class="w-full mt-5 rounded-lg" type="submit">
          Buka Akses
        </WidgetsButtonBaseButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const emit = defineEmits(["close", "unlocked"]);

const passwordInput = ref("");
const errorMessage = ref("");
const passwordField = ref(null);

const correctPassword = "Jaya!Hubd@m";

const checkPassword = () => {
  if (passwordInput.value === correctPassword) {
    errorMessage.value = "";
    emit("unlocked"); // Kirim event 'unlocked' jika berhasil
  } else {
    errorMessage.value = "Password salah. Silakan coba lagi.";
    passwordInput.value = "";
  }
};

// Fokus ke input field saat modal muncul
onMounted(() => {
  passwordField.value?.focus();
});
</script>
