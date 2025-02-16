<template>
    <transition name="fade">
      <div v-if="message" class="fixed top-40 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  p-4 w-3/12 rounded-lg shadow-lg bg-white flex items-center space-x-3 justify-between">
        <div class="ml-7 flex items-center">
          <img src="@/assets/images/check.svg" alt="">
          <span class="ml-3 text-md font-medium text-raisin-black">{{ message }}</span>
        </div>
        <button @click="closePopup" class="ml-auto text-gray-400 hover:text-gray-600">✖</button>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, watch } from "vue";
  
  const props = defineProps({
    message: String
  });
  
  const emit = defineEmits(["close"]);
  
  // Auto close popup after 3 seconds
  watch(() => props.message, (newMessage) => {
    if (newMessage) {
      setTimeout(() => {
        emit("close");
      }, 3000);
    }
  });
  
  const closePopup = () => {
    emit("close"); // Memberitahu parent untuk menghapus message
  };
  </script>
  
  <style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>
  