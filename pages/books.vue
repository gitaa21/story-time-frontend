<template>
  <div>
    <div class="mr-20 ml-20 pt-40 pb-6 border-b-2 mb-8 flex justify-between">
      <h2 class="font-playfair text-raisin-black" style="text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);">
        <b><span v-if="route.query.category">{{ selectedCategoryName }}</span><span v-else>All Story</span></b>
      </h2>
    </div>

    <div class="bg-issabelline">
      <div class="ml-20 mr-20 pt-7 pb-7">
        <p class="text-lg text-gray-asparagus">
          <NuxtLink to="/">Home</NuxtLink> /
          <span v-if="route.query.category"> Category / {{ selectedCategoryName }}</span>
          <span v-else>All Story</span>
        </p>
      </div>
    </div>

    <div class="flex justify-between">
      <div class="flex">
        <div class="flex items-center mr-20 ml-20 mt-5 gap-4">
          <h5>Sort by</h5>
          <div class="dropdown">
            <button @click="toggleDropdown('sort')" class="flex items-center gap-2">
              <h5>{{ sortOption }}</h5>
              <img src="@/assets/images/dropdown.svg" alt="">
            </button>
            <div v-show="isSortDropdownOpen" class="dropdown-content">
              <h5 class="p-3" @click="selectSortOption('Newest')">Newest</h5>
              <h5 class="p-3" @click="selectSortOption('Popular')">Popular</h5>
              <h5 class="p-3" @click="selectSortOption('A-Z')">A - Z</h5>
              <h5 class="p-3" @click="selectSortOption('Z-A')">Z - A</h5>
            </div>
          </div>
        </div>

        <div class="flex items-center mt-5 gap-4">
          <h5>Category</h5>
          <div class="dropdown">
            <button @click="toggleDropdown('category')" class="flex items-center gap-2">
              <h5>{{ selectedCategoryName }}</h5>
              <img src="@/assets/images/dropdown.svg" alt="">
            </button>

            <div v-show="isCategoryDropdownOpen" class="dropdown-content">
              <h5 class="p-3" @click="selectCategory('All')">All</h5>
              <h5 class="p-3" v-for="category in categories" :key="category.id" @click="selectCategory(category)">
                {{ category.name }}
              </h5>
            </div>
          </div>
        </div>
      </div>
      <div class="w-1/6 mr-20">
       <Search></Search>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6 mr-20 ml-20 mt-12">
      <BookList :books="books" :component-name="'my-story'" />
    </div>

    <Pagination :currentPage="currentPage" :lastPage="lastPage" @page-change="updatePage" />
  </div>
</template>

<script setup>
import Pagination from '../components/book/Pagination.vue';
import Search from '../components/book/Search.vue';
import { ref, computed, watchEffect, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const route = useRoute();
const router = useRouter();
const store = useStore();

const books = ref([]);
const categories = ref([]);


const searchKeyword = ref(route.query.keyword || '');
console.log("ini searchKeyword", searchKeyword.value);
const sortOption = ref(route.query.sort || 'Newest');
const selectedCategory = computed(() =>  route.query.category || '');
console.log("selectedCategory", selectedCategory.value);

const selectedCategoryName = computed(() => {
  const category = categories.value.find(cat => String(cat.id) === String(selectedCategory.value));
  return category ? category.name : 'All';
});

console.log("selectedCategoryName", selectedCategoryName.value);

const isSortDropdownOpen = ref(false);
const isCategoryDropdownOpen = ref(false);
watch(selectedCategory, (newVal) => {
  console.log("selectedCategory updated:", newVal);
});


onMounted(async () => {
  try {
    categories.value = await store.dispatch('book/getCategoryData');
    if(store.state.bookmark.bookmarks.length === 0) {
        store.dispatch("bookmark/getBookmarks");
    }

  } catch (error) {
    console.error(error);
  }
});

watchEffect(async () => {
  searchKeyword.value = route.query.keyword || '';
  try {
      books.value = await store.dispatch('book/getBookBySort', {
      sortOption: sortOption.value,
      category: selectedCategory.value,
      keyword: searchKeyword.value
    });
      console.log("Book Sort Data dan kategory:", books.value);
  } catch (error) {
    console.error(error);
  }
});

watch(() => route.query.keyword, (newKeyword) => {
  searchKeyword.value = newKeyword || '';
});

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
};

const selectCategory = (category) => {
  selectedCategory.value = category.name; 
  updateQueryParams({ category: category.id !== 'All' ? category.id : undefined });
};

console.log("selectedCategory param", selectCategory.value);


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