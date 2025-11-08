import React, { useState, useEffect, useCallback } from 'react';
import { Chat, Content, Part } from '@google/genai';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import ChatInput from './components/ChatInput';
import Auth from './components/Auth';
import { Message, Role, FileAttachment, User, ChatSession } from './types';
import { startChatSession, generateImage, editImage } from './services/geminiService';
import * as firebaseService from './services/firebaseService';
// Fix: Import SuncoLogo to resolve 'Cannot find name' error.
import { SuncoLogo } from './components/Icons';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = firebaseService.onAuthStateChanged(user => {
      setCurrentUser(user);
      if (user) {
        firebaseService.getChatHistoryForUser(user.uid).then(setChatHistory);
      } else {
        setChatHistory([]);
        setMessages([]);
        setActiveChatId(null);
        setChat(null);
      }
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setChat(startChatSession());
  };
  
  const handleSelectChat = async (chatId: string) => {
    if (isStreaming) return;
    setActiveChatId(chatId);
    setMessages([{ id: 'loading', role: Role.MODEL, text: '', isLoading: true }]);
    
    const fetchedMessages = await firebaseService.getMessagesForChat(chatId);
    setMessages(fetchedMessages);
    
    const history: Content[] = fetchedMessages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }] as Part[]
    }));
    
    setChat(startChatSession(history));
  };
  
  const handleLogout = () => {
    firebaseService.signOutUser();
  };

  const handleSendMessage = async (text: string, file?: FileAttachment) => {
    if (!currentUser) return;
    
    let activeChat = chat;
    if (!activeChat) {
      activeChat = startChatSession();
      setChat(activeChat);
    }
    
    setIsStreaming(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: text,
      file: file,
      timestamp: Date.now(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    let currentChatId = activeChatId;

    // Create a new chat session if this is the first message
    if (!currentChatId) {
      const newChatSession = await firebaseService.createNewChat(currentUser.uid, text || file?.name || 'New Chat');
      currentChatId = newChatSession.id;
      setActiveChatId(currentChatId);
      setChatHistory(prev => [newChatSession, ...prev]);
    }
    
    await firebaseService.addMessageToChat(currentChatId, userMessage);

    const modelResponseId = (Date.now() + 1).toString();
    const modelLoadingMessage: Message = {
      id: modelResponseId,
      role: Role.MODEL,
      text: '',
      isLoading: true,
    };
    setMessages((prev) => [...prev, modelLoadingMessage]);

    try {
        let modelResponse: Message | null = null;
        if (text.startsWith('/imagine')) {
            const prompt = text.replace('/imagine', '').trim();
            const imageBase64 = await generateImage(prompt);
            modelResponse = { ...modelLoadingMessage, text: `Here is the image you requested for: "${prompt}"`, image: imageBase64, isLoading: false, timestamp: Date.now() };
        } else if (file && file.type.startsWith('image/')) {
            const imageBase64 = await editImage(text, file.base64, file.type);
            modelResponse = { ...modelLoadingMessage, text: `Here is the edited image:`, image: imageBase64, isLoading: false, timestamp: Date.now() };
        } else {
            const promptParts: Part[] = [];
            if (text) promptParts.push({ text });
            if (file) promptParts.push({ inlineData: { data: file.base64, mimeType: file.type } });
            
            const result = await activeChat.sendMessageStream({ message: promptParts });
            
            let accumulatedText = '';
            for await (const chunk of result) {
              accumulatedText += chunk.text;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === modelResponseId ? { ...msg, text: accumulatedText, isLoading: false } : msg
                )
              );
            }
            modelResponse = { ...modelLoadingMessage, text: accumulatedText, isLoading: false, timestamp: Date.now() };
        }
        if (modelResponse) {
             setMessages((prev) => prev.map((msg) => msg.id === modelResponseId ? modelResponse! : msg));
             await firebaseService.addMessageToChat(currentChatId, modelResponse);
        }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorResponse = { ...modelLoadingMessage, text: 'Sorry, something went wrong. Please try again.', isLoading: false, timestamp: Date.now() };
      setMessages((prev) => prev.map((msg) => msg.id === modelResponseId ? errorResponse : msg));
      await firebaseService.addMessageToChat(currentChatId, errorResponse);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleQuickReply = (prompt: string) => {
    if(prompt.startsWith("/imagine")) {
        handleSendMessage(prompt);
    } else {
        const input = document.querySelector('textarea');
        if(input) {
            input.value = prompt;
            input.focus();
            const event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);
        }
    }
  }
  
  if (isLoadingAuth) {
    return <div className="flex h-screen w-screen bg-black items-center justify-center"><SuncoLogo /></div>
  }
  
  if (!currentUser) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen w-screen bg-black text-white font-sans overflow-hidden">
      <div className={`transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0`}>
          <Sidebar 
            onNewChat={handleNewChat} 
            isStreaming={isStreaming}
            chatHistory={chatHistory}
            onSelectChat={handleSelectChat}
            activeChatId={activeChatId}
            onLogout={handleLogout}
          />
      </div>
      <div className="flex flex-col flex-1 bg-[#1c1c1c] relative">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute top-4 left-4 z-10 md:hidden bg-gray-800 p-2 rounded-md">
            ☰
        </button>
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatView messages={messages} onQuickReply={handleQuickReply} />
          <ChatInput onSendMessage={handleSendMessage} isStreaming={isStreaming} />
        </main>
        <footer className="fixed bottom-1 right-4 text-xs text-white opacity-70 pointer-events-none">
          THIS AI IS MADE BY KARAM SINGH
        </footer>
      </div>
    </div>
  );
};

export default App;