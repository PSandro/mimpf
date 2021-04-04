<template>
  <div>
    <button @click="pingServer()">Ping Server</button>
  </div>
</template>

<script>
import io from 'socket.io-client';
export default {
  name: 'IListenToSockets',
  data() {
    return {
      socket: {},
      context: {}
    }
  },
  created() {
    this.socket = io('http://localhost:3000', {
        path: '/ws/',
    });
  },
  mounted() {
    this.socket.on('connection', () => {
        console.log('connected');
    });
    this.socket.on('pong', () => {
        console.log('pong');
    });
  },

  methods: {
    pingServer() {
      // Send the "pingServer" event to the server.
      console.log(this.socket);
      this.socket.emit('pingServer', 'PING!')
    }
  }
}
</script>
