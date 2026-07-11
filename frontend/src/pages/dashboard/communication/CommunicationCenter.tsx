import React, { useEffect, useState, useRef } from 'react';
import { apiRequest } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';
import {
  MessageSquare,
  Send,
  Search,
  Paperclip,
  Check,
  Calendar,
  X,
  File,
  Loader2
} from 'lucide-react';

export const CommunicationCenter: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = async (silent = false) => {
    try {
      const data = await apiRequest('/messages/conversations');
      if (Array.isArray(data)) {
        setConversations(data);
      }
    } catch (err) {
      if (!silent) {
        toast.error('Failed to load chat contact logs.');
      }
    }
  };

  const loadMessageHistory = async (contactId: string, silent = false) => {
    try {
      const data = await apiRequest(`/messages/history/${contactId}`);
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (err) {
      if (!silent) {
        toast.error('Failed to load message log history.');
      }
    }
  };

  // Initial load
  useEffect(() => {
    loadConversations();
  }, []);

  // Poll for live conversations/messages
  useEffect(() => {
    const interval = setInterval(() => {
      loadConversations(true);
      if (activeContact) {
        loadMessageHistory(activeContact.id, true);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeContact]);

  useEffect(() => {
    if (activeContact) {
      loadMessageHistory(activeContact.id);
    }
  }, [activeContact]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() && !attachmentUrl) return;

    try {
      let finalContent = messageInput.trim();
      if (attachmentUrl) {
        finalContent += `\n📎 Attachment: [${attachmentName || 'Uploaded File'}](${attachmentUrl})`;
      }

      const sent = await apiRequest('/messages', {
        method: 'POST',
        body: JSON.stringify({
          recipientId: activeContact.id,
          content: finalContent
        })
      });

      setMessages(prev => [...prev, sent]);
      setMessageInput('');
      setAttachmentUrl(null);
      setAttachmentName(null);
      loadConversations(true);
    } catch (err) {
      toast.error('Failed to deliver message.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to Base64
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setUploading(true);
        const base64Data = reader.result as string;

        const data = await apiRequest('/upload', {
          method: 'POST',
          body: JSON.stringify({
            base64Data,
            fileName: file.name,
            mimeType: file.type
          })
        });

        if (data.fileUrl) {
          setAttachmentUrl(data.fileUrl);
          setAttachmentName(file.name);
          toast.success('Attachment uploaded successfully.');
        }
      } catch (err: any) {
        toast.error(err.message || 'File upload failed.');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredConversations = conversations.filter(c =>
    c.contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] border rounded-2xl bg-card shadow-sm flex overflow-hidden">
      {/* 1. Conversations Sidebar List */}
      <div className="w-80 border-r flex flex-col justify-between h-full bg-slate-50/50 dark:bg-slate-900/10">
        <div className="flex flex-col h-full">
          {/* Header Search */}
          <div className="p-4 border-b space-y-3">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <MessageSquare className="h-4.5 w-4.5 text-primary" /> Chat Messages
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 h-9 rounded-lg border bg-background text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-grow overflow-y-auto divide-y divide-border">
            {filteredConversations.map(c => {
              const isActive = activeContact?.id === c.contact.id;
              const hasLastMsg = !!c.lastMessage;
              const isUnread = c.unreadCount > 0;

              return (
                <button
                  key={c.contact.id}
                  onClick={() => setActiveContact(c.contact)}
                  className={`w-full p-4 text-left transition-colors flex items-start space-x-3 text-xs relative ${
                    isActive ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-slate-100/50 dark:hover:bg-slate-800/10'
                  }`}
                >
                  <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                    {c.contact.name.charAt(0)}
                  </div>
                  <div className="flex-grow min-w-0 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{c.contact.name}</span>
                      {hasLastMsg && (
                        <span className="text-[9px] text-slate-400 font-medium">
                          {new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className={`truncate text-slate-400 font-medium ${isUnread ? 'text-primary font-bold' : ''}`}>
                        {hasLastMsg ? c.lastMessage.content : 'Start a chat history.'}
                      </p>
                      {isUnread && (
                        <span className="h-4 min-w-[16px] rounded-full bg-primary text-[9px] font-extrabold text-primary-foreground flex items-center justify-center px-1">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider">
                      {c.contact.role}
                    </span>
                  </div>
                </button>
              );
            })}
            {conversations.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">No active chats.</div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Messages Chat Feed */}
      <div className="flex-grow flex flex-col justify-between h-full bg-card">
        {activeContact ? (
          <>
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-slate-50/20">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-sm">
                  {activeContact.name.charAt(0)}
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{activeContact.name}</h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {activeContact.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {messages.map(msg => {
                const isMine = msg.senderId === user?.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'} text-xs`}
                  >
                    <div
                      className={`max-w-[70%] p-3.5 rounded-2xl shadow-sm relative ${
                        isMine
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : 'bg-slate-100 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      <span className={`text-[8px] mt-1.5 block text-right font-medium ${isMine ? 'text-primary-foreground/75' : 'text-slate-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 border-t space-y-3 bg-slate-50/20">
              {/* Attachment Preview Bar */}
              {attachmentUrl && (
                <div className="flex items-center justify-between p-2 border bg-card rounded-lg text-xs">
                  <div className="flex items-center space-x-2">
                    <File className="h-4 w-4 text-primary" />
                    <span className="truncate font-semibold text-slate-700 dark:text-slate-300 max-w-xs">{attachmentName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachmentUrl(null);
                      setAttachmentName(null);
                    }}
                    className="p-1 rounded-full hover:bg-accent text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-3">
                {/* Upload Button */}
                <label className="p-2.5 rounded-xl border hover:bg-accent cursor-pointer transition-colors relative flex items-center justify-center text-muted-foreground flex-shrink-0">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <Paperclip className="h-4 w-4" />
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>

                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-grow px-4 h-11 rounded-xl border bg-background text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />

                <button
                  type="submit"
                  disabled={!messageInput.trim() && !attachmentUrl}
                  className="p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 transition-colors disabled:opacity-50 flex items-center justify-center flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-12 text-slate-400 text-center space-y-3">
            <MessageSquare className="h-10 w-10 text-muted-foreground/20 mx-auto" />
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Select a Conversation</h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              Select a teacher, student, parent, or admin profile in the sidebar to review chat logs or send files.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default CommunicationCenter;
