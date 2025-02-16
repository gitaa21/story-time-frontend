<template>
    <div>
        <div class="text-center mx-auto w-9/12 pt-40">
            <h1 class="font-playfair text-raisin-black font-semibold" style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);" v-if="token">Hi,  {{user.name}}.</h1>
            <h1 class="font-playfair text-raisin-black font-semibold" style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);">Welcome to Storytime</h1>
            <h5 class="text-quartz mt-5">The world's most-loved social storytelling platform. Story time connects a global
                community of 90 million readers and writers through the power of story.</h5>
            <div class="mt-5 mb-10 w-9/12 mx-auto ">
                <Search></Search>
            </div>
            <img class="justify-self-center " src="@/assets/images/hero.svg" alt="">
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import Search from './Search.vue';

const store = useStore();
const token = store.state.auth.token
const user = computed(() => store.state.auth.userLogin);

</script>


