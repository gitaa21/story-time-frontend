<template>
  <div>
    <form @submit.prevent="login">
      <h1 class="text-raisin-black"><b>Login</b></h1>
      <div class="my-4">
        <BaseInput class="input" type="text" identity="usernameOrEmail" label="Username/Email" placeholder="Enter your username or email"
          v-model="loginData.usernameOrEmail" />
        <p v-if="errors.usernameOrEmail" class="error">{{ errors.usernameOrEmail }}</p>
      </div>
      <div class="my-4">
        <BaseInput type="password" identity="password" label="Password" placeholder="Enter your chosen password"
          v-model="loginData.password" typeInput = "password"/>
        <p v-if="errors.password" class="error">{{ errors.password }}</p>
      </div>
    <BaseButton type="submit" class="btn">Login</BaseButton>
    <p class="mt-5">Don't have an account? <span>
          <NuxtLink to="/registrasi" class="text-gray-asparagus no-underline"><b>Register</b></NuxtLink>
        </span></p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const loginData = reactive({
  usernameOrEmail: '',
  password: ''
});

const errors = reactive({
  usernameOrEmail: '',
  password: ''
});

const errorMessage = ref('');
const store = useStore();
const router = useRouter();

const login = async () => {
  errors.usernameOrEmail = '';
  errors.password = '';
  errorMessage.value = '';

  let isValid = true;
  if (!loginData.usernameOrEmail) {
    errors.usernameOrEmail = 'Username or Email is required';
    isValid = false;
  }
  if (!loginData.password) {
    errors.password = 'Password is required';
    isValid = false;  
  }
  if (!isValid) {
    return;
  }

  try {
    const { usernameOrEmail, password } = loginData;
    const payload = {
      username_or_email: usernameOrEmail,
      password: password,
    };

    console.log({ payload });

    await store.dispatch('auth/getLoginData', payload);
    await store.dispatch('auth/triggerPopup', 'You have successfully logged in');
    // Popup muncul di halaman index
    // store.dispatch('auth/triggerPopup', {
    //   message: 'You have successfully logged in!',
    //   type: 'success'
    // });

    router.push('/'); // Arahkan ke halaman index
  } catch (err) {
    errorMessage.value = 'Login failed. Please try again.';
    console.log(err);
  }
};
</script>


<style scoped>
.error {
  color: red;
}
</style>
