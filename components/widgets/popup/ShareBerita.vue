<template>
  <div
    class="w-full flex items-center justify-center top-0 left-0 fixed bg-black/50 h-screen z-50"
  >
    <div
      :class="startAnimation ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      class="bg-[#303949] p-7 text-white max-w-96 relative min-w-72 flex items-center justify-center flex-col gap-2 rounded-2xl transition-all ease-in-out duration-300"
    >
      <button class="absolute top-3 right-3" @click="toggleModal">
        <IconsX width="17" height="17" fill="white" />
      </button>

      <h1 class="font-semibold text-yellow text-center">{{ label }}</h1>
      <h1 class="text-center">Bagikan berita melalui</h1>

      <div class="w-full mt-1 flex justify-center gap-4">
        <a
          :href="`https://api.whatsapp.com/send?text=${encodeURIComponent(
            props.linkBerita
          )}`"
          target="_blank"
          @click="shareBerita('whatsapp')"
        >
          <IconsWhatsapp width="35" height="35" />
        </a>
        <a
          :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            props.linkBerita
          )}`"
          target="_blank"
          @click="shareBerita('facebook')"
        >
          <IconsFacebook width="35" height="35" />
        </a>
        <a
          :href="props.linkBerita"
          target="_blank"
          @click="shareBerita('instagram')"
        >
          <IconsInstagram width="35" height="35" />
        </a>
        <button @click="copyLink">
          <IconsLink width="35" height="35" />
        </button>
      </div>

      <!-- Notifikasi -->
      <div v-if="isCopied" class="mt-2 text-green-400 text-sm">
        Link berhasil disalin!
      </div>
      <div v-if="errorMessage" class="mt-2 text-red-400 text-sm">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    default: "",
  },
  sublabel: {
    default: "",
  },
  linkBerita: {
    default: "",
  },
  idBerita: {
    default: 0,
  },
});

const emit = defineEmits(["close", "refresh"]);
const startAnimation = ref(false);
const isCopied = ref(false);
const errorMessage = ref("");

const axios = useAxios();

// Fungsi untuk mengirim permintaan API saat berbagi
async function shareBerita(platform) {
  try {
    axios.put(`/api/berita/${props.idBerita}/bagikan`);
    emit("refresh");
    console.log(`Berita dibagikan melalui ${platform}`);
  } catch (error) {
    console.error("Gagal memperbarui jumlah dibagikan:", error);
    errorMessage.value = "Gagal memperbarui jumlah dibagikan";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.linkBerita);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);

    await shareBerita("copy");
  } catch (error) {
    console.error("Gagal menyalin link:", error);
    errorMessage.value = "Gagal menyalin link";
    setTimeout(() => {
      errorMessage.value = "";
    }, 2000);
  }
}

function toggleModal() {
  emit("close");
}

function handleConfirm() {
  emit("confirm");
}

onMounted(() => {
  setTimeout(() => {
    startAnimation.value = true;
  }, 1);
});
</script>
