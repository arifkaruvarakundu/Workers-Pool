import React, { useEffect, useState, useRef } from 'react';
import { server, wserver } from '../../server';
import AxiosInstance from '../../axios_instance';
import img from '../assets/img.png'



function UserChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesContainerRef = useRef(null);
  const [workerName, setWorkerName] = useState('');
  // const [workerImage, setWorkerImage] = useState(null);

  const axios=AxiosInstance()

  const userId = localStorage.getItem('user_id');
  const workerId = localStorage.getItem('workerId');
  const accessToken=localStorage.getItem('access')
  const worker_username =localStorage.getItem('worker_username')

  console.log(workerId)

  function isOpen(ws) { return ws.readyState === ws.OPEN }

  const fetch_user_messages = async(userId,workerId)=>{
        try{
        const response = await axios.get(`${server}/chat/${userId}/${workerId}/`,
        // {headers}
        );
        return response.data
    }catch(error){
        console.error("error for fetchig messages:",error)
        return null
    }
    }



const socketRef = useRef(null);
const roomName = `${userId}_${workerId}`;

useEffect(() => {
    const newSocket = new WebSocket(`ws://${wserver}/ws/chat/${roomName}/`);
    socketRef.current = newSocket;
    setSocket(newSocket);

    const fetchData = async () => {
        const data = await fetch_user_messages(userId, workerId,accessToken);
        if (data) {
            setMessages(data);
            setLoading(false);
        }
    };
    fetchData();

    return () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.close();
        }
    };
}, [roomName]);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await fetch_user_messages(userId, workerId);
  //     if (data) {
  //       setMessages(data);
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();

  //   const roomName = `${userId}_${workerId}`;
  //   const newSocket = new WebSocket(`ws://http://127.0.0.1:8000/chat/${roomName}/`);
  //   setSocket(newSocket);
  // }, [userId, workerId]);

  useEffect(() => {
    const socket = socketRef.current;
    if (socket) {
        const handleOpen = () => {
            console.log('WebSocket connection opened');
        };
        const handleMessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        socket.addEventListener('open', handleOpen);
        socket.addEventListener('message', handleMessage);

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
            socket.removeEventListener('open', handleOpen);
            socket.removeEventListener('message', handleMessage);
        };
    }
}, [socketRef]);


  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);


const createMessage = async(formData)=>{
    try{
      const response = await axios.post(`${server}/create/`,formData,{
        // headers
      })
      return response.data
    }catch(error){
      console.error('error creating message:',error)
      return null
    }
}

const handleSendMessage = async () => {
    if (messageInput.trim() === '') return;
    try {
        const newMessage = {
            sender: userId,
            receiver: workerId,
            message_content: messageInput,
        };

        console.log(newMessage);
        const response = await createMessage(newMessage);
        if (response) {
            if (socketRef.current) {
                if (!isOpen(socket)) return;
                socketRef.current.send(JSON.stringify(newMessage));
            }
            setMessageInput('');
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
};


  return (
    <>
    <div className="flex md:h-[500px]  antialiased text-gray-800">
      <div className="flex flex-row h-full w-full  overflow-x-hidden">
        <div className="flex flex-col flex-auto h-full p-6">
        

        <div className="flex flex-col flex-auto flex-shrink-0 bg-gray-100 h-full p-4 rounded-2xl rounded-tr-2xl rounded-tl-2xl">
        <div className="bg-white p-1 rounded-xl  flex justify-between">
          <div className="flex gap-3">
            <img src={img}  alt=""  className="h-12 w-12 rounded-full bg-gray-50"/>
            <div> <p className="text-base font-semibold">{worker_username}</p>
            <p className="text-xs">active recently</p>
            </div>
          </div>
        </div>
            <div className="flex flex-col  h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-12 gap-y-2">
                  {messages.map((message, index) => (
                    <div
                      onClick={() => {
                        console.log(
                          "Condition evaluation:",
                          message.sender != workerId
                        );
                      }}
                      key={index}
                      className={
                        message.sender != userId
                          ? "col-start-1 col-end-8 p-3 rounded-lg"
                          : "col-start-6 col-end-13 p-3 rounded-lg"
                      }
                    >
                      <div
                        key={index}
                        className={
                          message.sender != userId
                            ? "flex flex-row items-center"
                            : "flex items-center justify-start flex-row-reverse"
                        }
                      >
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                          {message.sender != workerId ? (
                            <div><svg xmlns="" fill="none" viewBox="0 0 24 24" width="24" height="24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15 -15m0 0h-11.25m11.25 0V15.75" />
                          </svg>
                          
                          
                          </div>
                          ) : (
                            <div><svg xmlns="" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
                          </svg>
                          </div>
                          )}
                        </div>
                        <div
                          className={`relative mr-3 text-sm py-2 px-4 shadow rounded-xl ${
                            message.sender != userId
                              ? "  bg-indigo-100"
                              : " bg-white"
                          }`}
                        >
                          <div> {message.message_content}</div>
                          <div className="absolute text-xs bottom-0 left-0 -mb-5 mr-2 text-gray-500">
                            {new Date(message.timestamp).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
              <div>
                <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns=""
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="flex-grow ml-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                  />
                  <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns=""
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="ml-4">
                <button
                  onClick={handleSendMessage}
                  className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                >
                  <span>Send</span>
                  <span className="ml-2">
                    <svg
                      className="w-4 h-4 transform rotate-45 -mt-px"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="#"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}

export default UserChat;
