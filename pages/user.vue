<template>
  <div class="pt-24">
    <UserProfile :user="userLogin" />
  </div>

  <div class="ml-28 mt-12">
    <BaseButton class="rounded-lg text-xl p-5 mr-10" :class="{ 'bg-issabelline': myStory }" @click="showMyStory">
      My Story
    </BaseButton>
    <BaseButton class="rounded-lg text-xl p-5" :class="{ 'bg-issabelline': bookMark }" @click="showBookMark">
      Bookmark
    </BaseButton>
  </div>

  <div class="grid grid-cols-3 mr-20 gap-7 ml-29 mt-10">
    <div class="grid-span-1">
      <div class="sticky top-32">
        <UserMenu />
      </div>
    </div>

    <div class="col-span-2">
      <div v-if="books.length && bookListStatus" class="grid grid-cols-2 gap-5">
        <BookList :books="books" :component-name="myStory ? 'my-story' : 'bookmark'"
          @updateBookmarks="updateBookmarks" />
      </div>

      <div v-else class="text-center justify-self-center">
        <h3 class="font-playfair"><b>{{ myStory ? 'No Story Yet' : 'No Bookmarks Yet' }}</b></h3>
        <p class="mt-7 mb-7 text-lg">
          {{ myStory ? "You haven't shared any story yet. Start your fitness journey today!"
            : "You haven't saved any bookmarks yet. Explore and bookmark your top workouts!" }}
        </p>
        <img v-if="myStory" src="@/assets/images/noMyStory.svg" alt="No Story" />
        <img v-else src="@/assets/images/noBookMark.svg" alt="No Bookmark" />
      </div>

      <Pagination class="pt-12" v-if="books.length > 0" :current-page="currentPage" :last-page="lastPage"
        @page-change="(page) => fetchBooks(page, myStory ? 'myStory' : 'bookMark')" />
    </div>
  </div>

  <Popup v-if="showPopup" :message="popupMessage" type="success" @close="closePopup" />
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';
import BaseButton from '~/components/base/BaseButton.vue';
import Popup from '~/components/book/Popup.vue';
import Pagination from '~/components/book/Pagination.vue';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const showPopup = computed(() => store.state.auth.showPopup);
const popupMessage = computed(() => store.state.auth.popupMessage);
const userLogin = computed(() => store.state.auth.userLogin);
const token = computed(() => store.state.auth.token);

const bookListStatus = ref(false);
const booksByUser = ref([]);      
const booksByBookmarks = ref([]); 
const books = ref([]);            // Data yang ditampilkan
const bookMark = ref(false);
const myStory = ref(true);
const currentPage = ref(1);
const lastPage = ref(1);

const fetchBooks = async (page = 1, type = "myStory") => {
  if (page !== currentPage.value) {
    currentPage.value = page;
  }

  try {
    await store.dispatch('auth/getUser');
    let response = null;

    if (type === "myStory") {
      response = await store.dispatch('book/getBookByUser', { page: page, });
    } else if (type === "bookMark") {
      response = await store.dispatch('book/getBookByBookMark', { page: page, });
      console.log("sdfgh", response);
    }

    bookListStatus.value = true;

    if (response && response.data) {
      if (type === "myStory") {
        booksByUser.value = response.data;
      } else {
        booksByBookmarks.value = store.state.bookmark.bookmarks.data;
        console.log("sdfghAAAAAAAAAAAAAAAAA", booksByBookmarks.value);
      }
      books.value = response.data;
      lastPage.value = response.last_page || 1;
    } else {
      books.value = [];
      lastPage.value = 1;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    bookListStatus.value = false;
    books.value = [];
    lastPage.value = 1;
  }
};

const updateBookmarks = ({ type, book }) => {
  if (type === "add") {
    booksByBookmarks.value.push(book);
  } else if (type === "remove") {
    booksByBookmarks.value = booksByBookmarks.value.filter(bookmarkedBook => bookmarkedBook.id !== book.id);
  }

  if (bookMark.value) {
    books.value = booksByBookmarks.value;
  }
};


const showMyStory = () => {
  myStory.value = true;
  bookMark.value = false;
  fetchBooks(1, "myStory"); 
};

const showBookMark = () => {
  myStory.value = false;
  bookMark.value = true;
  fetchBooks(1, "bookMark"); 
};

onMounted(() => {
  fetchBooks();
});
</script>
