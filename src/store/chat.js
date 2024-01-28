import { defineStore } from 'pinia';
import { useCookies } from 'vue3-cookies';

const { cookies } = useCookies();

const useChatStore = defineStore('chatStore', {
  state: () => ({
    room: null,
    userName: '',
    roomPassword: '',
  }),
  getters: {
    getRoom() {
      return this.room || cookies.get('room');
    },
    getUserName() {
      return this.userName || cookies.get('userName');
    },
    getRoomPassword() {
      return this.roomPassword || cookies.get('roomPassword');
    },
  },
  actions: {
    setRoom(room) {
      cookies.set('room', room);
      this.room = room;
    },
    setUserName(userName) {
      cookies.set('userName', userName);
      this.userName = userName;
    },
    setRoomPassword(roomPassword) {
      cookies.set('roomPassword', roomPassword);
      this.roomPassword = roomPassword;
    },
    logOut() {
      cookies.remove('room');
      cookies.remove('userName');
      cookies.remove('roomPassword');
      this.setRoom(null);
      this.setUserName('');
      this.setRoomPassword('');
    },
  },
});

export default useChatStore;