<template>
  <div>
    <form @submit.prevent="register">
      <h1 class="text-raisin-black"><b>Register</b></h1>

      <div class="my-4">
        <BaseInput v-model="registerData.name" type="text" label="Name" placeholder="Enter your name" />
        <div v-if="errors.name.length">
          <p v-for="(error, index) in errors.name" :key="index" class="error">{{ error }}</p>
        </div>
      </div>

      <div class="my-4">
        <BaseInput v-model="registerData.username" type="text" label="Username" placeholder="Enter your username" />
        <div v-if="errors.username.length">
          <p v-for="(error, index) in errors.username" :key="index" class="error">{{ error }}</p>
        </div>
      </div>

      <div class="my-4">
        <BaseInput v-model="registerData.email" type="text" label="Email" placeholder="Enter your email" />
        <div v-if="errors.email.length">
          <p v-for="(error, index) in errors.email" :key="index" class="error">{{ error }}</p>
        </div>
      </div>

      <div class="my-4">
        <BaseInput v-model="registerData.password" type="password" label="Password" placeholder="Enter your password" typeInput = "password"/>
        <div v-if="errors.password.length">
          <p v-for="(error, index) in errors.password" :key="index" class="error">{{ error }}</p>
        </div>
      </div>

      <div class="my-4">
        <BaseInput v-model="registerData.confirm_password" type="password" label="Confirm Password" placeholder="Confirm your password" typeInput = "password"/>
        <div v-if="errors.confirm_password.length">
          <p v-for="(error, index) in errors.confirm_password" :key="index" class="error">{{ error }}</p>
        </div>
      </div>

      <BaseButton type="submit" class="btn">Register</BaseButton>

      <div v-if="errorMessage" class="error mt-4">{{ errorMessage }}</div>

      <p class="mt-5">Already have an account? <NuxtLink to="/login" class="text-gray-asparagus no-underline"><b>Login</b></NuxtLink></p>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const errorMessage = ref('');

const registerData = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  confirm_password: ''
});

const errors = reactive({
  name: [],
  username: [],
  email: [],
  password: [],
  confirm_password: []
});

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$!#%?&])[A-Za-z\d@$!#%?&]{8,}$/;

const register = async () => {
  Object.keys(errors).forEach(key => (errors[key] = [])); // Reset errors

  let isValid = true;

  // Validasi name    
  if (!registerData.name) {    
    errors.name.push('Name is required');
    isValid = false;
  } else if (registerData.name.length < 4) {    
    errors.name.push('Name must be at least 4 characters.');
    isValid = false;
  } else if (registerData.name.length > 50) {    
    errors.name.push('Name must be no more than 50 characters.');
    isValid = false;
  }

  // Validasi username
  if (!registerData.username) {    
    errors.username.push('Username is required');
    isValid = false;
  } else if (registerData.username.length < 4) {    
    errors.username.push('Username must be at least 4 characters.');
    isValid = false;
  } else if (registerData.username.length > 50) {    
    errors.username.push('Username must be no more than 50 characters.');
    isValid = false;
  }

  // Validasi email
  if (!registerData.email) {
    errors.email.push('Email is required');
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
    errors.email.push('Email is invalid');
    isValid = false;
  }

  // Validasi password
  if (!registerData.password) {    
    errors.password.push('Password is required');
    isValid = false;
  } else if (registerData.password.length < 8) {    
    errors.password.push('Password must be at least 8 characters.');
    isValid = false;
  } else if (!passwordRegex.test(registerData.password)) {    
    errors.password.push('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.');
    isValid = false;
  }

  // Validasi confirm password
  if (!registerData.confirm_password) {    
    errors.confirm_password.push('Confirm Password is required');
    isValid = false;
  } else if (registerData.password !== registerData.confirm_password) {
    errors.confirm_password.push('Password and confirm password do not match.');
    isValid = false;
  }

  if (!isValid) return;

  try {
    // Membuat payload untuk registrasi
    const payload = { 
      name: registerData.name, 
      username: registerData.username, 
      email: registerData.email, 
      password: registerData.password, 
      confirm_password: registerData.confirm_password 
    };

    // Kirim data ke store
    await store.dispatch('auth/getRegisterData', payload);
    await store.dispatch('auth/triggerPopup', 'You have successfully registered');

    // Redirect setelah registrasi berhasil
    router.push('/');
  } catch (err) {
    errorMessage.value = 'Registration failed. Please try again.';
    console.log(err);
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
