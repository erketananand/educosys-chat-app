
<template>
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-300">
        <div class="bg-white py-10 px-6 shadow rounded-lg sm:px-10 h-100">
            <h1 class="text-center font-bold text-2xl">Room: {{ room.name }}</h1>

            <form class="mb-0 space-y-6" @submit.prevent="joinRoom()">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="userName">User Name</label>
                    <input
                        :class="'shadow block text-sm font-medium w-full  appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' + (nameError ? ' border-red-500' : '')"
                        id="userName" v-model="userName" type="text" @focus="nameError = false" placeholder="Username" />
                    <p v-if="nameError" class="text-red-500 text-xs italic">{{ nameMsg }}</p>
                </div>

                <div v-if="room.hasPassword">
                    <label class="block text-gray-700 text-sm font-bold mb-2 mt-7" for="password">Room Password</label>
                    <input
                        :class="'shadow appearance-none border w-full  rounded  py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline' + (passError ? ' border-red-500' : '')"
                        id="password" v-model="password" @focus="passError = false" type="password"
                        placeholder="******************" />
                    <p v-if="passError" class="text-red-500 text-xs italic">{{ passMsg }}</p>
                </div>
                <div>
                    <button type="submit"
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Log
                        in</button>

                    <a @click="$emit('changeComponent', 'roomsVue')"
                        class="flex justify-center py-5 px-4 mt-10 text-sm font-medium text-blue cursor-pointer">
                        Back to Rooms
                    </a>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { $io } from '../main';
import useChatStore from '../store/chat';
import { storeToRefs } from 'pinia';
const emit = defineEmits(['changeComponent']);
const chatStore = useChatStore();
const { getRoom: room, getUserName } = storeToRefs(chatStore),
    userName = ref(getUserName.value),
    passError = ref(false),
    nameError = ref(false),
    nameMsg = ref(''),
    passMsg = ref(''),
    password = ref('');


const joinRoom = () => {

    $io.emit('joinRoom', {
        room: room.value,
        userName: userName.value,
        password: password.value
    }, (data) => {
        if (!data.success) {
            if (data.type == 'name') {
                nameMsg.value = data.error
                nameError.value = true
            } else {
                passMsg.value = data.error
                passError.value = true
            }
        } else {
            chatStore.setRoom(data.room);
            chatStore.setUserName(userName.value);
            chatStore.setRoomPassword(password.value);
            emit('changeComponent', 'chatVue');
        }
    });
}
</script>
