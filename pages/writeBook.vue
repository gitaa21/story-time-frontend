<template>
    <BookForm />
</template>

<script setup>
defineProps({
  isEdit: {
    type: Boolean,
    default: false
  }
})
</script>