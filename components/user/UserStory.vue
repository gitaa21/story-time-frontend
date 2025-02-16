<template>
    <div class="flex-1 border-none rounded-xl min-w-[29.2%]"  v-for="i in 6">
        <div class="relative">
            <div class="absolute right-8 bottom-52 rounded-full h-12 w-12 flex items-center justify-center bg-gray-asparagus">
                <img class="h-10 w-10 p-2 overflow-hidden" src="@/assets/images/bookMark.svg" alt="">
            </div>
                <img class="w-full h-auto rounded-t-xl rounded-xl" src="@/assets/images/dazai.jpeg" alt="Card Image">
            <div class="mt-5">
                <h3 class="font-bold text-raisin-black mb-5">
                    Card title
                </h3>
                <p class="mt-1 text-quartz text-justify">
                    Some quick example text to build on the card title and make up the bulk of the card's
                    content.
                </p>
                <div class="flex justify-between mt-2">
                    <div class="flex items-center">
                        <img class="rounded-full h-9 w-9" src="@/assets/images/coba.jpeg" alt="">
                        <p class="ml-2 text-raisin-black font-medium">Dazai Osamu (update) 1</p>
                    </div>
                    <div class="flex items-center">
                        <p class="text-raisin-black">12 March 2024</p>
                        <div>
                            <p class="ml-5 rounded-md px-3 py-1 text-gray-asparagus bg-issabelline">Comedy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>