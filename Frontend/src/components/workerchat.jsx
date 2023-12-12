import React, { useEffect, useState, useRef } from 'react';
import { server, wserver } from '../../server';
import AxiosInstance from '../../axios_instance';
import img from '../assets/img.png'
// import { Navbar } from '../components/Navbar/Navbar';

function WorkerChat() {
  // const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesContainerRef = useRef(null);
  const [UserName, setUserName] = useState('');
  const [chattedUsers, setChattedUsers] = useState([]);
  const [workerId,setWorkerId]=useState('')
  const axios=AxiosInstance()

  const userId = localStorage.getItem('user_id');
//   const workerId = localStorage.getItem('workerId');
  const accessToken=localStorage.getItem('access')

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



  useEffect(() => {
    // Make a GET request to fetch messages
    axios
        .get(`/worker-chat/${userId}/`) // Replace user_id with the actual user ID
        .then((response) => {
            setChattedUsers(response.data);
            console.log(response.data);
            setWorkerId(response.data[0].id)
            
        })
        .catch((error) => {
            console.error('Error fetching messages:', error);
        });
}, [userId]); // Include dependencies as needed







const onSelectUser = (workerId,userId,username) => {
  setUserName(username)
  const fetchData = async () => {
    const data = await fetch_user_messages(workerId, userId);
    if (data) {
      setMessages(data);
      setLoading (false);
    }
  };
  fetchData();

  const roomName = `${workerId}_${userId}`;
  const newSocket = new WebSocket(`wss://${wserver}/wss/chat/${roomName}/`);
  setSocket(newSocket);

  if (socket) {
    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => {
        // Check if the message already exists in the state
        const messageExists = prevMessages.some((message) => message.id === data.id);
      
        // If the message doesn't exist, add it to the state
        if (!messageExists) {
          return [...prevMessages, data];
        }
      
        // If the message already exists, return the current state
        return prevMessages;
      });
    };
  }

  if (messagesContainerRef.current) {
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  }
};




  const handleSendMessage = async () => {
    if (messageInput.trim() === '') return;
    try {
      const newMessage = {
        sender:userId,
        receiver:workerId,
        message_content: messageInput,

        
      };
      console.log(newMessage)
      const response = await createMessage(newMessage);
      if (response) {
        if (socket) {
          socket.send(JSON.stringify(newMessage));
        }
        setMessageInput('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
   
<>
{/* <Navbar/> */}
<div className="flex md:flex-row-reverse flex-wrap mt-8">


  <div className="w-full md:w-3/4 bg-gray-100  text-center text-gray-200">
  <div className="flex md:h-[650px]  antialiased text-gray-800">
      <div className="flex flex-row h-full w-full  overflow-x-hidden">
        <div className="flex flex-col flex-auto h-full p-6">
        

        <div className="flex flex-col flex-auto flex-shrink-0 bg-gray-100 h-full p-4 rounded-2xl rounded-tr-2xl rounded-tl-2xl">
        <div className="bg-white p-1 rounded-xl  flex justify-between">
          <div className="flex gap-3">
            <img src={img}  alt=""  className="h-12 w-12 rounded-full bg-gray-50"/>
            <div> <p className="text-base font-semibold">{UserName}</p>
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
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
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
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
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
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
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
    </div>
  <div className="w-full md:w-1/4  bg-[#e4f2ee]  p-2 text-gray-700">
    <span className='text-start text-2xl font-bold text-green-500 mb-10'>CHATS</span>
  <div className="chat-list h-12 mt-6 ">
      {chattedUsers.map((user) => (
    <div className='text-black font-mono text-xl border-b-4 border' key={user.id} onClick={() => onSelectUser(user.id,userId,user.data.username)}>
      {user.data.username}
    </div>
    
  ))}
    </div>
  </div>
</div>

</>


    
  );
}

export default WorkerChat;
