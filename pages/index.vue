<template>
    <div>
        <Hero />
        <div class="mr-20 ml-20 mt-20 pb-6 border-b-2 mb-8 flex justify-between">
            <h2 class="font-playfair text-raisin-black">
                <b>Latest Story</b>
            </h2>
            <NuxtLink to="/books" class="flex items-center">
                <h5 class="whitespace-nowrap text-quartz">Explore More</h5>
                <img src="@/assets/images/arrow.svg" alt="">
            </NuxtLink>
        </div>

        <div class="flex space-x-7 w-full overflow-x-scroll scrollbar-hide mt-10">
            <div class="shrink-0 w-12"></div>
            <div class="min-w-[183%] flex gap-6">
                <BookList :books="bookList.slice(0, 6)" :component-name="'all-story'" v-if="bookListStatus" />
            </div>
            <div class="shrink-0 w-12"></div>
        </div>

        <!-- Comedy Section -->
        <div v-if="comedyBooks.books.length">
            <div class="mr-20 ml-20 mt-20 pb-6 border-b-2 mb-8 flex justify-between">
                <h2 class="font-playfair text-raisin-black">
                    <b>{{ comedyBooks.category_name }}</b>
                </h2>
                <NuxtLink :to="`/books?category=${comedyBooks.category_id}`" class="flex items-center">
                    <h5 class="whitespace-nowrap text-quartz">Explore More</h5>
                    <img src="@/assets/images/arrow.svg" alt="">
                </NuxtLink>
            </div>

            <div class="grid grid-cols-3 mr-20 ml-20 gap-6">
                <div class="col-span-2 row-span-2">
                    <BookList :books="comedyBooks.books.slice(0, 1)" :size="'special'" v-if="bookListStatus" />
                </div>
                <div class="space-y-10">
                    <BookList :books="comedyBooks.books.slice(1, 3)" v-if="bookListStatus" />
                </div>
            </div>
        </div>

        <!-- Romance Section -->
        <div v-if="romanceBooks.books.length">
            <div class="mr-20 ml-20 mt-20 pb-6 border-b-2 mb-8 flex justify-between">
                <h2 class="font-playfair text-raisin-black">
                    <b>{{ romanceBooks.category_name }}</b>
                </h2>
                <NuxtLink :to="`/books?category=${romanceBooks.category_id}`" class="flex items-center">
                    <h5 class="whitespace-nowrap text-quartz">Explore More</h5>
                    <img src="@/assets/images/arrow.svg" alt="">
                </NuxtLink>
            </div>
            <div class="grid grid-cols-3 gap-6 mr-20 ml-20">
                <BookList :books="romanceBooks.books.slice(0, 3)" v-if="bookListStatus" />
            </div>
        </div>

        <!-- Horror Section -->
        <div v-if="horrorBooks.books.length">
            <div class="mr-20 ml-20 mt-20 pb-6 border-b-2 mb-8 flex justify-between">
                <h2 class="font-playfair text-raisin-black">
                    <b>{{ horrorBooks.category_name }}</b>
                </h2>
                <NuxtLink :to="`/books?category=${horrorBooks.category_id}`" class="flex items-center">
                    <h5 class="whitespace-nowrap text-quartz">Explore More</h5>
                    <img src="@/assets/images/arrow.svg" alt="">
                </NuxtLink>
            </div>
            <div class="grid grid-cols-3 mr-20 ml-20 gap-6">
                <div class="col-span-2">
                    <BookList :books="horrorBooks.books.slice(0, 1)" :size="'special'" v-if="bookListStatus" />
                </div>
                <div class="space-y-10">
                    <BookList :books="horrorBooks.books.slice(1, 3)" v-if="bookListStatus" />
                </div>
            </div>
        </div>

        <!-- More Categories -->
        <div>
            <div class="mr-20 ml-20 mt-20 pb-6 border-b-2 mb-8 flex justify-between">
                <h2 class="font-playfair text-raisin-black">
                    <b>More Category</b>
                </h2>
            </div>
            <div class="flex whitespace-nowrap mr-20 ml-20 gap-8 overflow-x-scroll scrollbar-hide">
                <NuxtLink v-if="categoryList && categoryList.length" :to="`/books?category=${category.id}`" v-for="category in categoryList.filter(cat => !['Horror', 'Romance', 'Comedy'].includes(cat.name))" :key="category.id">
                    <div class="bg-issabelline rounded-md hover:bg-gray-asparagus/30 transition duration-300 ease-in-out">
                        <p class="p-9 text-xl text-gray-asparagus hover:text-raisin-black">{{ category.name }}</p>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
    <Popup v-if="showPopup" :message="popupMessage" type="success" @close="closePopup" />
</template>

<script setup>
import Hero from '~/components/book/Hero.vue';
import BookList from '~/components/book/BookList.vue';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import Popup from '~/components/book/Popup.vue';
const store = useStore();

const showPopup = computed(() => store.state.auth.showPopup);
console.log("POPUPPP", showPopup.value)
const popupMessage = computed(() => store.state.auth.popupMessage);
console.log("Pesannnnn", popupMessage.value)

const bookListStatus = ref(false);
const bookList = ref([]);
const categoryBooksList = ref([]);
const categoryList = ref([]);
const horrorBooks = ref({ category_name: '', books: [] });
const romanceBooks = ref({ category_name: '', books: [] });
const comedyBooks = ref({ category_name: '', books: [] });


const closePopup = () => {
  store.commit("auth/setShowPopup", false); 
};

const bookByCategories = async () => {
    try {
        const categories = await store.dispatch('book/getBookByCategory');
        categoryBooksList.value = categories;
        filterGenre();
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

const filterGenre = () => {
    categoryBooksList.value.forEach(category => {
        if (category.category_name === 'Horror') {
            horrorBooks.value = category;
        } else if (category.category_name === 'Romance') {
            romanceBooks.value = category;
        } else if (category.category_name === 'Comedy') {
            comedyBooks.value = category;
        }
    });
};

onMounted(async () => {
    try {
        const books = await store.dispatch('book/getBookData');
        const categories = await store.dispatch('book/getCategoryData');
        bookListStatus.value = true;
        bookList.value = books;
        categoryList.value = categories;
        console.log("INI BUKU BOOKMARK",  bookList.value);
      console.log("categoryList", categoryList.value);
        await bookByCategories();
    } catch (error) {
        console.log(error);
    }
});


</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
