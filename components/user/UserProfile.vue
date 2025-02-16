<template>
  <div class="flex items-center justify-center bg-issabelline py-20">
    <img class="rounded-full h-48 w-48"
      :src="(user.avatar_image ? `http://127.0.0.1:8000${user.avatar_image}` : 'https://i.pinimg.com/736x/88/78/c4/8878c46bb3bbc687093168a0fbb91ab5.jpg')"
      alt="User Avatar" />

    <div class="ml-10 w-3/6 mr-10">
      <h3><b>{{ user.name }}</b></h3>
      <h5 class="mt-2 mb-6">{{ user.email }}</h5>
      <p class="text-xl text-justify">{{ user.about_me }}</p>
    </div>

    <BaseButton @click="openModal" class="btn">Edit Profile</BaseButton>
  </div>

  <!-- Modal -->
  <div name="fade">
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-5/6 p-10 relative">
        <div class="flex justify-between items-center pb-4">
          <h3 class="text-lg font-bold">Edit Profile</h3>
          <BaseButton @click="closeModal" class="text-gray-500 hover:text-issabelline">✕</BaseButton>
        </div>

        <div class="py-4">
          <form @submit.prevent="updateProfile">
            <div class="flex gap-5">
              <div class="w-1/2">
                <label class="cursor-pointer flex items-center">
                  <img class="rounded-full h-40 w-40"
                    :src="imagePreviewUrl || (user.avatar_image ? `http://127.0.0.1:8000${user.avatar_image}` : 'https://i.pinimg.com/736x/88/78/c4/8878c46bb3bbc687093168a0fbb91ab5.jpg')"
                    alt="User Avatar" />
                    <span class="btn-white ml-5 hover:border-raisin-black">
                      <input type="file" class="hidden" accept="image/*" ref="fileInput" @change="handleFileChange" />
                  Change Picture</span>
                </label>
                <div class="my-4">
                  <BaseInput type="text" identity="name" label="Name" placeholder="Enter your name"
                    v-model="userData.name" /> 
                </div>
                <div class="my-4">
                  <BaseInput type="email" identity="email" label="Email" placeholder="Enter your email"
                    v-model="userData.email" :disabled="true" class="text-gray-500"/>
                </div>
                <div class="my-4">
                  <BaseInput type="text" identity="aboutMe" label="About Me" placeholder="Tell us about yourself"
                    v-model="userData.about_me" />
                </div>
              </div>
              <div class="w-1/2">
                <h4 class="mb-7"><b>Change Password</b></h4>
                <div class="my-4">
                  <BaseInput class="input" type="password" identity="old" label="Old Password"
                    placeholder="Enter your old password" v-model="userData.current_password" />
                </div>
                <div class="my-4">
                  <BaseInput class="input" type="password" identity="new" label="New Password"
                    placeholder="Enter your new password" v-model="userData.new_password" />
                </div>
                <div class="my-4">
                  <BaseInput type="password" identity="confirm" label="Confirm New Password"
                    placeholder="Re-enter your new password" v-model="userData.new_password_confirmation" />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="flex">
          <BaseButton @click="closeModal" class="btn-white mr-10">Cancel</BaseButton>
          <BaseButton class="btn" @click="updateProfile">Update Profile</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive , watch} from 'vue';
import { useStore } from 'vuex';
import BaseButton from '../base/BaseButton.vue';
import BaseInput from '../base/BaseInput.vue';

const store = useStore();
const fileInput = ref(null);
const isModalOpen = ref(false);
const imagePreviewUrl = ref(null); 

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

console.log("User data from props:", props.user);

const userData = reactive({
  name: '',
  email: '',
  about_me: '',
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
});

watch(() => props.user, (newUser) => {
  if (newUser) {
    userData.name = newUser.name;
    userData.email = newUser.email;
    userData.about_me = newUser.about_me;
  }
}, { immediate: true }); // `immediate: true` agar pertama kali langsung diset

// const userData = reactive({ ...props.user }); 

console.log(" edit bor", userData);


const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imagePreviewUrl.value = URL.createObjectURL(file);
  }
};


const updatePicture = async () => {
  if (fileInput.value?.files[0]) {
    const file = fileInput.value.files[0];
    imagePreviewUrl.value = URL.createObjectURL(file);
    try {
      // Upload avatar dan dapatkan URL baru
      const uploadedImageUrl = await store.dispatch('auth/uploadAvatar', file);
      return uploadedImageUrl; // Return URL untuk digunakan dalam updateProfile
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  }
  return null;
};

const updateProfile = async () => {
  try {
    const uploadedAvatar = await updatePicture();
    const updatedData = {
      name: userData.name,
      email: userData.email,
      about_me: userData.about_me,
    };

    if (uploadedAvatar) {
      updatedData.avatar_image = uploadedAvatar;
    }

    // Hanya tambahkan password jika diisi
    if (userData.current_password && userData.new_password && userData.new_password_confirmation) {
      updatedData.current_password = userData.current_password;
      updatedData.new_password = userData.new_password;
      updatedData.new_password_confirmation = userData.new_password_confirmation;
    }

    await store.dispatch('auth/updateUser', updatedData);
    await store.dispatch('auth/triggerPopup', 'Successfully edit your profile');
    closeModal(); 
  } catch (error) {
    console.error("Failed to update profile:", error);
  }
};

</script>
