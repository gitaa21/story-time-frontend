<template>
    <button @click="$emit('clickButton')">
        <slot></slot>
    </button>
</template>