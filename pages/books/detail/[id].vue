<template>
  <div class="bg-issabelline pt-24">
    <div class="ml-28 mr-28 pt-7 pb-7">
      <p class="text-lg font-bold text-gray-asparagus">
        <NuxtLink to="/" class="hover:underline transition duration-300 ease-in-out">Home</NuxtLink>
        / 
        <span v-if="selectedBook" class="hover:underline transition duration-300 ease-in-out cursor-pointer">{{ selectedBook.title }}</span>
      </p>

    </div>
  </div>
  <div class="ml-28 mr-28">
    <BookDetail :book="bookDetail" v-if="bookDetail" />

    <h3 class="mt-20 mb-10 font-playfair font-medium">Similar Story</h3>
    <div class="grid grid-cols-3 gap-6"
      v-if="bookDetail && bookDetail.related_books && bookDetail.related_books.length > 0">
      <BookList :books="bookDetail.related_books.slice(0, 3)" :component-name="'my-story-index'" v-if="bookListStatus" />
    </div>
  </div>
  <Popup v-if="showPopup" :message="popupMessage" type="success" @close="closePopup" />
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const store = useStore();
const route = useRoute();
const bookListStatus = ref(false);
const bookList = ref();
const bookDetail = ref(null);
const selectedBookId = ref(route.params.id);
const showPopup = computed(() => store.state.auth.showPopup);
const popupMessage = computed(() => store.state.auth.popupMessage);

const selectedBook = computed(() => { return bookDetail.value; });


onMounted(async () => {
  try {
    const books = await store.dispatch('book/getBookData');
    bookListStatus.value = true;
    bookList.value = books;
    console.log("bukuuuuuuuuuuuuuuuu", bookList.value);

    const fetchedBookDetail = await store.dispatch('book/getBookDetail', selectedBookId.value);
    console.log("Book Detail Data IDDDDDDDDD:", selectedBookId.value);
    bookDetail.value = fetchedBookDetail;
    console.log("Book Detail:", bookDetail.value);
  } catch (error) {
    console.log(error);
  }
})
</script>
