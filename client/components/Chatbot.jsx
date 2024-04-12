import React, { useState } from 'react';
import { getUserInfo } from '@/services/auth.services';
import { ENUM_USER_ROLE } from "@/enums/userRole";
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyB8UqNYSxTM9tgt2IJ3X_eeMb7J3SeYNok");

const Chatbot = () => {
    const [chats, setChats] = useState([{ m: "Hello, I am your Sugar Tender Management Assistant. How may I help you?", role: "ai" }]);
    const [msg, setMsg] = useState("");
    const [open, setOpen] = useState(true);
    const role = getUserInfo().role;

    const getResponse = async () => {
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
        <div className={role === ENUM_USER_ROLE.candidate ? "hidden" : ""}>
            <div className="fixed bottom-0 right-0 mb-4 mr-4">
                <button onClick={() => setOpen(!open)} id="open-chat" className="btn_primary text-white py-8 px-4 rounded-full transition duration-300 flex items-center">
                    <img src="https://cdn-icons-png.flaticon.com/512/10881/10881863.png" className="w-6 h-6" alt="Chatbot" />
                </button>
            </div>
            <div id="chat-container" className={open ? "hidden fixed bottom-16 right-4 w-96" : "fixed bottom-16 right-4 w-96"} style={{ zIndex: 999 }}>
                <div className="bg-white shadow-md rounded-lg max-w-lg w-full">
                    <div className="p-4 border-b bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
                        <p className="text-lg font-semibold">Sugar Tender Bot</p>
                        <button onClick={() => setOpen(!open)} id="close-chat" className="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div id="chatbox" className="p-4 h-80 overflow-y-auto">
                        {chats.map((chat, index) => (
                            <div key={index} className={chat.role === "ai" ? "mb-2" : "mb-2 text-right"}>
                                <p className={chat.role === "ai" ? "bg-gray-200 text-gray-700 rounded-lg py-2 px-4 inline-block" : "bg-blue-500 text-white rounded-lg py-2 px-4 inline-block"}>{chat.m}</p>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t flex">
                        <input value={msg} onChange={(e) => setMsg(e.target.value)} id="user-input" type="text" placeholder="Type a message" className="w-full px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button onClick={getResponse} id="send-button" className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300">Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
