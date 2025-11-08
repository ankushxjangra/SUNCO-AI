import React, { useState, useRef, useEffect } from 'react';
import { AttachmentIcon, MicIcon, SendIcon } from './Icons';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { FileAttachment } from '../types';
import { fileToBase64 } from '../utils/fileUtils';

interface ChatInputProps {
  onSendMessage: (text: string, file?: FileAttachment) => void;
  isStreaming: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isStreaming }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition();

  // Fix: Added a state to track if the send button should be active for better visual feedback.
  const isSendActive = !isStreaming && (text.trim() !== '' || !!file);

  useEffect(() => {
    if (transcript) {
      setText((prev) => prev + transcript);
    }
  }, [transcript]);

  const handleSendMessage = async () => {
    const trimmedText = text.trim();
    if (!trimmedText && !file) return;

    let fileAttachment: FileAttachment | undefined;
    if (file) {
      const base64 = await fileToBase64(file);
      fileAttachment = {
        name: file.name,
        type: file.type,
        size: file.size,
        base64,
        previewUrl: filePreview!,
      };
    }

    onSendMessage(trimmedText, fileAttachment);
    setText('');
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="bg-gray-800 p-4 border-t border-gray-700">
      <div className="max-w-4xl mx-auto">
        {filePreview && (
          <div className="mb-3 px-3 py-2 bg-gray-900 rounded-lg flex items-center justify-between animate-fade-in-up">
            <div className="flex items-center gap-3">
              {file?.type.startsWith('image/') ? (
                <img src={filePreview} alt="preview" className="w-12 h-12 rounded-md object-cover"/>
              ) : (
                <div className="w-12 h-12 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-xs font-bold text-white uppercase">{file?.name.split('.').pop()}</span>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-white truncate">{file?.name}</p>
                <p className="text-xs text-gray-400">{file && (file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button onClick={removeFile} className="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
        )}
        {/* Fix: Improved focus state for a more 'animated' and premium feel. */}
        <div className="relative flex items-center bg-[#1e1e1e] rounded-2xl shadow-lg border border-gray-700/50 focus-within:border-purple-500 focus-within:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-300">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Message SUNCO AI..."
            className="w-full bg-transparent text-gray-200 placeholder-gray-500 pl-14 pr-24 py-3 resize-none focus:outline-none"
            rows={1}
            style={{ maxHeight: '120px' }}
          />
          <div className="absolute left-4 flex items-center">
            <button onClick={() => fileInputRef.current?.click()} className="p-1 group">
              <AttachmentIcon />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          </div>
          <div className="absolute right-4 flex items-center space-x-2">
            {isSupported && (
              <button onClick={handleMicClick} className="p-2 group">
                <MicIcon isListening={isListening} />
              </button>
            )}
            {/* Fix: Updated send button to use the new `isSendActive` state. */}
            <button
              onClick={handleSendMessage}
              disabled={!isSendActive}
              className="p-2 rounded-full bg-purple-500/20 disabled:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed group transition-colors"
            >
              <SendIcon isLoading={isStreaming} isActive={isSendActive} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
