<template>
    <BookForm :isEdit="true" :book ="bookDetail" v-if="bookDetail"/>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const store = useStore();
const route = useRoute();
const bookListStatus = ref(false);
const bookDetail = ref(null);
const selectedBookId = ref(route.params.id); 

const selectedBook = computed(() => { return bookDetail.value;});


onMounted(async () => {
  try {
    const fetchedBookDetail = await store.dispatch('book/getBookDetail', selectedBookId.value);
    console.log("Book Detail Data IDDDDDDDDD:", selectedBookId.value);
    bookDetail.value = fetchedBookDetail;
    console.log("Book Detail:", bookDetail.value);
  } catch (error) {
    console.log(error);
  }
})
</script>