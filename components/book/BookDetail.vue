<template>
    <div class="text-center mt-10 relative text-raisin-black">
        <p>{{ formatDate(book.created_at) }}</p>
        <h2 class="mt-10 mb-10 font-playfair"><b>{{ book.title }}</b></h2>
        <div class="flex items-center justify-center mb-7">
            <img class="rounded-full h-9 w-9"  :src="(book.avatar ? `http://127.0.0.1:8000${book.avatar}` : 'https://i.pinimg.com/736x/88/78/c4/8878c46bb3bbc687093168a0fbb91ab5.jpg')" alt="Author">
            <p class="ml-2 text-raisin-black font-medium">{{ book.username }}</p>
        </div>
        <div class="absolute top-0 right-0 rounded-full p-3 flex items-center justify-center bg-gray-asparagus">
            <img class="h-8 w-8 pl-1"  src="@/assets/images/bookMark.svg" alt="Bookmark">
        </div>
    </div>

    <div class="flex gap-12" >
        <div class="w-1/3 relative">
            <div class="h-[600px] overflow-hidden mb-4">
                <img :src="'http://127.0.0.1:8000' + book.images[currentIndex].url" alt="Displayed Image" class="w-full h-full object-cover rounded-xl" />
            </div>
            <div class="flex gap-4 overflow-hidden overflow-x-auto scrollbar-hide">
                <div v-for="(image, index) in book.images" :key="image.id" class="w-5/12 shrink-0 cursor-pointer"
                    @click="currentIndex = index">
                    <img :src="'http://127.0.0.1:8000' + image.url" alt="Thumbnail" class="w-full h-full object-cover rounded-lg border-2"
                        :class="currentIndex === index ? 'opacity-100' : 'border-transparent opacity-50'" />
                </div>
            </div>
            <BaseButton class="absolute top-1/2 left-0 transform -translate-y-1/2 ml-3 text-white text-5xl"
                @click="prevSlide">
                <
            </BaseButton>
            <BaseButton class="absolute top-1/2 right-0 transform -translate-y-1/2 mr-3 text-white text-5xl"
                @click="nextSlide">
                >
            </BaseButton>
        </div>
        <div class="w-2/3">
           <div v-html="book.content"></div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  bookId: String,
  book: Object
});

console.log("data bukku", props.book.image);

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

function formatDate(date) {
    const [day, month, year] = date.split('-');
    const newDate = new Date(`${year}-${month}-${day}`);
    return newDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

watch(currentIndex, (newValue) => {
    console.log("Updated currentIndex:", newValue);
});

console.log("currentttt", currentIndex.value)

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