<template>
    <div :class="{'input-wrapper' : type === 'file'}" class="relative">
      <label :for="identity" class="text-raisin-black sm:text-md md:text-md lg:text-lg">
        <p>{{ label }}</p>
        <slot></slot>
      </label>
  
      <div class="relative w-full">
        <input
          :class="[{'input-file' : type === 'file'}, 'form-control']"
          :type="showPassword && type === 'password' ? 'text' : type"
          :id="identity"
          :placeholder="placeholder"
          :readonly="readonly === '1'"
          :value="modelValue"
          :disabled="disabled"
          @input="$emit('update:modelValue', $event.target.value)"
          class="border-2 placeholder-quartz rounded-lg w-full sm:text-md md:text-lg lg:text-lg p-5 mt-3 mb-1"
        />
  
        <FontAwesomeIcon v-if="type === 'password' && typeInput === 'password'"
          :icon="showPassword ? ['fas', 'eye'] : ['fas', 'eye-slash']" 
          class="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-400 text-2xl"
          @click="togglePassword"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    type: { type: String, required: true },
    typeInput: { type: String, default: '' }, 
    placeholder: { type: String, required: true },
    identity: { type: String, required: true },
    label: { type: String, required: true },
    modelValue: { type: String, required: true },
    disabled: { type: Boolean, default: false }
  });
  
  const showPassword = ref(false);
  
  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };
  </script>
  