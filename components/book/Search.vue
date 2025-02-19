<template>
    <div class="relative">
        <BaseInput v-model="keyword" class="input" type="text" placeholder="Search story"
            @input="searchStory" @keyup.enter="searchStory" />
        <img class="absolute right-4 top-8" src="@/assets/images/search.svg" alt="Search">
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseInput from '../base/BaseInput.vue';

const router = useRouter();
const route = useRoute();
const keyword = ref(route.query.keyword || ''); 

watch(() => route.query.keyword, (newKeyword) => {
    keyword.value = newKeyword || '';
});

watchEffect(() => {
    keyword.value = route.query.keyword || '';
});

const searchStory = () => {
    router.push({ path: '/books', query: keyword.value.trim() ? { keyword: keyword.value } : {} });
};


</script>
