<template>
  <notification-vue :description="description" :isEnter="isEnter" v-if="notify" />
  <div class="lg:min-h-150 bg-gray-100 flex flex-col justify-center px-6 lg:px-8">
    <rooms-vue v-if="activeComponent === 'roomsVue'" @changeComponent="updateActiveComponent" />
    <login-vue v-if="activeComponent === 'loginVue'" @changeComponent="updateActiveComponent" />
    <chat-vue v-if="activeComponent === 'chatVue'" @updateDescription="setDescription"
      @changeComponent="updateActiveComponent" />
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue';
import { $io, $cookies } from '../main';
import loginVue from '../components/login.vue';
import chatVue from '../components/chat.vue';
import roomsVue from '../components/rooms.vue';
import notificationVue from '../components/notification.vue';
import { INotification } from '../../shared/types/notification';

const activeComponent = ref('roomsVue'),
  notify = ref(false),
  isEnter = ref(false),
  description = ref('');

function updateActiveComponent(e) {
  activeComponent.value = e;
}

function setDescription(event: INotification) {
  notify.value = true
  description.value = event.description;
  isEnter.value = !!event.isEnter;
  setTimeout(() => {
    notify.value = false
  }, 3000)
}

onUnmounted(() => {
  $io.emit('disconnect');
});

onMounted(() => {
  if ($cookies.get('room') && $cookies.get('userName')) {
    let room = $cookies.get('room');
    let userName = $cookies.get('userName');
    let roomPassword = $cookies.get('roomPassword');

    $io.emit('joinRoom', {
      room,
      userName,
      roomPassword
    }, (data) => {
      if (data.success) {
        activeComponent.value = 'chatVue';
      }
    });
  }

});
</script>