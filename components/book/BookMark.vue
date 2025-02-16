<template>
    <div @click="handleBookmark"
        :class="{ 'bg-red-500': isBookmarked, 'bg-gray-asparagus': !isBookmarked }"
        class="rounded-full p-3 flex items-center justify-center cursor-pointer">
        <img class="h-8 w-8 pl-1" src="@/assets/images/bookMark.svg" alt="Bookmark">
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
    book: Object,
    bookmarks: Array,
});

const store = useStore();

const isBookmarked = computed(() => props.bookmarks.some(b => b.id === props.book.id));

const handleBookmark = async () => {
    if (isBookmarked.value) {
        await store.dispatch("bookmark/removeBookmark", props.book.id);
    } else {
        await store.dispatch("bookmark/addBookmark", props.book);
    }
};
</script>
