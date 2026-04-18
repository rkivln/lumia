import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ArrowLeft, MoreVertical, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ChatService } from '../services/ChatService';
import { Message } from '../types';

interface ChatViewProps {
  chatRoomId: string;
  onBack: () => void;
  otherUserName: string;
}

export default function ChatView({ chatRoomId, onBack, otherUserName }: ChatViewProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = ChatService.subscribeToMessages(chatRoomId, (msgs) => {
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [chatRoomId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    const text = newMessage;
    setNewMessage('');
    await ChatService.sendMessage(chatRoomId, user.uid, text);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-dark-bg flex flex-col">
      {/* Chat Header */}
      <header className="p-6 border-b border-white/5 flex items-center justify-between glass-dark backdrop-blur-3xl sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              {otherUserName}
              <ShieldCheck className="w-4 h-4 text-primary-lime" />
            </h3>
            <span className="text-[10px] text-primary-lime font-bold uppercase tracking-widest">Active Now</span>
          </div>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-full text-white/40">
           <MoreVertical className="w-6 h-6" />
        </button>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 no-scrollbar">
        <div className="text-center py-8">
           <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] text-white/40 font-bold uppercase tracking-widest">Chat began today</span>
        </div>
        
        {messages.map((msg, index) => {
          const isMe = msg.senderId === user?.uid;
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              key={msg.id}
              className={`flex flex-col max-w-[80%] ${isMe ? 'self-end' : 'self-start'}`}
            >
              <div className={`px-5 py-4 rounded-[1.8rem] text-sm font-medium ${
                isMe ? 'bg-primary-lime text-black rounded-tr-none' : 'bg-[#1A1A1E] text-white border border-white/5 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
              <span className={`text-[9px] mt-1 font-bold text-white/20 uppercase tracking-wider ${isMe ? 'text-right' : 'text-left'}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <footer className="p-6 pt-2 bg-dark-bg border-t border-white/10 sticky bottom-0">
        <form onSubmit={handleSend} className="flex gap-3 bg-[#1A1A1E] p-2 rounded-[2rem] border border-white/5">
           <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message your vision..."
              className="flex-1 bg-transparent px-6 py-2 outline-none text-white placeholder:text-white/20 font-medium"
           />
           <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="w-12 h-12 bg-primary-lime rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(191,240,0,0.3)] disabled:opacity-50 transition-all"
           >
              <Send className="w-5 h-5 fill-black" />
           </button>
        </form>
      </footer>
    </div>
  );
}
