import React from 'react';
import { Message, Role } from '../types';
import { SuncoLogo, DownloadIcon } from './Icons';
import Loader from './Loader';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  const handleDownload = (base64: string, filename: string) => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${base64}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className={`flex gap-4 items-start ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <SuncoLogo />
        </div>
      )}
      <div
        className={`max-w-xl rounded-2xl px-5 py-3 shadow-lg transition-all duration-300 ${
          isUser
            ? 'bg-purple-600 text-white rounded-br-none'
            : 'bg-gray-800 text-gray-200 rounded-bl-none'
        }`}
      >
        {message.isLoading ? (
          <Loader />
        ) : (
          <div className="prose prose-invert prose-sm leading-relaxed">
            {message.text.split('\n').map((line, index) => <p key={index}>{line}</p>)}
            {message.image && (
                <div className="mt-4 relative group">
                    <img src={`data:image/jpeg;base64,${message.image}`} alt="Generated content" className="rounded-lg shadow-md" />
                    <button
                        onClick={() => handleDownload(message.image!, 'sunco-ai-image.jpg')}
                        className="absolute top-2 right-2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                       <DownloadIcon />
                    </button>
                </div>
            )}
            {message.file && (
              <div className="mt-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                <p className="font-semibold text-purple-300">File Attached:</p>
                <p className="text-sm truncate">{message.file.name}</p>
                <p className="text-xs text-gray-400">{(message.file.size / 1024).toFixed(2)} KB</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
