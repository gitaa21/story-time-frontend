<template>
  <div>

    <div class="ml-28 mr-28 pt-40 pb-6 border-b-2 mb-8 flex justify-between">
      <h2 class="font-playfair text-raisin-black" style="text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);">
        <b>
          <span v-if="route.query.keyword">{{ books.length }} result for "{{ searchKeyword }}"</span>
          <span v-else-if="route.query.category">{{ selectedCategoryName }}</span>
          <span v-else>All Story</span>
        </b>
      </h2>
    </div>

    <div class="bg-issabelline">
      <div class="ml-28 mr-20 pt-7 pb-7">
        <p class="text-lg text-gray-asparagus">
          <NuxtLink to="/" class="hover:underline transition duration-300 ease-in-out">Home</NuxtLink> /
          <span v-if="route.query.keyword" class="cursor-pointer hover:underline transition duration-300 ease-in-out">
            Search
            Result</span>
          <span v-else-if="route.query.category">
            <span class="cursor-pointer hover:underline transition duration-300 ease-in-out">Category</span> /
            <span class="cursor-pointer hover:underline transition duration-300 ease-in-out">{{ selectedCategoryName
            }}</span>
          </span>
          <span v-else class="cursor-pointer hover:underline transition duration-300 ease-in-out">All Story</span>
        </p>
      </div>
    </div>

    <div class="flex justify-between">
      <div class="flex">
        <div class="flex items-center ml-28 mr-28 mt-5 gap-4">
          <h5>Sort by</h5>
          <div class="dropdown">
            <button @click="toggleDropdown('sort')" class="flex items-center gap-2">
              <h5 class="font-bold">{{ sortOption }}</h5>
              <img src="@/assets/images/dropdown.svg" alt="">
            </button>
            <div v-show="isSortDropdownOpen" class="dropdown-content">
              <h5 class="p-3 hover:text-gray-asparagus transition duration-300 ease-in-out cursor-pointer"
                :class="{ 'border-l-4 border-gray-asparagus': sortOption === 'Newest' }"
                @click="selectSortOption('Newest')">
                Newest
              </h5>
              <h5 class="p-3 hover:text-gray-asparagus transition duration-300 ease-in-out cursor-pointer"
                :class="{ 'border-l-4 border-gray-asparagus': sortOption === 'Popular' }"
                @click="selectSortOption('Popular')">
                Popular
              </h5>
              <h5 class="p-3 hover:text-gray-asparagus transition duration-300 ease-in-out cursor-pointer"
                :class="{ 'border-l-4 border-gray-asparagus': sortOption === 'A-Z' }" @click="selectSortOption('A-Z')">
                A - Z
              </h5>
              <h5 class="p-3 hover:text-gray-asparagus transition duration-300 ease-in-out cursor-pointer"
                :class="{ 'border-l-4 border-gray-asparagus': sortOption === 'Z-A' }" @click="selectSortOption('Z-A')">
                Z - A
              </h5>
            </div>
          </div>
        </div>

        <div class="flex items-center mt-5 gap-4">
          <h5>Category</h5>
          <div class="dropdown">
            <button @click="toggleDropdown('category')" class="flex items-center gap-2">
              <h5 class="font-bold">{{ selectedCategoryName }}</h5>
              <img src="@/assets/images/dropdown.svg" alt="">
            </button>
            <div v-show="isCategoryDropdownOpen" class="dropdown-content">
              <h5 class="p-3 cursor-pointer transition duration-300 ease-in-out"
                :class="{ 'border-l-4 border-gray-asparagus': selectedCategory === 'All' }"
                @click="selectCategory('All')">
                All
              </h5>
              <h5 class="p-3 cursor-pointer hover:text-gray-asparagus transition duration-300 ease-in-out"
                v-for="category in categories" :key="category.id"
                :class="{ 'border-l-4 border-gray-asparagus': selectedCategory == category.id }"
                @click="selectCategory(category)">
                {{ category.name }}
              </h5>

            </div>
          </div>
        </div>

      </div>
      <div class="w-1/6 mr-28">
        <Search />
      </div>
    </div>

    <!-- <div class="grid gap-6 ml-28 mr-28 mt-12 grid-cols-3">
    <div v-if="books.length > 0" class="col-span-2 row-span-2">
      <BookList :books="[books[0]]"
        :component-name="route.query.category ? 'my-story-category' : 'my-story-index'" />
    </div>

    <div v-for="(book, index) in books" 
         v-if="index > 0"
         :key="book.id"
         class="col-span-1">
      <BookList :books="[book]"
        :component-name="route.query.category ? 'my-story-category' : 'my-story-index'" />
    </div>

    <div v-if="books.length === 0" class="col-span-3 text-center justify-self-center">
      <img src="@/assets/images/error.svg" alt="">
      <h3 class="font-playfair text-gray-asparagus mt-10">
        <b>Sorry, the story you're looking for doesn't exist!</b>
      </h3>
      <p class="mt-7 mb-7 text-lg">Try searching with a different keyword or explore the available categories.</p>
    </div>
  </div> -->


  <div class="grid grid-cols-3 gap-6 mr-28 ml-28 mt-12">
      <BookList v-if="books.length > 0" :books="books"
        :component-name="route.query.category ? 'my-story-category' : 'my-story-index'" />
      <div v-else class="col-span-3 text-center justify-self-center">
        <img src="@/assets/images/noMyStory.svg" alt="">
        <h3 class="font-playfair text-gray-asparagus mt-10"><b>Sorry, the story you're looking for doesn't exist!</b></h3>
        <p class="mt-7 mb-7 text-lg">Try searching with a different keyword or explore the available categories.</p>
      </div>
    </div>

    <Pagination class="pt-12" v-if="books.length > 0" :current-page="currentPage" :last-page="lastPage"
      @page-change="fetchBooks" />
  </div>

  <Popup v-if="showPopup" :message="popupMessage" type="success" @close="closePopup" />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Pagination from '../components/book/Pagination.vue';
