<template>
    <div class="flex-1 border-none rounded-xl group" v-for="book in books" :key="book.id">
        <div>
            <div class="overflow-hidden min-h-[300px] relative">
                <NuxtLink :to="`/books/detail/${book.id}`">
                    <div :class="size === 'special' ? 'h-[800px]' : 'h-[450px]'"
                        class="overflow-hidden rounded-t-xl rounded-xl">
                        <img class="w-full h-full object-cover group-hover:opacity-75 duration-300 ease-in-out "
                            :src="book.images && book.images[0] ? 'http://127.0.0.1:8000' + book.images[0].url : ''"
                            alt="Card Image">
                    </div>
                </NuxtLink>

                <div
                    class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" v-if="componentName === 'bookmark' || componentName === 'bookmark-sign'">
                    <div @click="handleBookmark(book)" :class="{
                        'bg-raisin-black': book.is_bookmarked,
                        'bg-gray-asparagus': !book.is_bookmarked
                    }" class="rounded-full px-3 py-2 flex items-center justify-center cursor-pointer">
                        <FontAwesomeIcon :icon="book.is_bookmarked ? ['fas', 'bookmark'] : ['far', 'bookmark']"
                            class="text-white text-3xl" />
                    </div>
                </div>
                

                <div class="absolute bottom-7 right-7 flex space-x-4 group-hover:bottom-8 transition-all duration-500">
                    <NuxtLink v-if="componentName === 'my-story'" :to="`/books/update/${book.id}`">
                        <div class="rounded-full p-2 flex items-center justify-center bg-gray-asparagus">
                            <img class="h-10 w-10" src="@/assets/images/edit.svg" alt="Edit">
                        </div>
                    </NuxtLink>

                    <div v-if="componentName === 'my-story' || componentName === 'my-story-index' ||componentName === 'my-story-category'" @click="handleBookmark(book)" :class="{
                        'bg-raisin-black': book.is_bookmarked,
                        'bg-gray-asparagus': !book.is_bookmarked
                    }" class="rounded-full px-4 py-3 flex items-center justify-center cursor-pointer">
                        <FontAwesomeIcon :icon="book.is_bookmarked ? ['fas', 'bookmark'] : ['far', 'bookmark']"
                            class="text-white text-3xl " />
                    </div>

                    <div v-if="componentName === 'my-story'" @click="deleteBook(book.id)"
                        class="rounded-full p-2 flex items-center justify-center bg-gray-asparagus cursor-pointer">
                        <img class="h-10 w-10" src="@/assets/images/delete.svg" alt="Delete">
                    </div> 

                <!-- <div v-if="componentName === 'my-story'" @click="isModalOpen = true"
                        class="rounded-full p-2 flex items-center justify-center bg-gray-asparagus cursor-pointer">
                        <img class="h-10 w-10" src="@/assets/images/delete.svg" alt="Delete">
                    </div>


                    <div v-if="isModalOpen"
                        class="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
                        <div class="bg-white rounded-lg shadow-lg w-2/6 p-7 relative">
                            <div class="text-center justify-between items-center pb-4">
                                <h3 class="text-lg font-bold">Delete Book</h3>
                                <p>Are you sure you want to delete this book?</p>
                                <BaseButton @click="closeModal" class="btn-white mr-10 mt-5">Cancel</BaseButton>
                                <BaseButton class="btn" @click="deleteBook(book.id)">Delete</BaseButton>
                            </div>
                        </div>
                    </div> -->

                </div>
            </div>

            <NuxtLink :to="`/books/detail/${book.id}`">
                <div class="mt-5">
                    <h3 class="font-bold text-raisin-black mb-5 group-hover:text-gray-asparagus">{{ book.title }}</h3>
                    <div v-html="book.content" class="mt-1 text-quartz text-justify line-clamp-3"></div>

                    <div class="flex justify-between mt-2">
                        <div v-if="componentName === 'my-story'" >
                                <p class="rounded-md px-3 py-1 text-gray-asparagus bg-issabelline">{{ book.category }}
                                </p>
                        </div>
 
                        <div class="flex items-center" v-if="componentName === 'all-story' || componentName === 'my-story-index' ||componentName === 'my-story-category' || componentName === 'bookmark'">
                            <img class="rounded-full h-9 w-9"
                                :src="book.avatar ? `http://127.0.0.1:8000${book.avatar}` : 'https://i.pinimg.com/736x/88/78/c4/8878c46bb3bbc687093168a0fbb91ab5.jpg'"
                                alt="Author">
                            <p class="ml-2 text-raisin-black font-medium">{{ book.username }}</p>
                        </div>

                        <div class="flex items-center">
                            <p class="text-raisin-black">{{ formatDate(book.created_at) }}</p>
                            <div v-if="componentName === 'all-story' || componentName === 'my-story-index' || componentName === 'bookmark'" class="ml-4">
                                <p class="rounded-md px-3 py-1 text-gray-asparagus bg-issabelline">{{ book.category }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </NuxtLink>
        </div>
    </div>


</template>

<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed, defineEmits } from "vue";

const store = useStore();
const router = useRouter();
const isModalOpen = ref(false);
const selectedBookId = ref(null);
const token = computed(() => store.state.auth.token);
const emit = defineEmits(["updateBookmarks"]);

const handleBookmark = async (book) => {
    if (!token.value) {
  navigateTo('/login');
  return;
}
    try {
        if (book.is_bookmarked) {
            await store.dispatch("bookmark/removeBookmark", book.id);
            store.commit("bookmark/REMOVE_BOOKMARK", book.id);
            await store.dispatch('auth/triggerPopup', 'Successfully removed story from bookmarks');
            emit("updateBookmarks", { type: "remove", book });
        } else {
            await store.dispatch("bookmark/addBookmark", book);
            store.commit("bookmark/ADD_BOOKMARK", book);
            await store.dispatch('auth/triggerPopup', 'Successfully added story to bookmarks');
            emit("updateBookmarks", { type: "add", book });
        }
        book.is_bookmarked = !book.is_bookmarked;
    } catch (error) {
        console.error("Error toggling bookmark:", error);
        alert("Failed to update bookmark!");
    }
};

// const openModal = (bookId) => {
//     selectedBookId.value = bookId;  
//     isModalOpen.value = true;     
// };

// const closeModal = () => {
//     isModalOpen.value = false;
//     selectedBookId.value = null;   
// };

const props = defineProps({
    books: Array,
    componentName: String,
    size: String
});


const deleteBook = async (id) => {
    try {
        await store.dispatch('book/destroyBook', id);
        await store.dispatch('auth/triggerPopup', 'Successfully delete a story');
        isModalOpen.value = false;
        router.push('/user').then(() => {
      window.location.reload();
    });;
    } catch (error) {
        console.error("Failed to delete book:", error);
    }
};

function formatDate(date) {
  if (!date) return "-";
  
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    console.error('Invalid Date:', date);
    return "-";
  }

  return parsedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
</script>
