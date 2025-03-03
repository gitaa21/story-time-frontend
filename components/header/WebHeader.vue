<template>
  <div class="fixed w-full z-50 bg-white shadow-md pb-5">
    <div class="flex ml-28 mt-5 justify-between mr-28">
      <NuxtLink to="/" class="flex-shrink-0">
        <img src="@/assets/images/logo.svg" alt="Logo">
      </NuxtLink>
      <div class="flex">
        <component v-for="(componentName, index) in menuComponent" :key="index" :is="components[componentName]" />
      </div>
    </div>
  </div>
</template>

<script setup>
import LoginMenu from './LoginMenu.vue';
import RegisterMenu from './RegisterMenu.vue';
import ProfileMenu from './ProfileMenu.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();

const components = {
  RegisterMenu,
  LoginMenu,
  ProfileMenu,
};

const menuComponent = computed(() => {
  const isAuthenticated = !!store.state.auth.token;
  return isAuthenticated ? ["ProfileMenu"] : ["RegisterMenu", "LoginMenu"];
});

console.log('Menu Component:', menuComponent.value);
console.log('Token:', store.state.auth.token);
console.log('IsLogin:', store.state.auth.isLogin);

</script>