import Search from '../components/book/Search.vue';

const route = useRoute();
const router = useRouter();
const store = useStore();

const showPopup = computed(() => store.state.auth.showPopup);
const popupMessage = computed(() => store.state.auth.popupMessage);

const books = ref([]);
const categories = ref([]);
const currentPage = ref(1);
const lastPage = ref(1);
const searchKeyword = ref(route.query.keyword || '');
const sortOption = ref(route.query.sort || 'Newest');
const selectedCategory = computed(() => route.query.category || '');

const selectedCategoryName = computed(() => {
  const category = categories.value.find(cat => String(cat.id) === String(selectedCategory.value));
  return category ? category.name : 'All';
});

const isSortDropdownOpen = ref(false);
const isCategoryDropdownOpen = ref(false);

const fetchBooks = async (page = 1) => {
  console.log("Fetching books for page:", page);

  if (page !== currentPage.value) {
    currentPage.value = page;
  }

  try {
    const response = await store.dispatch('book/getBookBySort', {
      sortOption: sortOption.value,
      category: selectedCategory.value,
      page: page,
      keyword: searchKeyword.value,
    });

    console.log("Response Data:", response);
    if (response && response.data) {
      books.value = response.data || [];
      lastPage.value = response.last_page || 1;
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  try {
    categories.value = await store.dispatch('book/getCategoryData');
    if (store.state.bookmark.bookmarks.length === 0) {
      store.dispatch("bookmark/getBookmarks");
    }
  } catch (error) {
    console.error(error);
  }
});


watch(() => route.query, (newQuery) => {
  searchKeyword.value = newQuery.keyword || '';
  sortOption.value = newQuery.sort || 'Newest';
  fetchBooks();
}, { immediate: true });


const toggleDropdown = (type) => {
  if (type === 'sort') {
    isSortDropdownOpen.value = !isSortDropdownOpen.value;
    isCategoryDropdownOpen.value = false;
  } else {
    isCategoryDropdownOpen.value = !isCategoryDropdownOpen.value;
    isSortDropdownOpen.value = false;
  }
};

const updateQueryParams = (params) => {
  router.push({ query: { ...route.query, ...params } });
};

const selectSortOption = (option) => {
  sortOption.value = option;
  updateQueryParams({ sort: option });
  isSortDropdownOpen.value = false;
};

const selectCategory = (category) => {
  updateQueryParams({ category: category.id !== 'All' ? category.id : undefined });
  isCategoryDropdownOpen.value = false;
};
</script>


<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  z-index: 1;
}
</style>
