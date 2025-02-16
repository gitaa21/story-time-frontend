<template>
    <div class="grid grid-cols-2 relative m-3">
        <div class="w-2/3 m-auto">
            <FormLogin />
        </div>
        <div class="bg-issabelline rounded-2xl m-2">
            <div class="mt-36 mr-10">
                <div class="justify-self-center mr-40 ml-40">
                    <h2 class="text-6xl font-playfair text-raisin-black"><b>Welcome Back to Story Time!</b></h2>
                    <h3 class="mt-12 text-quartz mb-10">Dive back into captivating stories, follow your favorite authors, and continue sharing your own
                        tales.</h3>
                </div>
                <img src="@/assets/images/login.svg" alt="">
            </div>
        </div>
    </div>
</template>

<script setup>

import FormLogin from '../../components/auth/FormLogin.vue';

definePageMeta({
    layout: 'auth'
})
</script>