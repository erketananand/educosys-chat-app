<template>
    <div class="absolute flex justify-center items-center top-10 w-full">
        <div
            :class="`rounded-lg shadow-xl break-normal  truncate flex justify-center animate-fade items-center  w-90  px-10 py-4 h-auto  text-center text-white font-bold ${isEnter ? ' bg-green-500' : 'bg-red-500'}`"
        >{{ description }}</div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    description: {
        type: String,
        required: true
    },
    isEnter: {
        type: Boolean,
        required: true
    }
})
</script>



 