import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyB8UqNYSxTM9tgt2IJ3X_eeMb7J3SeYNok');

const App = () => {
  const urlParams = new URLSearchParams(window.location.search);
  let user;
  user = urlParams.get('user');
  if (user) {
    localStorage.setItem('user', user);
    window.location.href = '/';
  }
  user = localStorage.getItem('user');
  if (!user) {
    window.location.href = 'http://localhost:3000/';
  }
  const [chats, setChats] = useState([
    {
      m: 'Hello, I am your EngineeringGPT. How may I help you?',
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
      'Act as a assistant for engineering student and answer to his/her queries: ' +
      msg;

    setMsg('');

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = (await response.text()).replace(
        /\*\*(.*?)\*\*/g,
        '<br><strong>$1</strong><br>'
      );

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
    <div
      className={`fixed inset-0 flex flex-col bg-black text-white ${
        open ? '' : 'hidden'
      }`}>
      <div className="bg-gray-900 text-white py-4 flex flex-row justify-between">
        <h1 className="text-3xl text-center">EngineerGPT</h1>
        <div>
          <span>{JSON.parse(user).email}</span>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = 'http://localhost:3000/';
            }}
            className="ml-4 py-1 px-2 bg-red-500 text-white rounded-lg">
            Logout
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4"
        style={{
          backgroundImage: `url('https://th.bing.com/th/id/OIG1..S44hSONtNMOsoG1IEca?w=1024&h=1024&rs=1&pid=ImgDetMain')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
      }}>
        {chats.map((chat, index) => (
          <div
            key={index}
            className={
              chat.role === 'ai'
                ? 'mb-4 flex justify-start'
                : 'mb-4 flex justify-end'
            }>
            <div
              id="chat-bubble"
              dangerouslySetInnerHTML={{ __html: chat.m }}
              className={
                chat.role === 'ai'
                  ? 'bg-gray-800/75 text-lg text-white rounded-lg py-2 px-4 max-w-md'
                  : 'bg-gray-200/75 text-lg text-gray-800 rounded-lg py-2 px-4 max-w-md'
              }></div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex items-center mb-4 mt-4">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Type a message"
          className="flex-1 py-2 px-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
        />
        <button
          onClick={getResponse}
          className="ml-2 py-2 px-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
