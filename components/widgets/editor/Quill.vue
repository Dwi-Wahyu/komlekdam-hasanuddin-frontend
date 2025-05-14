<template>
  <div>
    <div id="editor"></div>
  </div>
</template>

<script setup>
import "quill/dist/quill.snow.css";
import "./Quill.css";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["editor-content", "update:modelValue"]);
const quillInstance = ref(null);
const editorContent = ref("");

onMounted(async () => {
  if (process.client) {
    const Quill = (await import("quill")).default;

    quillInstance.value = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: {
          container: [
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            { header: 1 },
            { header: 2 },
            { list: "ordered" },
            { list: "bullet" },
            { script: "sub" },
            { script: "super" },
            { indent: "-1" },
            { indent: "+1" },
            { direction: "rtl" },
            { color: [] },
            { background: [] },
            { font: [] },
            { align: "" },
            { align: "center" },
            { align: "right" },
            { align: "justify" },
            "link",
            "image",
            "video",
            "clean",
          ],
        },
        imageResize: {
          displaySize: true,
        },
      },
    });

    // Set default value dari props.modelValue
    if (props.modelValue) {
      quillInstance.value.root.innerHTML = props.modelValue;
    }

    // Kirim perubahan konten ke parent
    quillInstance.value.on("text-change", () => {
      const content = quillInstance.value.root.innerHTML;
      editorContent.value = content;
      emit("editor-content", content);
      emit("update:modelValue", content);
    });
  }
});

// Watch untuk perubahan dari luar
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== editorContent.value && quillInstance.value) {
      quillInstance.value.root.innerHTML = newValue;
    }
  }
);
</script>
