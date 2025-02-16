<template>
    <div class="flex-1 border-none rounded-xl group" v-for="book in books" :key="book.id">
        <div>
            <div class="overflow-hidden min-h-[300px] relative">
                <NuxtLink :to="`/book/detail/${book.id}`">
                    <div :class="size === 'special' ? 'h-[700px]' : 'h-[350px]'"
                        class="overflow-hidden rounded-t-xl rounded-xl">
                        <img class="w-full h-full object-cover group-hover:opacity-75 duration-300 ease-in-out "
                            :src="book.images && book.images[0] ? 'http://127.0.0.1:8000' + book.images[0].url : ''"
                            alt="Card Image">
                    </div>
                </NuxtLink>

                <div class="absolute bottom-7 right-7 flex space-x-4">
                    <div @click="handleBookmark(book)"
                        :class="{ 'bg-red-500': book.is_bookmarked, 
                        'bg-gray-asparagus': !book.is_bookmarked }"
                        class="rounded-full p-3 flex items-center justify-center cursor-pointer">
                        <img class="h-8 w-8 pl-1" src="@/assets/images/bookMark.svg" alt="Bookmark">
                    </div>

                    <NuxtLink v-if="componentName === 'my-story'" :to="`/book/update/${book.id}`">
                        <div class="rounded-full p-2 flex items-center justify-center bg-gray-asparagus">
                            <img class="h-10 w-10" src="@/assets/images/edit.svg" alt="Edit">
                        </div>
                    </NuxtLink>

                    <div v-if="componentName === 'my-story'" @click="deleteBook(book.id)"
                        class="rounded-full p-2 flex items-center justify-center bg-gray-asparagus cursor-pointer">
                        <img class="h-10 w-10" src="@/assets/images/delete.svg" alt="Delete">
                    </div>
                </div>
            </div>

            <NuxtLink :to="`/book/detail/${book.id}`">
                <div class="mt-5">
                    <h3 class="font-bold text-raisin-black mb-5 group-hover:text-gray-asparagus">{{ book.title }}</h3>
                    <!-- <p class="mt-1 text-quartz text-justify line-clamp-3">{{ book.content }}</p> -->
                    <div v-html="book.content" class="mt-1 text-quartz text-justify line-clamp-3"></div>

                    <div class="flex justify-between mt-2">
                        <div v-if="componentName === 'my-story'">
                            <p class="rounded-md px-3 py-1 text-gray-asparagus bg-issabelline">Comedy</p>
                        </div>

                        <div class="flex items-center">
                            <img class="rounded-full h-9 w-9"
                                :src="book.avatar ? `http://127.0.0.1:8000${book.avatar}` : 'https://i.pinimg.com/736x/88/78/c4/8878c46bb3bbc687093168a0fbb91ab5.jpg'"
                                alt="Author">
                            <p class="ml-2 text-raisin-black font-medium">{{ book.username }}</p>
                        </div>

                        <div class="flex items-center">
                            <p class="text-raisin-black">{{ formatDate(book.created_at) }}</p>
                            <div v-if="componentName === 'all-story' || componentName === 'category'" class="ml-4">
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
import { computed } from "vue";

const store = useStore();
const router = useRouter();


const handleBookmark = async (book) => {
  try {
    if (book.is_bookmarked) {
      await store.dispatch("bookmark/removeBookmark", book.id);
      store.commit("bookmark/REMOVE_BOOKMARK", book.id);
    } else {
      await store.dispatch("bookmark/addBookmark", book);
      store.commit("bookmark/ADD_BOOKMARK", book);
    }
    book.is_bookmarked = !book.is_bookmarked; // Perbarui status di UI secara langsung
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    alert("Failed to update bookmark!");
  }
};





const props = defineProps({
  books: Array,
  componentName: String,
  size: String
});

// Log books to the console when the component is mounted
onMounted(() => {
  console.log("buku baru banget", props.books);
});

const deleteBook = async (id) => {
    if (!id) {
        alert("Error: Book ID is undefined!");
        return;
    }

    try {
        await store.dispatch('book/destroyBook', id);
        alert('Book deleted successfully!');
        router.push('/books');
    } catch (error) {
        console.error("Failed to delete book:", error);
        alert("Failed to delete book!");
    }
};

function formatDate(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
</script>

