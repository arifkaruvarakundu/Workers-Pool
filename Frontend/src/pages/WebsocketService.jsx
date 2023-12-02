class WebSocketService {
    constructor() {
      this.socket = new WebSocket(`ws://${wserver}/ws/notifications/${roomName}`);
  
      this.socket.onopen = () => {
        console.log('WebSocket connection established.');
      };
  
      this.socket.onclose = (event) => {
        if (event.wasClean) {
          console.log(`Closed cleanly, code=${event.code}, reason=${event.reason}`);
        } else {
          console.error('Connection died');
        }
      };
  
      this.socket.onerror = (error) => {
        console.error(`WebSocket Error: ${error}`);
      };
    }
  
    sendMessage(message) {
      this.socket.send(JSON.stringify({ message }));
    }
  
    closeConnection() {
      this.socket.close();
    }
  }
  
  export default WebSocketService;
  