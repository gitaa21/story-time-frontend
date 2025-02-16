<template>
  <div class="ml-20 mr-20 pt-32">
    <form @submit.prevent="saveBook">
      <div class="flex mb-10">
        <img src="~/assets/images/arrowleft.svg" alt="">
        <h1 class="text-raisin-black ml-10 font-playfair"><b>{{ isEdit ? 'Edit Story' : 'Write Story' }}</b></h1>
      </div>


      <div class="my-4">
        <BaseInput v-model="bookData.title" type="text" label="Title" placeholder="Enter a story title" />
      </div>

      <div class="my-4">
        <label for="id_category" class="block text-sm font-medium text-gray-700">Category</label>
        <div class="relative">
          <select v-if="categoryList.length" v-model="bookData.id_category" id="id_category"
            class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm text-quartz text-lg px-3 py-5">
            <option disabled value="">Select a category</option>
            <option v-for="category in categoryList" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <p v-else class="text-gray-500 text-sm mt-1">Loading categories...</p>
        </div>
      </div>

      <div class="my-4">
        <p class="text-sm font-medium text-gray-700">Content</p>
        <client-only>
          <RichEditor :model-value="bookData.content" @update:modelValue="bookData.content = $event" />
        </client-only>
      </div>

      <div class="my-4">
        <p class="text-sm font-medium text-gray-700">Cover Image</p>
        <div
          class="relative border-2  rounded-lg w-full h-48 flex flex-wrap items-center justify-center  hover: transition p-3 gap-3">

          <!-- Preview gambar yang sudah diupload -->
          <div v-for="(image, index) in bookData.images.filter(img => !img.isRemoved)" :key="index"
            class="relative w-24 h-24">
            <img :src="'http://127.0.0.1:8000' + image.url" alt="Book Cover"
              class="w-full h-full object-cover rounded-lg shadow-md" />
            <button @click.prevent="removeImage(index)" class="bg-white rounded-full px-2 absolute top-1 right-1 text-raisin-black text-lg font-bold">
              X
            </button>
          </div>
          <div v-for="(image, index) in imagePreviews" :key="index + bookData.images.length" class="relative w-40 h-40">
            <img :src="image" alt="Book Cover" class="w-full h-full object-cover rounded-lg shadow-md" />
            <button @click.prevent="removeImage(index + bookData.images.length)"
              class="bg-white rounded-full px-2 absolute top-1 right-1 text-raisin-black text-lg font-bold">
              X
            </button>
          </div>

          <!-- Tombol Upload -->
          <label for="file-input"
            class="flex flex-col items-center justify-center w-24 h-24 border border-gray-400 rounded-lg cursor-pointer hover:bg-gray-200 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="text-sm text-gray-600">Choose</span>
          </label>

          <Input type="file" id="file-input" label="Cover Images" multiple accept="image/*" @change="imageBook"
            class="hidden" />
        </div>
      </div>

      <BaseButton type="submit" class="btn">Post Story</BaseButton>
    </form>
  </div>

  <p v-if="isEdit">INI EDIT YA SIALAN</p>
</template>

<script setup>
import { reactive, ref, onMounted, defineProps } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import RichEditor from './RichEditor.vue';


const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  book: Object,
});

console.log("iniiii data gambarrrrrrrrrrrrrrrr", props.book?.images || []);

const store = useStore();
const route = useRouter();

const categoryList = ref([]);
const newImages = ref([]);
const imagePreviews = ref([]);
const removedImages = ref([]);

const removeImage = (index) => {
  if (index < bookData.images.length) {
    removedImages.value.push(bookData.images[index].id);
    bookData.images[index].isRemoved = true;
  } else {
    const newIndex = index - bookData.images.length;
    newImages.value.splice(newIndex, 1);
    imagePreviews.value.splice(newIndex, 1);
  }
};

console.log("Images before upload:", newImages.value);

const imageBook = (event) => {
  const files = event.target.files;
  if (files.length) {
    Array.from(files).forEach((file) => {
      const imageUrl = URL.createObjectURL(file);
      imagePreviews.value.push(imageUrl); // Simpan URL preview
      newImages.value.push(file); // Simpan file untuk upload
    });
  }
};

const bookData = reactive({
  title: props.book?.title || '',
  content: props.book?.content || '',
  id_category: props.book?.id_category || '',
  images: Array.isArray(props.book?.images) ? props.book.images : [], // Pastikan array
});

onMounted(async () => {
  try {
    const categories = await store.dispatch('book/getCategoryData');
    categoryList.value = categories;

    if (props.isEdit && props.book) {
      bookData.title = props.book.title || '';
      bookData.content = props.book.content || '';
      bookData.id_category = categories.find(cat => cat.name === props.book.category)?.id || '';
      bookData.images = props.book.images || [];
    }

    console.log("Loaded images:", bookData.images); // Debugging
  } catch (error) {
    console.error('Gagal mengambil kategori:', error);
  }
});

const saveBook = async () => {
  if (!bookData.title || !bookData.id_category || !bookData.content || (bookData.images.length === 0 && newImages.value.length === 0)) {
    alert('All fields must be filled out!');
    return;
  }

  const formData = new FormData();
  formData.append('_method', props.isEdit ? 'PUT' : 'POST');
  formData.append('title', bookData.title);
  formData.append('id_category', bookData.id_category);
  formData.append('content', bookData.content);

  // Tambahkan ID gambar yang dihapus ke formData
  removedImages.value.forEach((id) => {
    formData.append('remove_images[]', id);
  });

  // *Tambahkan gambar baru ke dalam formData*
  newImages.value.forEach((imageUrl) => {
    formData.append('image[]', imageUrl); // Pastikan backend bisa menerima ini
  });

  try {
    let response;
    if (props.isEdit) {
      response = await store.dispatch('book/editBook', { id: props.book.id, payload: formData });
    } else {
      response = await store.dispatch('book/addNewBook', formData);
    }

    // Reset data setelah berhasil
    Object.keys(bookData).forEach((key) => {
      if (key !== 'images') bookData[key] = '';
    });

    newImages.value = [];
    imagePreviews.value = [];

    // route.push(/books/${response.data.book_id});
  } catch (error) {
    console.error('Failed to save book:', error);
  }
};

</script>
