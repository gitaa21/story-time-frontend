<template>
  <div class="pt-24">
    <UserProfile :user="userLogin" />
  </div>
  <div class="ml-20 mt-12">
    <BaseButton class="rounded-lg text-xl p-5 mr-10" :class="{ 'bg-issabelline': myStory }" @click="showMyStory">My
      Story</BaseButton>
    <BaseButton class="rounded-lg text-xl p-5" :class="{ 'bg-issabelline': bookMark }" @click="showBookMark">Bookmark
    </BaseButton>
  </div>
  <div class="grid grid-cols-3 mr-20 gap-7 ml-20 mt-10">
    <!-- User Menu -->
    <div class="grid-span-1">
      <UserMenu />
    </div>

    <div class="col-span-2" v-if="myStory">
      <div v-if="booksByUser && bookListStatus" class="grid grid-cols-2 gap-5">
        <BookList :books="booksByUser" :component-name="'my-story'" />
      </div>
      <div v-else class="text-center justify-self-center">
        <h3 class="font-playfair"><b>No Story Yet</b></h3>
        <p class="mt-7 mb-7 text-lg">
          You haven't shared any story yet. Start your fitness journey today!
        </p>
        <img src="@/assets/images/noMyStory.svg" alt="" />
      </div>
    </div>

    
    <div class="col-span-2" v-if="bookMark">
      <div v-if="booksByBookmarks && bookListStatus" class="grid grid-cols-2 gap-5">
        <BookList :books="booksByBookmarks" :component-name="'category'" v-if="bookListStatus" />
      </div>
      <div v-else class="text-center justify-self-center ">
        <h3 class="font-playfair"><b>No Bookmarks Yet</b></h3>
        <p class="mt-7 mb-7 text-lg">You haven't saved any bookmarks yet. Explore and bookmark your top workouts!</p>
        <img src="@/assets/images/noBookMark.svg" alt="">
      </div>
    </div>
  </div>

<Popup v-if="showPopup" :message="popupMessage" type="success" @close="closePopup" />
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';
import BaseButton from '~/components/base/BaseButton.vue';
import Popup from '~/components/book/Popup.vue';

const store = useStore();

const showPopup = computed(() => store.state.auth.showPopup);
console.log("POPUPPP", showPopup.value)
const popupMessage = computed(() => store.state.auth.popupMessage);
console.log("Pesannnnn", popupMessage.value)

const userLogin = computed(() => store.state.auth.userLogin);
const bookListStatus = ref(false);
const booksByUser = ref();
const booksByBookmarks = ref();
const bookMark = ref(false);
const myStory = ref(true);

const showMyStory = () => {
  myStory.value = true;
  bookMark.value = false;
}
const showBookMark = () => {
  myStory.value = false;
  bookMark.value = true;
}


onMounted(async () => {
    try {
        const fetchBooksByUser = await store.dispatch('book/getBookByUser', userLogin.value.id);
       await store.dispatch('bookmark/getBookmarks');
        
       console.log("INI BUKU BOOKMARK di userrrrrrrrrrr",  fetchBooksByUser.value);
        bookListStatus.value = true;
        booksByBookmarks.value = store.state.bookmark.bookmarks;
        console.log("iniii booksmark", booksByBookmarks.value)
        booksByUser.value = fetchBooksByUser || 'woy gaada data';
    } catch (error) {
        console.log(error);
    }
})

// if (!token.value) {
//   navigateTo('/login');
// }
</script>
  


