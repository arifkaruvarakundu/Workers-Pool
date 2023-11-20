import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const ChatRoom = () => {
  const { workerId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [websocket, setWebsocket] = useState(null);

  useEffect(() => {
    const ws = new W3CWebSocket(`ws://127.0.0.1:8000/ws/chat/${workerId}/`);

    ws.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      setMessages([...messages, data]);
    };

    setWebsocket(ws);

    return () => {
      ws.close();
    };
  }, [workerId]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (websocket && inputMessage.trim() !== '') {
      const messageData = {
        message: inputMessage,
        username: localStorage.getItem('worker_username'),
      };

      websocket.send(JSON.stringify(messageData));
      setInputMessage('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}: </strong>
            {msg.message}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
