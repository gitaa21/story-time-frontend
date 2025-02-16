<template>
    <div class="grid grid-cols-2 relative m-2">
        <div class="bg-issabelline rounded-2xl m-2">
            <div class="mt-40">
                <div class="justify-self-center w-11/12">
                    <h1 class="font-playfair text-raisin-black"><b>Join the World’s Most-Loved Social Storytelling Platform!</b></h1>
                    <h4 class="mt-12 text-quartz mb-10">Create an account to explore interesting articles, connect with like-minded people, and share your own stories.</h4>
                </div>
                <img class="mx-auto" src="@/assets/images/register.svg" alt="">
            </div>
        </div>
        <div class="w-2/3 m-auto">
            <FormRegistrasi />
        </div>
    </div>
</template>

<script setup>
import FormRegistrasi from '../../components/auth/FormRegistrasi.vue'
definePageMeta({
    layout: 'auth'
})
</script>