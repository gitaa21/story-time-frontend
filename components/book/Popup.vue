<template>
  <transition name="fade-slide">
    <div v-if="visible" class="fixed top-40 left-1/2 transform -translate-x-1/2 
                p-4 w-80 rounded-lg shadow-lg bg-white flex items-center space-x-3 justify-between">
      <div class="ml-4 flex items-center">
        <img src="@/assets/images/check.svg" alt="" class="w-6 h-6">
        <span class="ml-3 text-md font-medium text-black">{{ message }}</span>
      </div>
      <button @click="closePopup" class="ml-auto text-gray-400 hover:text-gray-600">✖</button>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits, watch, ref } from "vue";

const props = defineProps({
  message: String
});

const emit = defineEmits(["close"]);
const visible = ref(false);
let timeoutId = null;

watch(() => props.message, (newMessage) => {
  if (newMessage) {
    visible.value = true; 
    console.log("Popup muncul dengan message:", newMessage);
    clearTimeout(timeoutId); 
    timeoutId = setTimeout(() => {
      closePopup();
    }, 3000);
  }
}, { immediate: true }); 

const closePopup = () => {
  visible.value = false;
  emit("close");
  console.log("Popup ditutup");
};
</script>

<style>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.5s, transform 0.8s;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
