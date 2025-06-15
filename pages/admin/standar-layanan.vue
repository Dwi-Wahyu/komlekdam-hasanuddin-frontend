<template>
  <div>
    <h1 class="text-xl mb-4 font-semibold">Standar Layanan</h1>

    <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
      <div
        v-for="(item, index) in standarLayananData"
        :key="index"
        class="flex flex-col justify-between shadow-[7px_7px_0px_0px_rgba(0,0,0,0.2)] p-4 bg-[#303949]"
      >
        <div>
          <h1 class="text-yellow font-semibold capitalize">{{ item.label }}</h1>
          <p class="font-thin">{{ getTypeDescription(item.type) }}</p>

          <!-- Tampilkan preview untuk file -->
          <div v-if="item.type === 'image'" class="mt-2">
            <img
              :src="`${baseURL}/${item.fileUrl}`"
              :alt="item.label"
              class="max-h-40 object-contain cursor-pointer"
            />
          </div>

          <div v-else-if="item.type === 'video'" class="mt-2">
            <video controls class="max-h-40 cursor-pointer">
              <source
                :src="`${baseURL}/${item.fileUrl}`"
                :type="`video/${item.value.split('.').pop()}`"
              />
              Browser tidak mendukung video.
            </video>
          </div>

          <div v-else-if="item.type === 'document'" class="mt-2">
            <a
              :href="`${baseURL}/${item.fileUrl}`"
              target="_blank"
              class="text-blue-500 hover:underline"
            >
              Buka Dokumen
            </a>
          </div>

          <div v-else class="mt-2">
            <a
              v-if="item.type === 'link'"
              :href="item.value"
              target="_blank"
              class="text-blue-500 hover:underline break-all"
            >
              {{ item.value }}
            </a>
            <p v-else class="break-all">{{ item.value }}</p>
          </div>
        </div>

        <div class="flex justify-end mt-3">
          <WidgetsButtonBaseButton
            variant="outline"
            @click="openEditModal(item)"
          >
            Edit
          </WidgetsButtonBaseButton>
        </div>
      </div>
    </div>

    <!-- Modal Edit -->
    <WidgetsPopupInputModal
      v-if="showModal && currentItem"
      @close="closeModal"
      :title="`Edit ${currentItem.label}`"
    >
      <form @submit.prevent="onSubmit" class="grid grid-cols-1 gap-5">
        <template v-if="currentItem.type === 'link'">
          <WidgetsDataInputBaseInput
            label="Link URL"
            variant="outline"
            v-model="value"
          />
        </template>

        <template v-else>
          <WidgetsDataInputBaseFileInput
            :label="`Upload ${getTypeDescription(currentItem.type)}`"
            v-model="file"
            :accept="getFileAccept(currentItem.type)"
          />
        </template>

        <div class="flex justify-end gap-3">
          <WidgetsButtonBaseButton
            variant="outline"
            type="button"
            @click="closeModal"
          >
            Batal
          </WidgetsButtonBaseButton>
          <WidgetsButtonBaseButton
            variant="outline"
            type="submit"
            :loading="isSubmitting"
          >
            Simpan
          </WidgetsButtonBaseButton>
        </div>
      </form>
    </WidgetsPopupInputModal>

    <WidgetsPopupToast
      v-if="showSuccessToast"
      :label="successToastMessage"
      @close="toggleSuccessToast"
    />

    <WidgetsPopupToast
      v-if="showErrorToast"
      type="error"
      :label="errorToastMessage"
      @close="toggleErrorToast"
    />
  </div>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import {
  type TUpdateStandarLayananSchema,
  updateStandarLayananSchema,
} from "~/schema/udpate-standar-layanan";

definePageMeta({
  middleware: "auth",
});

interface StandarLayananItem {
  label: string;
  value: string;
  type: "link" | "document" | "image" | "video";
  fileUrl?: string;
}

const runtimeConfig = useRuntimeConfig();
const { baseURL } = runtimeConfig.public.axios;

const standarLayananData = ref<StandarLayananItem[]>([]);

const showModal = ref(false);

const showSuccessToast = ref(false);
const successToastMessage = ref("");
const showErrorToast = ref(false);
const errorToastMessage = ref("");
const currentItem = ref<StandarLayananItem | null>(null);

const isSubmitting = ref(false);

const axios = useAxios();

const toggleErrorToast = () => {
  showErrorToast.value = !showErrorToast.value;
};

const toggleSuccessToast = () => {
  showSuccessToast.value = !showSuccessToast.value;
};

// Fetch data
const fetchData = async () => {
  const { data, error } = await useMyFetch<StandarLayananItem[]>(
    "/api/standar-layanan"
  );

  if (data.value) {
    standarLayananData.value = data.value;
  } else if (error.value) {
    console.error("Gagal mengambil data standar layanan:", error.value);
    errorToastMessage.value = "Gagal memuat data standar layanan";
    toggleErrorToast();
  }
};

await fetchData();

// Form validation
const { errors, handleSubmit, setFieldValue, values, defineField } =
  useForm<TUpdateStandarLayananSchema>({
    validationSchema: updateStandarLayananSchema,
  });

const [value] = defineField("value");
const [label] = defineField("label");
const [file] = defineField("file");

// Methods
const getTypeDescription = (type: string) => {
  switch (type) {
    case "link":
      return "Link eksternal";
    case "document":
      return "Dokumen";
    case "image":
      return "Gambar";
    case "video":
      return "Video";
    default:
      return "File";
  }
};

const getFileAccept = (type: string) => {
  switch (type) {
    case "document":
      return ".pdf,.doc,.docx";
    case "image":
      return "image/*";
    case "video":
      return "video/*";
    default:
      return "*";
  }
};

const openEditModal = (item: StandarLayananItem) => {
  label.value = item.label;
  value.value = item.value;

  console.log(item);

  currentItem.value = item;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentItem.value = null;
};

const onSubmit = handleSubmit(async () => {
  if (!currentItem.value) return;

  isSubmitting.value = true;

  try {
    if (file.value) {
      const formData = new FormData();

      formData.append("label", label.value);
      formData.append("file", file.value);
      formData.append("value", value.value ?? "");

      const postReq = await axios.postForm(
        "/api/standar-layanan/file",
        formData
      );
    } else {
      const postReq = await axios.post("/api/standar-layanan", {
        label: label.value,
        value: value.value,
      });
    }

    // Refresh data setelah update
    await fetchData();

    successToastMessage.value = "Data berhasil diperbarui";
    toggleSuccessToast();
    closeModal();
  } catch (err) {
    console.error("Gagal memperbarui data:", err);
    errorToastMessage.value = "Gagal memperbarui data";
    toggleErrorToast();
  } finally {
    isSubmitting.value = false;
  }
});
</script>
