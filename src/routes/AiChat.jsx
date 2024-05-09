import { useState, useEffect } from 'react';
import React from 'react'
import {io} from 'socket.io-client'
import '../../index.css'
function ChatMessage({message, type}){
  return(

    <div className={`flex w-full ${type ==="send" ? "justify-start" :"justify-end"}`}>
      {type==="send" ? (
              <div className="bg-violet-500 p-2 rounded-b-lg rounded-tr-lg text-white">{message}</div>

      ): (

        <div className="bg-white p-2 rounded-b-lg rounded-tr-lg text-black">{message}</div>


      )}
    </div>

  )
}


function AiChat() {
//initializing server
  const [socket, setSocket]=useState(null);
  const [input_message, setInputMessage]=useState("")
  const [messages, setMessages]=useState([])
  useEffect(()=>{
    const newSocket=io("http://localhost:8080")
    setSocket(newSocket)

    newSocket.on("response", (message)=>{
      setMessages([
        ...messages,
        {
          type:"receive",
          message,
        },
      ])
    })
    
    return()=>newSocket.close()
  },[])


  const sendMessage=()=>{
    setMessages([
      ...messages,
      {
        type:"send",
        message: input_message,
      },
    ])
    setInputMessage("");
    socket.emit("message", input_message);
  }
    
    return (
      <div className="p-5 h-screen bg-black">
        <div className="container mx-auto bg-gray-900 h-full flex flex-col">
          <div className="flex-grow p-3 flex flex-row items-end ">
            <div className="w-full space-y-3">
            {messages.map((message, index)=>(
              <ChatMessage 
              key={index}
              message={message.message}
              type={message.type}/>
            ))}
  
            </div>
  
          </div>
          <div className="h-[100px] p-3 flex justify-center items-center bg-gray-700">
            <input
              onKeyDown={(e)=>{
                if(e.key==="Enter"){
                  sendMessage();
                }
              }}
              type="text"
              value={input_message}
              onChange={(e)=>setInputMessage(e.target.value)}
              placeholder="Type something..."
              className="w-full p-2 bg-transparent text-whte border-white border-2 rounded-md outline-none"
            />
            <button onClick={sendMessage}className="bg-violet-600 px-3 py-2 rounded-md mx-2 text-white cursor-pointer">
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  


export default AiChat;
