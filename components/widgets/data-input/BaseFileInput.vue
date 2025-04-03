<template>
  <div
    class="w-full cursor-pointer flex shadow-[7px_7px_0px_0px_rgba(0,0,0,0.2)] p-5 transition-all ease-in-out duration-300 text-yellow hover:shadow-yellow flex-col gap-5 items-center justify-center bg-[#1d242e] h-full"
    :class="minHeight"
    @click="handleClickUpload"
  >
    <input
      type="file"
      class="hidden"
      ref="fileInput"
      :multiple="multiple"
      @change="handleFileChange"
      :accept="
        fileType === 'image'
          ? 'image/*'
          : fileType === 'video'
          ? 'video/*'
          : 'audio/*'
      "
    />

    <div class="flex items-center flex-col gap-5" v-if="!isFileInserted">
      <div :class="{ 'text-red-500': error, 'text-yellow': !error }">
        <IconsUpload />
      </div>

      <h1 v-if="error" class="text-red-500">{{ error }}</h1>
      <h1 v-else>{{ label }}</h1>
    </div>
    <div v-else class="text-center">
      <div v-if="fileType === 'image'">
        <div v-if="multiple" class="text-center">
          <h1 class="font-semibold">File Dipilih :</h1>
          <h1 v-for="file in filesSelected">
            {{ file.name }}
          </h1>
        </div>
        <img
          v-else
          :src="thumbnailPreview"
          alt="Preview"
          class="max-w-full max-h-96 object-cover"
        />
      </div>
      <div v-else-if="fileType === 'video'">
        <!-- Tampilan untuk video -->
        <video
          v-if="videoPreview"
          :src="videoPreview"
          controls
          class="max-w-full max-h-96"
        ></video>
        <div v-else class="flex flex-col items-center gap-2">
          <IconsVideo class="text-yellow" />
          <h1 class="font-semibold text-yellow">
            {{ filesSelected[0]?.name }}
          </h1>
          <p class="text-sm text-gray-400">
            {{ formatFileSize(filesSelected[0]?.size) }}
          </p>
        </div>
      </div>
      <div v-else-if="fileType === 'lagu'">
        <div v-if="multiple">
          <h1 class="font-semibold">Lagu Dipilih:</h1>
          <h1 v-for="file in filesSelected" class="text-yellow">
            {{ file.name }}
          </h1>
        </div>
        <div v-else class="flex flex-col items-center gap-2">
          <IconsMusic class="text-4xl text-yellow" />
          <h1 class="font-semibold text-yellow">{{ filesSelected[0].name }}</h1>
          <p class="text-sm text-gray-400">
            {{ formatFileSize(filesSelected[0].size) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const fileModel = defineModel<File | File[] | null>();

const props = defineProps({
  error: {
    type: String,
    default: "",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  fileType: {
    type: String,
    default: "image",
  },
  label: {
    type: String,
    default: "Upload Thumbnail Berita",
  },
  minHeight: {
    type: String,
    default: "min-h-40",
  },
  defaultFile: {
    type: String,
    default: "",
  },
});

const fileInput = ref<HTMLInputElement | null>(null);
const thumbnailPreview = ref<string | null>(null);
const videoPreview = ref<string | null>(null);
const videoType = ref<string | null>(null);
const isFileInserted = ref(false);
const filesSelected = ref<File[]>([]);

// Fungsi untuk format ukuran file
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

function handleClickUpload() {
  fileInput.value?.click();
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    isFileInserted.value = false;
    return;
  }

  isFileInserted.value = true;

  if (!props.multiple) {
    const file = input.files[0];
    filesSelected.value = [file];

    if (props.fileType === "image") {
      const reader = new FileReader();
      reader.onload = (e) => {
        thumbnailPreview.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else if (props.fileType === "video") {
      videoPreview.value = URL.createObjectURL(file);
      videoType.value = file.type;
    }

    fileModel.value = file;
  } else {
    filesSelected.value = Array.from(input.files);
    fileModel.value = Array.from(input.files);
  }
}

const fetchDefaultFile = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal mengambil file default");

    const blob = await response.blob();
    const fileName = url.split("/").pop() || "default-file";
    const file = new File([blob], fileName, { type: blob.type });

    // Simpan file ke state
    filesSelected.value = [file];
    isFileInserted.value = true;

    // Generate preview untuk gambar
    if (props.fileType === "image") {
      const reader = new FileReader();
      reader.onload = (e) =>
        (thumbnailPreview.value = e.target?.result as string);
      reader.readAsDataURL(file);
    }

    // Perbarui v-model
    fileModel.value = file;
  } catch (error) {
    console.error("Error fetching default file:", error);
  }
};

watch(
  () => props.defaultFile,
  (newUrl) => {
    if (newUrl) fetchDefaultFile(newUrl);
  },
  { immediate: true }
);
</script>
