import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import { SuncoLogo } from './Icons';

interface ChatViewProps {
  messages: Message[];
  onQuickReply: (prompt: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, onQuickReply }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickReplies = [
    { title: "Create an image", prompt: "/imagine a futuristic city skyline at sunset" },
    { title: "Explain quantum computing", prompt: "Explain quantum computing in simple terms" },
    { title: "Summarize a file", prompt: "Summarize the attached file" },
    { title: "Write a poem", prompt: "Write a short poem about space" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="mb-4">
            <SuncoLogo />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to SUNCO AI</h2>
          <p className="text-gray-400 max-w-md">
            Start a conversation, upload a file, or create an image. How can I help you today?
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8 max-w-2xl w-full">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => onQuickReply(reply.prompt)}
                className="bg-gray-800 p-4 rounded-lg text-left hover:bg-gray-700 transition-colors group"
              >
                <p className="font-semibold text-gray-200 group-hover:text-purple-300">{reply.title}</p>
                <p className="text-sm text-gray-400">{reply.prompt}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatView;
