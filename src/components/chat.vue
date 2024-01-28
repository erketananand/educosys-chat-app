<template>
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-300">
        <div class="flex justify-evenly mb-4">
            <h3 class="font-bold text-2xl">Active User Number: {{ room.users.length }}</h3>
            <h3 class="font-bold text-2xl">Room: {{ room.name }}</h3>
        </div>

        <div class="bg-white py-10 px-6 shadow rounded-lg sm:px-10 h-100">
            <div id="chatBox"
                class="flex flex-col items-stretch overflow-auto h-full scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                <div class="chat-message mt-2" v-for="message in receivedMessages" :key="message.user + message.text">
                    <div
                        :class="message.user == userName ? 'flex items-end justify-end' : 'flex items-end justify-start'">
                        <div
                            :class="message.user == userName ? 'flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end' : ' flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start'">
                            <div>
                                <span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">{{
                                    message.text }}</span>
                            </div>
                            <small>{{ message.user }}</small>
                        </div>
                        <img src="../assets/profile.png"
                            alt="My profile" class="w-6 h-6 rounded-full order-1" />
                    </div>
                </div>
            </div>
        </div>

        <div>
            <form @submit.prevent="sendMessage">
                <input type="text"
                    :class="'w-full my-8 py-2 px-4 border border-transparent rounded-md shadow-sm focus:outline-blue-300 focus:shadow-outline ' + (msgError ? ' border-red-500' : '')"
                    placeholder="Please insert a message" v-model="message" />

                <button type="submit"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Send
                    Message</button>

                <a @click="logOut"
                    class="flex justify-center py-2 px-4 mt-5 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-red-500 cursor-pointer hover:bg-red-700">Leave
                    Room</a>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import useChatStore from '../store/chat';
import { $io } from '../main';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['changeComponent', 'updateDescription']);
const chatStore = useChatStore();
const {getUserName: userName} = storeToRefs(chatStore);
const receivedMessages = ref([] as Array<{ user: string, text: string }>),
    room = ref(chatStore.getRoom),
    message = ref(''),
    msgError = ref(false);

onMounted(() => {
    $io.on('message', async (data) => {
        receivedMessages.value.push(data);
    })
    $io.on('notification', (data) => {
        emit('updateDescription', data);
        getRoom()
    });

});

function sendMessage() {
    if (message.value != '') {
        $io.emit('sendMessage', message.value)
        message.value = ''
        setTimeout(() => {
            const container: any = document.getElementById('chatBox');
            container.scrollTop = container.scrollHeight;
        });
    } else {
        msgError.value = true;
    }
}

function logOut() {
    chatStore.logOut();
    $io.emit('leaveRoom');
    emit('changeComponent', 'roomsVue');
}

function getRoom() {
    $io.emit('getRoom', room.value.id, (data) => {
        room.value = data.room
    })
}
</script>