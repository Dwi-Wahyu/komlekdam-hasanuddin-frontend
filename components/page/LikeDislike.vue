<template>
  <div class="flex gap-3">
    <div class="flex flex-col items-center">
      <button @click="actionable ? handleLike() : null">
        <IconsLikeFill v-if="liked" />
        <IconsLike v-else />
      </button>
      <h1>{{ likeCount }}</h1>
    </div>
    <div class="flex flex-col items-center">
      <button @click="actionable ? handleDislike() : null">
        <IconsLikeFill v-if="disliked" class="rotate-180" />
        <IconsLike v-else class="rotate-180" />
      </button>
      <h1>{{ dislikeCount }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
  konten: {
    type: String,
    default: "",
  },
  like: {
    type: Number,
    default: 0,
  },
  actionable: {
    type: Boolean,
    default: true,
  },
  dislike: {
    type: Number,
    default: 0,
  },
});

const likeCount = ref(props.like);
const dislikeCount = ref(props.dislike);

const axios = useAxios();

const liked = ref(false);
const disliked = ref(false);

async function handleLike() {
  if (liked.value || disliked.value) {
    return;
  }

  const likeRequest = await axios.patch(
    `/api/berita/${props.konten}/${props.id}/like`
  );

  if (likeRequest.data.success) {
    liked.value = true;
    disliked.value = false;
    likeCount.value += 1;
  }
}

async function handleDislike() {
  if (liked.value || disliked.value) {
    return;
  }

  const likeRequest = await axios.patch(
    `/api/berita/${props.konten}/${props.id}/dislike`
  );

  if (likeRequest.data.success) {
    liked.value = false;
    disliked.value = true;
    dislikeCount.value += 1;
  }
}
</script>
