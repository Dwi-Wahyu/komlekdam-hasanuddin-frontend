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
      :accept="fileType === 'image' ? 'image/*' : 'video/*'"
    />

    <div class="flex items-center flex-col gap-5" v-if="!isFileInserted">
      <div :class="{ 'text-red-500': error, 'text-yellow': !error }">
        <IconsUpload />
      </div>

      <h1 v-if="error" class="text-red-500">{{ error }}</h1>
      <h1 v-else>{{ label }}</h1>
    </div>
    <div v-else>
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
      <div v-else>
        <video
          controls
          preload="none"
          class="w-full sm:w-[30vw]"
          v-if="videoPreview"
        >
          <source :src="videoPreview" />
          Browser tidak mendukung pemutaran video.
        </video>
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
});

const fileInput = ref<HTMLInputElement | null>(null);
const thumbnailPreview = ref<string | null>(null);
const videoPreview = ref<string | null>(null);
const videoType = ref<string | null>(null);
const isFileInserted = ref(false);
const filesSelected = ref<File[] | []>();

function handleClickUpload() {
  fileInput.value?.click();
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;

  isFileInserted.value = !isFileInserted.value;

  if (!props.multiple) {
    if (input.files && input.files[0]) {
      const file = input.files[0];

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
    }
  } else {
    if (input.files) {
      filesSelected.value = [];

      let temp = [];

      for (const each of input.files) {
        temp.push(each);
      }

      filesSelected.value = temp;

      fileModel.value = temp;
    } else {
      filesSelected.value = [];
    }
  }
}
</script>
