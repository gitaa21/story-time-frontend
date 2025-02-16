<template>
    <div class="flex space-x-2 mt-4">
      <BaseButton 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage <= 1"
        class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Prev
      </BaseButton>
  
      <BaseButton 
        v-for="page in lastPage" 
        :key="page" 
        @click="changePage(page)" 
        :class="['px-3 py-1 rounded', currentPage === page ? 'bg-green-700 text-white' : 'bg-gray-100 hover:bg-gray-200']"
      >
        {{ page }}
      </BaseButton>
  
      <BaseButton 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage >= lastPage"
        class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </BaseButton>
    </div>
  </template>
  
  <script setup>
  import BaseButton from '../base/BaseButton.vue';
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    currentPage: Number,
    lastPage: Number, // Ini dari backend
  });
  
  const emit = defineEmits(['page-change']);
  
  const changePage = (page) => {
    if (page >= 1 && page <= props.lastPage) {
      emit('page-change', page);
    }
  };
  </script>
  