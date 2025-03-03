<template>
  <div class="relative flex items-center">
    <img
      :src="(user.avatar_image ? `http://127.0.0.1:8000${user.avatar_image}` : 'https://i.pinimg.com/736x/88/78/c4/8878c46bb3bbc687093168a0fbb91ab5.jpg')"
      alt="Profile" class="rounded-full object-cover w-12 h-12" />
    <BaseButton class="flex items-center" @click="toggleDropdown">
      <p class="ml-2 mr-2 text-xl"><b>{{ user.name }}</b></p>
      <img src="@/assets/images/dropdown.svg" alt="Dropdown Icon" />
    </BaseButton>
    <ul v-show="isDropdownOpen"
      class="mt-36 absolute p-1 pr-10 bg-white border border-gray-200 shadow-lg rounded-lg rounded-tl-none z-50 b-10 whitespace-nowrap">
      <li>
        <NuxtLink to="/user" class="block px-4 py-2 " @click="closeDropdown">My Profile</NuxtLink>
      </li>
      <li>
        <BaseButton class="block px-4 py-2" @click="openModalAndCloseDropdown" >Logout</BaseButton>
      </li>
    </ul>
  </div>
  <!-- Modal -->
  <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-2/6 p-7 relative">
      <div class="text-center justify-between items-center pb-4">
        <h3 class="text-lg font-bold">Logout</h3>
        <p>Are you sure you want to logout?</p>
        <BaseButton @click="closeModal" class="btn-white mr-10 mt-5">Cancel</BaseButton>
        <BaseButton class="btn" @click="logout">Logout</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'; 

const router = useRouter();
const store = useStore();
const user = computed(() => store.state.auth.userLogin);
console.log("Data user", user)
const isDropdownOpen = ref(false);
const isModalOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const openModalAndCloseDropdown = () => {
  isModalOpen.value = true;
  closeDropdown(); 
};

onMounted(async () => {
  try {
    await store.dispatch('auth/getUser');
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
});

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const logout = async () => {
  try {
    await store.dispatch('auth/logout');
    isDropdownOpen.value = false;
    router.push('/'); 
  } catch (error) {
    console.error('Failed to logout:', error);
  }
};
</script>