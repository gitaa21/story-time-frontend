<template>
  <div class="flex justify-center space-x-2 mt-4">
    <BaseButton
      v-for="page in visiblePages"
      :key="page"
      @click="changePage(page)"
      :class="['px-4 py-2 rounded', currentPage === page ? 'bg-gray-asparagus text-white' : 'bg-gray-100 hover:bg-gray-200']"
    >
      {{ page }}
    </BaseButton>

    <BaseButton
      @click="changePage(currentPage + 1)"
      :disabled="currentPage >= lastPage"
      class="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
    >
      Next
    </BaseButton>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  currentPage: Number,
  lastPage: Number,
});

const emit = defineEmits(["page-change"]);

const changePage = (page) => {
  if (page >= 1 && page <= props.lastPage) {
    console.log("Emitting page change:", page);
    emit("page-change", page);
  }
};

const visiblePages = computed(() => {
  if (props.lastPage <= 5) return Array.from({ length: props.lastPage }, (_, i) => i + 1);
  if (props.currentPage <= 3) return [1, 2, 3, "...", props.lastPage];
  if (props.currentPage >= props.lastPage - 2) return [1, "...", props.lastPage - 2, props.lastPage - 1, props.lastPage];
  return [1, "...", props.currentPage - 1, props.currentPage, props.currentPage + 1, "...", props.lastPage];
});
</script>
