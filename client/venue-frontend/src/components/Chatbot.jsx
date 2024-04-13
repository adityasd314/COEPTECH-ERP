'use client';

import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyB8UqNYSxTM9tgt2IJ3X_eeMb7J3SeYNok');

const Chatbot = ({mess="Hello, I am your College ERP Management Assistant. How may I help you?", initialPrompt='Act as a College ERP assistant and respond to this query: '}) => {
  const [chats, setChats] = useState([
    {
      m: mess,
      role: 'ai',
    },
  ]);
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(true);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      getResponse();
    }
  };

  const getResponse = async () => {
    if (!msg.trim()) return;

    setChats((chats) => [...chats, { m: msg, role: 'me' }]);

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt =
      initialPrompt + msg ;

      console.log(prompt);

    setMsg('');

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      setChats((chats) => [...chats, { m: text, role: 'ai' }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setChats((chats) => [
        ...chats,
        { m: "Sorry, I couldn't understand. Please try again.", role: 'ai' },
      ]);
    }
  };

  return (
    <div>
      <div className="fixed bottom-0 z-50 right-0 mb-4 mr-4">
        <button
          onClick={() => setOpen(!open)}
          id="open-chat"
          style={{backgroundColor: '#1f2937'}}
          className="btn_primary text-white py-8 px-4 rounded-full transition duration-300 flex items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/10881/10881863.png"
            className="w-6 h-6"
            alt="Chatbot"
          />
        </button>
      </div>
      <div
        id="chat-container"
        className={
          open
            ? 'hidden fixed bottom-16 right-4 w-96'
            : 'fixed bottom-16 right-4 w-96'
        }
        style={{ zIndex: 999 }}>
        <div className="bg-white shadow-md rounded-lg max-w-lg w-full">
          <div className="p-4 border-b text-white rounded-t-lg flex justify-between items-center" style={{backgroundColor: '#1f2937'}}>
            <p className="text-lg font-semibold text-white">Engineer GPT</p>
            <button
              onClick={() => setOpen(!open)}
              id="close-chat"
              className="text-black bg-white  hover:text-gray-400 focus:outline-none focus:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            id="chatbox"
            className="p-4 h-80 bg-green-400/[0.5] overflow-y-auto">
            {chats.map((chat, index) => (
              <div
                key={index}
                className={chat.role === 'ai' ? 'mb-2' : 'mb-2 text-right'}>
                <p
                  className={
                    chat.role === 'ai'
                      ? 'bg-gray-900 text-white rounded-lg py-2 px-4 inline-block'
                      : 'bg-blue-500 text-white rounded-lg py-2 px-4 inline-block'
                  }>
                  {chat.m}
                </p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              id="user-input"
              type="text"
              placeholder="Type a message"
              className="w-full px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <button
              onClick={getResponse}
              id="send-button"
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800">
              <span className="relative px-5 py-3 rounded-md group-hover:bg-opacity-0">
                Send
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
