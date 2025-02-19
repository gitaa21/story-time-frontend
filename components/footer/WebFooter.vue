<template>
    <div class="border-t-2 border-quartz mt-20">
        <div class="flex justify-between mr-20 ml-20 mt-5 mb-5">
            <p>&copy; 2024 PT. Timedoor Indonesia. All rights reserved.</p>
            <div class="flex gap-6 text-raisin-black">
                <NuxtLink to="https://facebook.com" target="_blank">
                    <FontAwesomeIcon :icon="['fab', 'facebook']" class="text-3xl transition duration-300 ease-in-out hover:text-gray-asparagus" />
                </NuxtLink>
                <NuxtLink to="https://instagram.com" target="_blank">
                    <FontAwesomeIcon icon="fa-brands fa-instagram" class="text-3xl transition duration-300 ease-in-out hover:text-gray-asparagus" />
                </NuxtLink>
                <NuxtLink to="https://youtube.com" target="_blank">
                    <FontAwesomeIcon icon="fa-brands fa-youtube" class="text-3xl transition duration-300 ease-in-out hover:text-gray-asparagus" />
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
