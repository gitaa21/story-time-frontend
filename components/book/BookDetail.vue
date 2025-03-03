<template>
    <div class="text-center mt-10 relative text-raisin-black">
        <p>{{ formatDate(book.created_at) }}</p>
        <h2 class="mt-10 mb-10 font-playfair"><b>{{ book.title }}</b></h2>
        <div class="flex items-center justify-center mb-7">
            <img class="rounded-full h-9 w-9"
                :src="(book.avatar ? `http://127.0.0.1:8000${book.avatar}` : 'https://i.pinimg.com/736x/88/78/c4/8878c46bb3bbc687093168a0fbb91ab5.jpg')"
                alt="Author">
            <p class="ml-2 text-raisin-black font-medium">{{ book.username }}</p>
        </div>
        <div @click="handleBookmark(book)"
            :class="{ 'bg-raisin-black': book.is_bookmarked, 'bg-gray-asparagus': !book.is_bookmarked }"
            class="absolute top-0 right-0 rounded-full px-5 py-4 flex items-center justify-center bg-gray-asparagus">
            <FontAwesomeIcon :icon="book.is_bookmarked ? ['fas', 'bookmark'] : ['far', 'bookmark']"
                class="text-white text-4xl " />
        </div>
    </div>

    <div class="flex gap-12">
        <div class="w-1/3 relative" @click="openModal">
            <div class="h-[600px] overflow-hidden mb-4 cursor-pointer">
                <img :src="'http://127.0.0.1:8000' + book.images[0].url" alt="Displayed Image"
                    class="w-full h-full object-cover rounded-xl" />
            </div>
            <div class="flex gap-4 overflow-hidden overflow-x-auto scrollbar-hide">
                <div v-for="(image, index) in book.images" :key="image.id" class="w-5/12 shrink-0 cursor-pointer"
                    @click="currentIndex = index">
                    <img :src="'http://127.0.0.1:8000' + image.url" alt="Thumbnail"
                        class="w-full h-full object-cover rounded-lg border-2 transition-opacity duration-300"
                        :class="index === 0 ? 'opacity-100' : 'opacity-30'" />
                </div>
            </div>

        </div>
        <div class="w-2/3">
            <div v-html="book.content"></div>
        </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
        <div class="relative bg-white p-10 rounded-lg shadow-lg max-w-3xl w-full">
            <button @click="closeModal" class="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-2xl">
                ✕
            </button>

            <div class="h-[400px] overflow-hidden mb-4">
                <img :src="'http://127.0.0.1:8000' + book.images[currentIndex].url" alt="Displayed Image"
                    class="w-full h-full object-cover rounded-xl" />
            </div>

            <div class="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto">
                <div v-for="(image, index) in book.images" :key="image.id" class="h-[100px] cursor-pointer"
                    @click="currentIndex = index">
                    <img :src="'http://127.0.0.1:8000' + image.url" alt="Thumbnail"
                        class="w-full h-full object-cover rounded-lg border-2"
                        :class="currentIndex === index ? 'border-gray-900' : 'border-transparent opacity-50'" />
                </div>
            </div>

            <div class="flex justify-between mt-4">
                <BaseButton class="text-2xl px-4" @click="prevSlide">←</BaseButton>
                <BaseButton class="text-2xl px-4" @click="nextSlide">→</BaseButton>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';

const isModalOpen = ref(false);

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

const store = useStore();

const props = defineProps({
    bookId: String,
    book: Object
});

const currentIndex = ref(0);

const nextSlide = () => {
    if (props.book.images && props.book.images.length) {
        currentIndex.value = (currentIndex.value + 1) % props.book.images.length;
    }
};

const prevSlide = () => {
    if (props.book.images && props.book.images.length) {
        currentIndex.value = (currentIndex.value - 1 + props.book.images.length) % props.book.images.length;
    }
};

watch(currentIndex, (newValue) => {
    console.log("Updated currentIndex:", newValue);
});

const handleBookmark = async (book) => {
    try {
        if (book.is_bookmarked) {
            await store.dispatch("bookmark/removeBookmark", book.id);
            store.commit("bookmark/REMOVE_BOOKMARK", book.id);
            await store.dispatch('auth/triggerPopup', 'Successfully removed story from bookmarks');
        } else {
            await store.dispatch("bookmark/addBookmark", book);
            store.commit("bookmark/ADD_BOOKMARK", book);
            await store.dispatch('auth/triggerPopup', 'Successfully added story to bookmarks');
        }
        book.is_bookmarked = !book.is_bookmarked;
    } catch (error) {
        console.error("Error toggling bookmark:", error);
        alert("Failed to update bookmark!");
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

<style setup>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
