import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyB8UqNYSxTM9tgt2IJ3X_eeMb7J3SeYNok");

const App = () => {
    const [chats, setChats] = useState([{ m: "Hello, I am your Sugar Tender Management Assistant. How may I help you?", role: "ai" }]);
    const [msg, setMsg] = useState("");
    const [open, setOpen] = useState(true);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            getResponse();
        }
    };

    const getResponse = async () => {
        if (!msg.trim()) return;

        setChats(chats => [...chats, { m: msg, role: 'me' }]);

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = "Act as a sugar tenders management assistant and respond to this query: " + msg;

        setMsg("");

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();

            setChats(chats => [...chats, { m: text, role: "ai" }]);
        } catch (error) {
            console.error("Error fetching response:", error);
            setChats(chats => [...chats, { m: "Sorry, I couldn't understand. Please try again.", role: "ai" }]);
        }
    };

    return (
        <div className={`fixed inset-0 flex flex-col bg-black text-white ${open ? '' : 'hidden'}`}>
            <div className="bg-gray-900 text-white py-4">
                <h1 className="text-3xl text-center">EngineerGPT</h1>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                {chats.map((chat, index) => (
                    <div key={index} className={chat.role === "ai" ? "mb-4 flex justify-start" : "mb-4 flex justify-end"}>
                        <div className={chat.role === "ai" ? "bg-gray-800 text-white rounded-lg py-2 px-4 max-w-md" : "bg-gray-200 text-gray-800 rounded-lg py-2 px-4 max-w-md"}>
                            {chat.m}
                        </div>
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
                <button onClick={getResponse} className="ml-2 py-2 px-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                    Send
                </button>
            </div>
        </div>
    );
};

export default App;
