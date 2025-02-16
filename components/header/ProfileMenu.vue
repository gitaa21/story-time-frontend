<template>
    <div class="relative flex items-center">
      <img
        :src="(user.avatar_image ? `http://127.0.0.1:8000${user.avatar_image}` : 'https://i.pinimg.com/736x/88/78/c4/8878c46bb3bbc687093168a0fbb91ab5.jpg')"
        alt="Profile"
        class="rounded-full object-cover w-12 h-12" />
      <BaseButton class="flex items-center" @click="toggleDropdown">
        <p class="ml-2 mr-2 text-xl"><b>{{user.username}}</b></p>
        <img src="@/assets/images/dropdown.svg" alt="Dropdown Icon" />
      </BaseButton>
      <ul v-show="isDropdownOpen" class="mt-36 absolute p-1 pr-10 bg-white border border-gray-200 shadow-lg rounded-lg rounded-tl-none z-50 b-10 whitespace-nowrap">
        <li>
          <NuxtLink to="/user" class="block px-4 py-2 ">My Profile</NuxtLink>
        </li>
        <li>
          <BaseButton class="block px-4 py-2" @click="logout">Logout</BaseButton>
        </li>
      </ul> 
    </div>
  </template>
  
  <script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const user = computed(() => store.state.auth.userLogin);
console.log ("Data user", user)
const isDropdownOpen = ref(false);
  
  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
  };

  onMounted(async () => {
  try {
    await store.dispatch('auth/getUser'); 
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
});

const logout = async () => {
  try {
    await store.dispatch('auth/logout');
    isDropdownOpen.value = false;
  } catch (error) {
    console.error('Failed to logout:', error);
  }
};
  </script>
  