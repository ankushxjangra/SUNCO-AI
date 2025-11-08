import React from 'react';
import { SuncoLogo, PlusIcon } from './Icons';
import { ChatSession } from '../types';

interface SidebarProps {
  onNewChat: () => void;
  isStreaming: boolean;
  chatHistory: ChatSession[];
  onSelectChat: (chatId: string) => void;
  activeChatId: string | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onNewChat, 
  isStreaming, 
  chatHistory,
  onSelectChat,
  activeChatId,
  onLogout
}) => {
  return (
    <aside className="bg-[#111111] w-64 p-4 flex-shrink-0 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <SuncoLogo />
        <h1 className="text-xl font-bold text-white tracking-wider">SUNCO AI</h1>
      </div>
      <button
        onClick={onNewChat}
        disabled={isStreaming}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-200 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(168,85,247,0.5)] hover:shadow-[0_0_15px_rgba(168,85,247,0.8)]"
      >
        <PlusIcon />
        New Chat
      </button>
      <div className="flex-grow overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Chat History
        </h2>
        <ul className="space-y-2">
          {chatHistory.sort((a, b) => b.createdAt - a.createdAt).map((session) => (
            <li key={session.id}>
              <button
                onClick={() => onSelectChat(session.id)}
                className={`w-full text-left block text-sm truncate rounded-md px-3 py-2 transition-colors ${
                  activeChatId === session.id 
                    ? 'bg-purple-600/30 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {session.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-700/50 pt-4 mt-4">
        <button 
          onClick={onLogout}
          className="w-full text-left text-sm text-gray-300 hover:bg-gray-800 rounded-md px-3 py-2 transition-colors"
        >
          Log Out
        </button>
         <div className="text-xs text-gray-500 mt-4">
          <p>&copy; {new Date().getFullYear()} Sunco AI</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
